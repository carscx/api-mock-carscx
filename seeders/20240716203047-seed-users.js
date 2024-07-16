'use strict'

const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('123456', 10)
    const users = [
      {
        id: Sequelize.literal('UUID()'),
        name: 'Carlos Santos',
        email: 'karscx@gmail.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await queryInterface.bulkInsert('Users', users, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'Users',
      {
        email: 'karscx@gmail.com',
      },
      {}
    )
  },
}
