require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const budgetRoutes = require('./routes/budgets');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);

// Test DB connection & sync models
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database connected & models synced');
        app.listen(5000, () => console.log('Server running on port 5000'));
    })
    .catch((err) => console.error('Database connection failed:', err));
