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
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.CHAR(60),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
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
            type: DataTypes.STRING(30),
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.STRING(30),
            field: 'last_name'
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
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
            type: DataTypes.STRING(45),
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