const { validationResult } = require('express-validator');
const Category = require('../models/category');
const Budget = require('../models/budget');

exports.addCategory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const budget = await Budget.findOne({ where: { id: req.params.budgetId, userId: req.user.id } });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });

        const category = await Category.create({
            name: req.body.name,
            estimatedCost: req.body.estimatedCost,
            actualCost: req.body.actualCost,
            budgetId: budget.id
        });

        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        category.name = req.body.name || category.name;
        category.estimatedCost = req.body.estimatedCost ?? category.estimatedCost;
        category.actualCost = req.body.actualCost ?? category.actualCost;

        await category.save();
        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
