import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getBudgets } from '../services/budgetService';
import { Bar } from 'react-chartjs-2';
import Spinner from '../components/Spinner';
import 'chart.js/auto';

function ComparePage() {
    const [searchParams] = useSearchParams();
    const ids = searchParams.get('ids')?.split(',') || [];
    const navigate = useNavigate();

    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBudgets();
    }, []);

    const loadBudgets = async () => {
        try {
            const response = await getBudgets();
            const selected = response.data.filter(b => ids.includes(b.id.toString()));
            if (selected.length < 2) {
                setError('Please select at least two budgets.');
            }
            setBudgets(selected);
        } catch {
            setError('Failed to load budgets');
        }
    };

    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (budgets.length < 2) return <Spinner />;

    const chartData = {
        labels: budgets.map(b => b.title),
        datasets: [
            {
                label: 'Total Estimated €',
                data: budgets.map(b => 
                    b.Categories.reduce((sum, cat) => sum + cat.estimatedCost, 0)
                ),
                backgroundColor: '#3b82f6'
            },
            {
                label: 'Total Actual €',
                data: budgets.map(b => 
                    b.Categories.reduce((sum, cat) => sum + cat.actualCost, 0)
                ),
                backgroundColor: '#10b981'
            }
        ]
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow dark:bg-gray-700 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Compare Budgets</h1>
            <Bar data={chartData} />

            <button
                onClick={() => navigate('/')}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Back to Dashboard
            </button>
        </div>
    );
}

export default ComparePage;
