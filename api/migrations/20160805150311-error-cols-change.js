'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'errors',
        'message',
        {
          type: Sequelize.STRING(512),
          allowNull: false
        }
    ).then(function () {
      return queryInterface.addColumn(
          'errors',
          'stack',
          {
            type: Sequelize.STRING(10240)
          }
      );
    }).then(function () {
      return queryInterface.removeColumn('error_events', 'stack');
    }).then(function () {
      return queryInterface.removeColumn('error_events', 'message');
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
        'error_events',
        'message',
        {
          type: Sequelize.STRING(512),
          allowNull: false
        }
    ).then(function () {
      return queryInterface.addColumn(
          'error_events',
          'stack',
          {
            type: Sequelize.STRING(10240)
          }
      );
    }).then(function () {
      return queryInterface.removeColumn('errors', 'stack');
    }).then(function () {
      return queryInterface.removeColumn('errors', 'message');
    });
  }
};
