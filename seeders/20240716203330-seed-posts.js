'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener el ID del usuario "Carlos Santos"
    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE email = "karscx@gmail.com"'
    )
    const userId = users[0].id

    // Datos para los posts
    const posts = [
      {
        id: Sequelize.literal('UUID()'),
        title: 'First Post',
        content: 'This is the content of the first post',
        imageUrl: 'http://example.com/image1.jpg',
        categoryId: 1,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        title: 'Second Post',
        content: 'This is the content of the second post',
        imageUrl: 'http://example.com/image2.jpg',
        categoryId: 1,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: Sequelize.literal('UUID()'),
        title: 'Third Post',
        content: 'This is the content of the third post',
        imageUrl: 'http://example.com/image3.jpg',
        categoryId: 1,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await queryInterface.bulkInsert('Posts', posts, {})
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar los posts creados
    await queryInterface.bulkDelete('Posts', null, {})
  },
}
