"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // تعديل عمود student_id_number NOT NULL
    await queryInterface.changeColumn("students", "student_id_number", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    // تعديل عمود class_name NOT NULL
    await queryInterface.changeColumn("students", "class_name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("students", "student_id_number", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    await queryInterface.changeColumn("students", "class_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
