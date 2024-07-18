// routes/roles.js
const express = require('express')
const rolesController = require('@controllers/roles.controller')
const { checkAuthAndRole } = require('@middlewares/check.auth')

const router = express.Router()

router.post('/create-role', checkAuthAndRole(['admin', 'editor']), rolesController.createRole)
router.post('/assign-role', checkAuthAndRole(['admin', 'editor']), rolesController.assignRoleToUser)
router.post(
  '/assign-permission',
  checkAuthAndRole(['admin', 'editor']),
  rolesController.assignPermissionToRole
)

router.get('/list', checkAuthAndRole(['admin', 'editor']), rolesController.listRoles)

module.exports = router
