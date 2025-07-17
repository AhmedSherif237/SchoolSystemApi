// src/models/attendance.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const Student = require('./log_student'); 
const User = require('./log_user');

const AttendanceRecord = sequelize.define('AttendanceRecord', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
            model: Student,
            key: 'id',
        }
    },
    record_date: {
        type: DataTypes.DATEONLY, 
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
        allowNull: false,
        defaultValue: 'absent', 
    },
    late_time: {
        type: DataTypes.TIME, 
        allowNull: true, 
    },
    reason: {
        type: DataTypes.STRING, 
        allowNull: true, 
    },
    recorded_by_user_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        }
    }
}, {
    tableName: 'attendance_records', 
    indexes: [ 
        {
            unique: true,
            fields: ['student_id', 'record_date']
        }
    ]
});

AttendanceRecord.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(AttendanceRecord, { foreignKey: 'student_id' }); 

AttendanceRecord.belongsTo(User, { foreignKey: 'recorded_by_user_id' });
User.hasMany(AttendanceRecord, { foreignKey: 'recorded_by_user_id' }); 

module.exports = AttendanceRecord;