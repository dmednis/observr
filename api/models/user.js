var md5 = require('md5');
/**
 *
 * User model for Sequelize ORM
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|Model}
 * @constructor
 *
 */
var User = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING
        },
        emailHash: {
            type: DataTypes.VIRTUAL,
            get: function () {
                if (this.get('email')) {
                    return md5(this.get('email'));
                } else {
                    return null;
                }
            }
        },
        firstName: {
            type: DataTypes.STRING,
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.STRING,
            field: 'last_name'
        },
        status: {
            type: DataTypes.BOOLEAN
        },
        role: {
            type: DataTypes.ENUM('user', 'poweruser', 'admin'),
            defaultValue: 'user',
            allowNull: false
        },
        settings: {
            type: DataTypes.JSONB
        },
        lastLogin: {
            type: DataTypes.DATE,
            field: 'last_login'
        },
        lastLoginIP: {
            type: DataTypes.STRING,
            field: 'last_login_ip'
        }
    }, {
        underscored: true,
        paranoid: true,
        tableName: 'users',
        classMethods: {
            associate: function (models) {
                this.belongsToMany(models.project, {as: 'projects', through: models.projectUsers});
            }
        }
    });
};

module.exports = User;