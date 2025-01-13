const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
    },
    balance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 100000000000.00, // More reasonable initial balance
    }
}, {
    tableName: 'accounts',
    timestamps: true,
    underscored: true
});

module.exports = Account;