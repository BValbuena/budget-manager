const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const { 
    addCategory, 
    updateCategory, 
    deleteCategory 
} = require('../controllers/categoryController');

const router = express.Router();

router.post('/:budgetId', auth, [
    body('name').notEmpty(),
    body('estimatedCost').isFloat(),
    body('actualCost').isFloat()
], addCategory);

router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

module.exports = router;
