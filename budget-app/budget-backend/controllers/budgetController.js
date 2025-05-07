const { validationResult } = require('express-validator');
const Budget = require('../models/budget');
const Category = require('../models/category');

exports.createBudget = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const budget = await Budget.create({
            title: req.body.title,
            userId: req.user.id
        });
        res.json(budget);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.findAll({ 
            where: { userId: req.user.id },
            include: [Category]
        });
        res.json(budgets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });

        budget.title = req.body.title || budget.title;
        await budget.save();

        res.json(budget);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });

        await budget.destroy();
        res.json({ message: 'Budget deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
