const express = require('express')
const permissionsController = require('@controllers/permissions.controller')
const { verifyToken, checkRole } = require('@middlewares/auth')

const router = express.Router()

router.post(
  '/create-permission',
  verifyToken,
  checkRole(['admin']),
  permissionsController.createPermission
)

module.exports = router
