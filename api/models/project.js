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
var Project = function (sequelize, DataTypes) {
    return sequelize.define('project', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        identifier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apiKey: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'api_key'
        },
        options: {
            type: DataTypes.JSONB
        }
    }, {
        underscored: true,
        paranoid: true,
        tableName: 'projects',
        classMethods: {
            associate: function (models) {
                this.belongsToMany(models.user, {through: models.projectUsers});
                this.hasMany(models.error);
            }
        }
    });
};

module.exports = Project;