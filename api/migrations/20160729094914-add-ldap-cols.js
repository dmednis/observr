'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'users',
            'ldap',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                default: false
            }
        ).then(function () {
            return queryInterface.addColumn(
                'users',
                'ldap_info',
                {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            );
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('users', 'ldap').then(function () {
            return queryInterface.removeColumn('users', 'ldap_info');
        })
    }
};
