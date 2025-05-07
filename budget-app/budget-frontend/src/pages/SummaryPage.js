import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBudgets } from '../services/budgetService';
import { Pie, Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import { CSVLink } from 'react-csv';
import Spinner from '../components/Spinner';
import 'chart.js/auto';

function SummaryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [budget, setBudget] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBudget();
    }, []);

    const loadBudget = async () => {
        try {
            const response = await getBudgets();
            const found = response.data.find((b) => b.id.toString() === id);
            if (!found) return navigate('/');
            setBudget(found);
        } catch {
            setError('Failed to load budget');
        }
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text(`Budget Report: ${budget.title}`, 10, 10);
        doc.text(`Currency: EUR`, 10, 20);

        budget.Categories.forEach((cat, index) => {
            doc.text(
                `${index + 1}. ${cat.name} - Estimated: €${cat.estimatedCost} | Actual: €${cat.actualCost}`,
                10,
                30 + index * 10
            );
        });

        doc.save(`${budget.title}_report.pdf`);
    };

    if (!budget) return <Spinner />;

    const estimatedTotal = budget.Categories.reduce((sum, cat) => sum + cat.estimatedCost, 0);
    const actualTotal = budget.Categories.reduce((sum, cat) => sum + cat.actualCost, 0);
    const difference = actualTotal - estimatedTotal;

    const pieData = {
        labels: budget.Categories.map((cat) => cat.name),
        datasets: [
            {
                data: budget.Categories.map((cat) => cat.actualCost),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
            }
        ]
    };

    const barData = {
        labels: budget.Categories.map((cat) => cat.name),
        datasets: [
            {
                label: 'Estimated €',
                data: budget.Categories.map((cat) => cat.estimatedCost),
                backgroundColor: '#3b82f6'
            },
            {
                label: 'Actual €',
                data: budget.Categories.map((cat) => cat.actualCost),
                backgroundColor: '#10b981'
            }
        ]
    };

    const currency = (amount) =>
        Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow-md dark:bg-gray-700 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Budget Summary: {budget.title}</h1>
            {error && <div className="text-red-500 mb-2">{error}</div>}

            <div className="mb-4">
                <p><strong>Total Estimated:</strong> {currency(estimatedTotal)}</p>
                <p><strong>Total Actual:</strong> {currency(actualTotal)}</p>
                <p><strong>Difference:</strong> {currency(difference)}</p>
            </div>

            <div className="mb-4">
                {budget.Categories.map((cat, index) => (
                    <p key={index}>
                        {cat.name}: {currency(cat.actualCost)}
                        {cat.actualCost > cat.estimatedCost && (
                            <span className="text-red-500 font-bold ml-2">Over budget!</span>
                        )}
                    </p>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Spending Distribution</h2>
                    <Pie data={pieData} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-2">Estimated vs Actual</h2>
                    <Bar data={barData} />
                </div>
            </div>

            <button
                onClick={exportPDF}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Export PDF Report
            </button>

            <CSVLink
                data={budget.Categories.map(cat => ({
                    name: cat.name,
                    estimatedCost: cat.estimatedCost,
                    actualCost: cat.actualCost
                }))}
                filename={`${budget.title}_categories.csv`}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ml-2"
            >
                Export CSV
            </CSVLink>
        </div>
    );
}

export default SummaryPage;
