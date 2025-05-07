const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Budget = sequelize.define('Budget', {
    title: { type: DataTypes.STRING, allowNull: false },
    currency: { type: DataTypes.STRING, defaultValue: 'EUR' }
});

Budget.belongsTo(User);
User.hasMany(Budget);

module.exports = Budget;
