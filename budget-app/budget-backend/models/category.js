const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Budget = require('./budget');

const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false },
    estimatedCost: { type: DataTypes.FLOAT, defaultValue: 0 },
    actualCost: { type: DataTypes.FLOAT, defaultValue: 0 }
});

Category.belongsTo(Budget);
Budget.hasMany(Category);

module.exports = Category;
