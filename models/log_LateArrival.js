const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const Student = require('./log_student.js'); 

const LateArrival = sequelize.define('LateArrival', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_id: { // Foreign Key
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Student,
            key: 'id',
        }
    },
    date: { 
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    reason: { 
        type: DataTypes.STRING,
        allowNull: false, 
    },
    delay_minutes: { 
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {
    tableName: 'late_arrivals',
    indexes: [ // مهم نعمل index عشان نتأكد إن مفيش تكرار لنفس التأخير في نفس اليوم
        {
            unique: true,
            fields: ['student_id', 'date']
        }
    ]
});

module.exports = LateArrival;
