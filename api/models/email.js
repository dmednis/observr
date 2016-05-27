/**
 *
 * Email model for Sequelize ORM
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|Model}
 * @constructor
 *
 */
var Email = function (sequelize, DataTypes) {
    return sequelize.define('email', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        to: {
            type: DataTypes.STRING(255)

        },
        type: {
            type: DataTypes.STRING(30)
        },
        status: {
            type: DataTypes.ENUM('pending', 'sent', 'failed')
        },
        data: {
            type: DataTypes.JSONB
        },
        sent_at: {
            type: DataTypes.DATE
        }
    }, {
        underscored: true,
        paranoid: false,
        updatedAt: false,
        tableName: 'emails',
        classMethods: {

        }
    });
};

module.exports = Email;