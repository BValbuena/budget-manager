const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { 
    createBudget, 
    getBudgets, 
    updateBudget, 
    deleteBudget 
} = require('../controllers/budgetController');

const router = express.Router();

router.post('/', auth, body('title').notEmpty(), createBudget);
router.get('/', auth, getBudgets);
router.put('/:id', auth, updateBudget);
router.delete('/:id', auth, deleteBudget);

module.exports = router;
