/**
 *
 * Project model for DataTypes ORM
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}|Model}
 * @constructor
 *
 */
var Project = function (sequelize, DataTypes) {
  return sequelize.define('projectUsers', {
    role: {
      type: DataTypes.ENUM('user', 'poweruser', 'owner'),
      defaultValue: 'user',
      allowNull: false
    }
  }, {
    underscored: true,
    paranoid: false,
    timestamps: false,
    tableName: 'project_users'
  });
};

module.exports = Project;