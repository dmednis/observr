'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'errors',
        'last_occurrence',
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
        }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('errors', 'last_occurrence');
  }
};
