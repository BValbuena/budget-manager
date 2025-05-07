function CategoryForm({ index, cat, categories, setCategories, removeCategoryField }) {

    const handleChange = (field, value) => {
        const updated = [...categories];
        updated[index][field] = field.includes('Cost') ? parseFloat(value) : value;
        setCategories(updated);
    };

    return (
        <div className="flex space-x-2 mb-2 items-center">
            <input
                type="text"
                placeholder="Name"
                value={cat.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-1/3 p-2 border rounded dark:bg-gray-600 dark:text-white"
            />
            <input
                type="number"
                placeholder="Estimated €"
                value={cat.estimatedCost}
                onChange={(e) => handleChange('estimatedCost', e.target.value)}
                className="w-1/4 p-2 border rounded dark:bg-gray-600 dark:text-white"
            />
            <input
                type="number"
                placeholder="Actual €"
                value={cat.actualCost}
                onChange={(e) => handleChange('actualCost', e.target.value)}
                className="w-1/4 p-2 border rounded dark:bg-gray-600 dark:text-white"
            />
            <button
                type="button"
                onClick={() => removeCategoryField(index)}
                className="text-red-500 hover:text-red-700"
            >
                Remove
            </button>
        </div>
    );
}

export default CategoryForm;
