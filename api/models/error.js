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
        hash: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        resolved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        projectId: {
            type: DataTypes.INTEGER,
            field: 'project_id'
        }
    }, {
        underscored: true,
        paranoid: false,
        tableName: 'errors',
        classMethods: {
            associate: function (models) {
                this.belongsTo(models.project);
                this.hasMany(models.errorEvent);
            }
        }
    });
};

module.exports = SystemError;