const express = require('express');
const router = express.Router();
const optionController = require('../controllers/option.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth');

router.get('/', optionController.getActiveOptions);
router.post('/', authenticateToken, authorizeRoles('admin'), optionController.createOption);
router.put('/:id', authenticateToken, authorizeRoles('admin'), optionController.updateOption);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), optionController.deleteOption);

module.exports = router;
