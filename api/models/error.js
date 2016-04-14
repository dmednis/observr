/**
 *
 * Project model for Sequelize ORM
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|Model}
 * @constructor
 *
 */
var SystemError = function (sequelize, DataTypes) {
    return sequelize.define('error', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING

        },
        stack: {
            type: DataTypes.STRING(4096)
        },
        hash: {
            type: DataTypes.STRING(32)
        },
        data: {
            type: DataTypes.JSONB
        }
    }, {
        underscored: true,
        paranoid: true,
        tableName: 'error',
        classMethods: {
            associate: function (models) {
                this.belongsTo(models.project)
            }
        }
    });
};

module.exports = SystemError;