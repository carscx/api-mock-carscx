// models/userRole.js
'use strict'

module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  })

  return UserRole
}
