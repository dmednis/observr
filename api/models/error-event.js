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
var SystemErrorEvent = function (sequelize, DataTypes) {
    return sequelize.define('errorEvent', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        data: {
            type: DataTypes.JSONB
        }
    }, {
        underscored: true,
        paranoid: false,
        updatedAt: false,
        tableName: 'error_events',
        classMethods: {
            associate: function (models) {
                this.belongsTo(models.error);
            }
        }
    });
};

module.exports = SystemErrorEvent;