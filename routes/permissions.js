const express = require('express')
const permissionsController = require('@controllers/permissions.controller')
const { checkAuthAndRole } = require('@middlewares/check.auth')

const router = express.Router()

router.post(
  '/create-permission',
  checkAuthAndRole(['admin', 'editor']),
  permissionsController.createPermission
)

module.exports = router
