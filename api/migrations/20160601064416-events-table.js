'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('events', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING(30)
            },
            data: {
                type: Sequelize.JSONB
            },
            project_id: {
                type: Sequelize.INTEGER,

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

        return queryInterface.dropTable('events');

    }
};
