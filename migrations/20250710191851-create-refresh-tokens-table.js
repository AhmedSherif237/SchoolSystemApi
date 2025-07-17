
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    // create table in db, should be the same as the model
    await queryInterface.createTable('refreshTokens', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: { 
        type: Sequelize.STRING(512),
        allowNull: false,
        unique: true 
      },
      userId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'users', 
          key: 'id',
        },
        onUpdate: 'CASCADE', // لو الـ ID بتاع المستخدم اتغير، يتحدث هنا
        onDelete: 'CASCADE' // لو المستخدم اتحذف، امسح كل الـ Refresh Tokens بتاعته
      },
      expiresAt: { 
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: { 
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: { 
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('refresh_tokens');
  }
};