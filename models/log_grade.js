
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');


const Grade = sequelize.define('Grade', {
    // العمود الأول: id (Primary Key)
    id: {
        type: DataTypes.INTEGER,        
        autoIncrement: true,            
        primaryKey: true,               
    },

    name: {
        type: DataTypes.STRING,        
        allowNull: false,               
        unique: true,                 
    },

}, {
    
    tableName: 'grades', 
    timestamps: true,    
    
});


module.exports = Grade;