'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('projects', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.STRING(255)
      },
      identifier: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: true
      },
      api_key: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      options: {
        type: Sequelize.JSONB
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

    return queryInterface.dropTable('projects');

  }
};
