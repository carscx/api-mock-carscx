'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'Users'
    const columnName = 'refreshToken'
    const tableDesc = await queryInterface.describeTable(tableName)

    if (!tableDesc[columnName]) {
      await queryInterface.addColumn(tableName, columnName, {
        type: Sequelize.STRING,
        allowNull: true,
      })
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'refreshToken')
  },
}
