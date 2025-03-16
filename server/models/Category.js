const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'category',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    thumbnail_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_leaf: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    url_path: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
    }
}, {
    tableName: 'category',
    timestamps: true,
},
    {
        indexes: [
            {
                unique: true,
                fields: ['parent_id'],
            }
        ]
    });

module.exports = Category;