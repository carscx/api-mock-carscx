'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Categories',
      [
        {
          name: 'Technology',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Science',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Health',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {})
  },
}
