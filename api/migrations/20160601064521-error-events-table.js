'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('error_events', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            message: {
                type: Sequelize.STRING(255),
                allowNull: false

            },
            stack: {
                type: Sequelize.STRING(4096)
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

        return queryInterface.dropTable('error_events');

    }
};
