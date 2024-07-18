'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      {
        id: Sequelize.literal('UUID()'),
        name: 'create_post',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        name: 'edit_post',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        name: 'delete_post',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        name: 'view_post',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    for (const permission of permissions) {
      const exists = await queryInterface.rawSelect(
        'Permissions',
        {
          where: {
            name: permission.name,
          },
        },
        ['id']
      )

      if (!exists) {
        await queryInterface.bulkInsert('Permissions', [permission], {})
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'Permissions',
      {
        name: ['create_post', 'edit_post', 'delete_post', 'view_post'],
      },
      {}
    )
  },
}
