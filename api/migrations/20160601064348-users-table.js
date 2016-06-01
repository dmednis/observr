'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   
      return queryInterface.createTable('users', { 
        iid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
          username: {
              type: Sequelize.STRING(15),
              allowNull: false,
              unique: true
          },
          password: {
              type: Sequelize.CHAR(60),
              allowNull: false
          },
          email: {
              type: Sequelize.STRING(255),
              allowNull: false
          },
          first_name: {
              type: Sequelize.STRING(30)
          },
          last_name: {
              type: Sequelize.STRING(30)
          },
          status: {
              type: Sequelize.BOOLEAN,
              defaultValue: true,
              allowNull: false
          },
          role: {
              type: Sequelize.ENUM('user', 'poweruser', 'admin'),
              defaultValue: 'user',
              allowNull: false
          },
          settings: {
              type: Sequelize.JSONB
          },
          last_login: {
              type: Sequelize.DATE
          },
          last_login_ip: {
              type: Sequelize.STRING(45)
          },
          created_at: {
              type: Sequelize.DATE,
              allowNull: false
          },
          updated_at: {
              type: Sequelize.DATE,
              allowNull: false
          },
          deleted_at: {
              type: Sequelize.DATE
          }
      });
    
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
