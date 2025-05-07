const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const passwordHash = await bcrypt.hash(password, 10);

        user = await User.create({ name, email, passwordHash });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

    exports.login = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
        const { email, password } = req.body;
    
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    
            res.json({ token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    };
    
    exports.updateProfile = async (req, res) => {
        const { name, email } = req.body;
        try {
            req.user.name = name || req.user.name;
            req.user.email = email || req.user.email;
            await req.user.save();
            res.json({ message: 'Profile updated' });
        } catch {
            res.status(500).json({ message: 'Error updating profile' });
        }
    };
    
    exports.resetPassword = async (req, res) => {
        const { email, newPassword } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(404).json({ message: 'User not found' });
    
            user.passwordHash = await bcrypt.hash(newPassword, 10);
            await user.save();
            res.json({ message: 'Password updated' });
        } catch {
            res.status(500).json({ message: 'Error resetting password' });
        }
    };
    
};
