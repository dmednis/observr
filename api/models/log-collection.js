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
var LogCollection = function (sequelize, DataTypes) {
    return sequelize.define('logCollection', {
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
        tableName: 'log_collections',
        classMethods: {
            associate: function (models) {
                this.belongsTo(models.project)
            }
        }
    });
};

module.exports = LogCollection;