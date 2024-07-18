'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roles = [
      {
        id: Sequelize.literal('UUID()'),
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    for (const role of roles) {
      const exists = await queryInterface.rawSelect(
        'Roles',
        {
          where: {
            name: role.name,
          },
        },
        ['id']
      )

      if (!exists) {
        await queryInterface.bulkInsert('Roles', [role], {})
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'Roles',
      {
        name: ['admin'],
      },
      {}
    )
  },
}
