'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('project_users', {
            project_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM('member', 'admin'),
                defaultValue: 'member',
                allowNull: false
            }
        });
    },

    down: function (queryInterface, Sequelize) {

        return queryInterface.dropTable('project_users');

    }
};
