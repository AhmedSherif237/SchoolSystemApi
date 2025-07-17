const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");
const Grade = require("./log_grade.js");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    student_id_number: {
      // 0523034
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    class_name: {
      // wheeler2 مثلا
      type: DataTypes.STRING,
      allowNull: true,
    },

    grade_id: {
      // fk ملكش دعوه بيه
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Grade,
        key: "id",
      },
    },

    student_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    parent_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "students",
  }
);

module.exports = Student;
