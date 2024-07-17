'use strict'

const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Buscar si el usuario ya existe
    const [users] = await queryInterface.sequelize.query(
      `SELECT * FROM Users WHERE email = 'karscx@gmail.com';`
    )

    // Si el usuario no existe, lo creamos
    if (users.length === 0) {
      // Generar el hash de la contraseña
      const hashedPassword = await bcrypt.hash('123456', 10)

      // Definir los datos de los usuarios
      const newUser = {
        id: Sequelize.literal('UUID()'),
        name: 'Carlos Santos',
        email: 'karscx@gmail.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Insertar los datos en la tabla Users
      try {
        await queryInterface.bulkInsert('Users', [newUser], {})
        console.log('Usuario creado exitosamente')
      } catch (error) {
        console.error('Error al insertar usuarios:', error)
        throw error
      }
    } else {
      console.log('El usuario ya existe, no se creó de nuevo')
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar los datos de la tabla Users
    await queryInterface.bulkDelete(
      'Users',
      {
        email: 'karscx@gmail.com',
      },
      {}
    )
  },
}
