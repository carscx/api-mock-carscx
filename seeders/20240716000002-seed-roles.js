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
    await queryInterface.bulkInsert('Roles', roles, {})
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
