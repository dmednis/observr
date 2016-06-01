'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.createTable('errors', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        hash: {
          type: Sequelize.STRING(32),
          allowNull: false,
        },
        resolved: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        project_id: {
          type: Sequelize.INTEGER
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });
  },

  down: function (queryInterface, Sequelize) {

      return queryInterface.dropTable('errors');

  }
};
