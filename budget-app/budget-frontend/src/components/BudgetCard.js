import { useNavigate } from 'react-router-dom';

function BudgetCard({ budget, selected, toggleSelect, handleDelete }) {
    const navigate = useNavigate();
    const currency = (amount) => 
        Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

    return (
        <div className="border p-4 rounded flex justify-between items-center bg-white shadow-sm dark:bg-gray-700">
            <div>
                <input 
                    type="checkbox" 
                    checked={selected.includes(budget.id)}
                    onChange={() => toggleSelect(budget.id)}
                    className="mr-2"
                />
                <h2 className="font-semibold text-lg inline">{budget.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                    Created: {new Date(budget.createdAt).toLocaleDateString()} | Updated: {new Date(budget.updatedAt).toLocaleDateString()}
                </p>
            </div>
            <div className="space-x-2">
                <button
                    onClick={() => navigate(`/budget/${budget.id}/summary`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    Summary
                </button>
                <button
                    onClick={() => navigate(`/budget/new?id=${budget.id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(budget.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default BudgetCard;
