'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('emails', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            to: {
                type: Sequelize.STRING(255)

            },
            type: {
                type: Sequelize.STRING(30)
            },
            status: {
                type: Sequelize.ENUM('pending', 'sent', 'failed')
            },
            data: {
                type: Sequelize.JSONB
            },
            sent_at: {
                type: Sequelize.DATE
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    down: function (queryInterface, Sequelize) {

        return queryInterface.dropTable('emails');

    }
};
