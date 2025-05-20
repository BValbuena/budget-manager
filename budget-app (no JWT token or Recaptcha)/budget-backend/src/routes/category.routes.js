const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', categoryController.getCategories);
router.get('/with-active-options', categoryController.getCategoriesWithActiveOptions);
router.post('/', authenticateToken, authorizeRoles('admin'), categoryController.createCategory);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), categoryController.deleteCategory);

module.exports = router;
