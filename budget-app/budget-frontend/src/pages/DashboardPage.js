import { useState, useEffect } from 'react';
import { getBudgets, deleteBudget } from '../services/budgetService';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import BudgetCard from '../components/BudgetCard';

function DashboardPage() {
    const [budgets, setBudgets] = useState([]);
    const [selected, setSelected] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const response = await getBudgets();
            setBudgets(response.data);
        } catch {
            setError('Failed to load budgets');
            localStorage.removeItem('token');
            navigate('/login');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this budget?')) return;
        await deleteBudget(id);
        fetchBudgets();
    };

    const toggleSelect = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="p-6 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Your Budgets</h1>
            <button
                onClick={() => navigate('/budget/new')}
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
                Create New Budget
            </button>

            {loading ? <Spinner /> : (
                budgets.length === 0 ? (
                    <p>No budgets found.</p>
                ) : (
                    budgets.map((budget) => (
                        <BudgetCard
                            key={budget.id}
                            budget={budget}
                            selected={selected}
                            toggleSelect={toggleSelect}
                            handleDelete={handleDelete}
                        />
                    ))
                )
            )}

            {selected.length >= 2 && (
                <button
                    onClick={() => navigate(`/compare?ids=${selected.join(',')}`)}
                    className="mt-4 bg-purple-500 text-white px-4 py-2 rounded"
                >
                    Compare Selected Budgets
                </button>
            )}
        </div>
    );
}

export default DashboardPage;
