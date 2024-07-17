'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [roles] = await queryInterface.sequelize.query(
      'SELECT id FROM Roles WHERE name = "admin"'
    )
    const adminRoleId = roles[0].id

    const [permissions] = await queryInterface.sequelize.query('SELECT id FROM Permissions')
    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE email = "karscx@gmail.com"'
    )
    const userId = users[0].id

    // Asignar el rol de admin al usuario
    await queryInterface.bulkInsert(
      'UserRoles',
      [
        {
          userId: userId,
          roleId: adminRoleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )

    // Asignar todos los permisos al rol de admin
    const rolePermissions = permissions.map((permission) => ({
      roleId: adminRoleId,
      permissionId: permission.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
    await queryInterface.bulkInsert('RolePermissions', rolePermissions, {})
  },

  down: async (queryInterface, Sequelize) => {
    const [roles] = await queryInterface.sequelize.query(
      'SELECT id FROM Roles WHERE name = "admin"'
    )
    const adminRoleId = roles[0].id

    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE email = "karscx@gmail.com"'
    )
    const userId = users[0].id

    await queryInterface.bulkDelete(
      'UserRoles',
      {
        userId: userId,
        roleId: adminRoleId,
      },
      {}
    )

    await queryInterface.bulkDelete(
      'RolePermissions',
      {
        roleId: adminRoleId,
      },
      {}
    )
  },
}
