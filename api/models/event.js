/**
 *
 * Event model for Sequelize ORM
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|Model}
 * @constructor
 *
 */
var SystemEvent = function (sequelize, DataTypes) {
    return sequelize.define('event', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING
        },
        data: {
            type: DataTypes.JSONB
        }
    }, {
        underscored: true,
        paranoid: true,
        tableName: 'event',
        classMethods: {
            associate: function (models) {
                this.belongsTo(models.project)
            }
        }
    });
};

module.exports = SystemEvent;