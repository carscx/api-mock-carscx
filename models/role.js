'use strict'
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: 'UserRole',
        foreignKey: 'roleId',
        otherKey: 'userId',
      })
      this.belongsToMany(models.Permission, {
        through: 'RolePermission',
        foreignKey: 'roleId',
        otherKey: 'permissionId',
      })
    }
  }

  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Role',
    }
  )

  return Role
}
