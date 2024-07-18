// routes/index.js
const express = require('express')
const postsRoute = require('@routes/posts')
const authRoute = require('@routes/auth')
const rolesRoute = require('@routes/roles')
const permissionsRoute = require('@routes/permissions') // Nueva ruta de permisos
const { checkAuthAndRole } = require('@middlewares/check.auth') // Importa checkAuthAndRole

const router = express.Router()

// Rutas públicas
router.use('/:lang/posts', postsRoute)
router.use('/:lang/auth', authRoute)

// Rutas protegidas
router.use('/:lang/roles', checkAuthAndRole(['admin']), rolesRoute)
router.use('/:lang/permissions', checkAuthAndRole(['admin', 'editor']), permissionsRoute)

// Middleware para manejar rutas no configuradas y devolver un error 404
router.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  })
})

module.exports = router
