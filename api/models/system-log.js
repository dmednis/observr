/**
 *
 * Log Collection model for Sequelize ORM
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|Model}
 * @constructor
 *
 */
var SystemLog = function (sequelize, DataTypes) {
    return sequelize.define('systemLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        event: {
            type: DataTypes.STRING

        },
        data: {
            type: DataTypes.JSONB
        }
    }, {
        underscored: true,
        tableName: 'system_logs',
        classMethods: {

        }
    });
};

module.exports = SystemLog;