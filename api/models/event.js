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
            type: DataTypes.STRING(30)
        },
        data: {
            type: DataTypes.JSONB
        },
        projectId: {
            type: DataTypes.INTEGER,
            field: 'project_id'
        }
    }, {
        underscored: true,
        paranoid: false,
        updatedAt: false,
        tableName: 'events',
        classMethods: {
            associate: function (models) {
                this.belongsTo(models.project)
            }
        }
    });
};

module.exports = SystemEvent;