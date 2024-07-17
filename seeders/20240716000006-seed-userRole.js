'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE email = "karscx@gmail.com"'
    )
    const userId = users[0].id

    const [roles] = await queryInterface.sequelize.query(
      'SELECT id FROM Roles WHERE name = "admin"'
    )
    const adminRoleId = roles[0].id

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
  },

  down: async (queryInterface, Sequelize) => {
    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE email = "karscx@gmail.com"'
    )
    const userId = users[0].id

    const [roles] = await queryInterface.sequelize.query(
      'SELECT id FROM Roles WHERE name = "admin"'
    )
    const adminRoleId = roles[0].id

    await queryInterface.bulkDelete(
      'UserRoles',
      {
        userId: userId,
        roleId: adminRoleId,
      },
      {}
    )
  },
}
