// models/rolePermission.js
'use strict'

module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define('RolePermission', {
    roleId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    permissionId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  })

  return RolePermission
}
