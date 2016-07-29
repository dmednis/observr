'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('project_users', {
            project_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                field: 'project_id',
                references: {
                    model: 'projects',
                    key: 'id'
                }
            },
            user_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
                field: 'user_id',
                references: {
                    model: 'users',
                    key: 'id'
                }
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
