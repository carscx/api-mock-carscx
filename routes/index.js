const express = require('express')
const postsRoute = require('./posts')
const authRoute = require('./auth')

const router = express.Router()

router.use('/:lang/posts', postsRoute)
router.use('/:lang/auth', authRoute)

// Middleware para manejar rutas no configuradas y devolver un error 404
router.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  })
})

module.exports = router
