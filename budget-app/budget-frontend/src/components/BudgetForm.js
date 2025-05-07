import CategoryForm from './CategoryForm';

function BudgetForm({
    title,
    setTitle,
    categories,
    setCategories,
    handleSubmit,
    addCategoryField,
    removeCategoryField,
    error,
    buttonLabel
}) {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}

            <input
                type="text"
                placeholder="Budget Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white"
            />

            <h2 className="font-semibold mb-2">Categories</h2>

            {categories.map((cat, index) => (
                <CategoryForm
                    key={index}
                    index={index}
                    cat={cat}
                    categories={categories}
                    setCategories={setCategories}
                    removeCategoryField={removeCategoryField}
                />
            ))}

            <button
                type="button"
                onClick={addCategoryField}
                className="bg-blue-500 text-white px-3 py-1 rounded"
            >
                Add Category
            </button>

            <div>
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    {buttonLabel}
                </button>
            </div>
        </form>
    );
}

export default BudgetForm;
