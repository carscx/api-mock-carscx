'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
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
    ]

    for (const category of categories) {
      const exists = await queryInterface.rawSelect(
        'Categories',
        {
          where: {
            name: category.name,
          },
        },
        ['id']
      )

      if (!exists) {
        await queryInterface.bulkInsert('Categories', [category], {})
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'Categories',
      {
        name: ['Technology', 'Science', 'Health'],
      },
      {}
    )
  },
}
