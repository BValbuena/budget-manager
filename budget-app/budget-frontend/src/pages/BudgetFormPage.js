import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createBudget, getBudgets, updateBudget } from '../services/budgetService';
import { addCategory, updateCategory, deleteCategory } from '../services/categoryService';
import BudgetForm from '../components/BudgetForm';

function BudgetFormPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) loadBudget();
        else setCategories([{ name: '', estimatedCost: 0, actualCost: 0 }]);
    }, [id]);

    const loadBudget = async () => {
        try {
            const response = await getBudgets();
            const budget = response.data.find((b) => b.id.toString() === id);
            if (!budget) return navigate('/');
            setTitle(budget.title);
            setCategories(
                budget.Categories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    estimatedCost: cat.estimatedCost,
                    actualCost: cat.actualCost
                }))
            );
        } catch {
            navigate('/login');
        }
    };

    const addCategoryField = () => {
        setCategories([...categories, { name: '', estimatedCost: 0, actualCost: 0 }]);
    };

    const removeCategoryField = (index) => {
        const catToRemove = categories[index];
        if (catToRemove.id) deleteCategory(catToRemove.id).catch(() => {});
        setCategories(categories.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let budgetId = id;
            if (!id) {
                const response = await createBudget(title);
                budgetId = response.data.id;
            } else {
                await updateBudget(id, title);
            }

            for (const cat of categories) {
                if (!cat.name) continue;
                if (cat.id) {
                    await updateCategory(cat.id, cat.name, cat.estimatedCost, cat.actualCost);
                } else {
                    await addCategory(budgetId, cat.name, cat.estimatedCost, cat.actualCost);
                }
            }

            navigate('/');
        } catch {
            setError('Failed to save budget.');
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow dark:bg-gray-700 dark:text-white">
            <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Budget' : 'Create Budget'}</h1>
            <BudgetForm
                title={title}
                setTitle={setTitle}
                categories={categories}
                setCategories={setCategories}
                handleSubmit={handleSubmit}
                addCategoryField={addCategoryField}
                removeCategoryField={removeCategoryField}
                error={error}
                buttonLabel={id ? 'Update Budget' : 'Create Budget'}
            />
        </div>
    );
}

export default BudgetFormPage;
