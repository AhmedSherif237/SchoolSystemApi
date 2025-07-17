const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config'); 

const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    token: { 
        type: DataTypes.STRING(512), 
        allowNull: false,
        unique: true, 
    },
    userId: { //fk
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
            model: 'users', // اسم الجدول الفعلي للمستخدمين في الداتابيز
            key: 'id',
        },
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE', 
    },
    expiresAt: { 
        type: DataTypes.DATE,
        allowNull: false,
    },
    
}, {
    tableName: 'refreshTokens',
    timestamps: true,
});

module.exports = RefreshToken;