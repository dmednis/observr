'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('system_logs', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            event: {
                type: Sequelize.STRING(30),
                allowNull: false
            },
            data: {
                type: Sequelize.JSONB
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    down: function (queryInterface, Sequelize) {

        return queryInterface.dropTable('system_logs');

    }
};
