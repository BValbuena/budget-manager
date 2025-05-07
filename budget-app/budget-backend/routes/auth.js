const express = require('express');
const { body } = require('express-validator');
const { register } = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], register);

const { login } = require('../controllers/authController');

router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], login);

router.put('/profile', authMiddleware, updateProfile);
router.post('/reset', resetPassword);

module.exports = router;
