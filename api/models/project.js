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
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING(255)
        },
        identifier: {
            type: DataTypes.STRING(60),
            allowNull: false,
            unique: true
        },
        apiKey: {
            type: DataTypes.STRING(32),
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
                this.belongsToMany(models.user, {as: 'members', through: models.projectUsers});
                this.hasMany(models.error);
            }
        }
    });
};

module.exports = Project;