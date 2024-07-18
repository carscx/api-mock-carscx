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

    // Verificar si el rol de admin ya está asignado al usuario
    const userRoleExists = await queryInterface.rawSelect(
      'UserRoles',
      {
        where: {
          userId: userId,
          roleId: adminRoleId,
        },
      },
      ['id']
    )

    if (!userRoleExists) {
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
    }

    // Verificar si los permisos ya están asignados al rol de admin
    for (const permission of permissions) {
      const rolePermissionExists = await queryInterface.rawSelect(
        'RolePermissions',
        {
          where: {
            roleId: adminRoleId,
            permissionId: permission.id,
          },
        },
        ['id']
      )

      if (!rolePermissionExists) {
        await queryInterface.bulkInsert(
          'RolePermissions',
          [
            {
              roleId: adminRoleId,
              permissionId: permission.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          {}
        )
      }
    }
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
