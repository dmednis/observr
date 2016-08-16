'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('events', 'updated_at');
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.addColumn(
          'events',
          'updated_at',
          {
              type: Sequelize.DATE,
              allowNull: false
          }
      );
  }
};
