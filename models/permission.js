// models/permission.js
'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Permission extends Model {
    static associate(models) {
      this.belongsToMany(models.Role, {
        through: 'RolePermission',
        foreignKey: 'permissionId',
        otherKey: 'roleId',
      })
    }
  }

  Permission.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Permission',
    }
  )

  return Permission
}
