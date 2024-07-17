'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Deshabilitar las restricciones de clave foránea
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')

    // Eliminar todas las tablas
    await queryInterface.dropAllTables()

    // Volver a habilitar las restricciones de clave foránea
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
  },
  down: async (queryInterface, Sequelize) => {
    // No se necesita revertir esta migración
  },
}
