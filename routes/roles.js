const express = require('express')
const rolesController = require('@controllers/roles.controller')
const { verifyToken, checkRole } = require('@middlewares/auth')

const router = express.Router()

router.post('/create-role', verifyToken, checkRole(['admin']), rolesController.createRole)
router.post('/assign-role', verifyToken, checkRole(['admin']), rolesController.assignRoleToUser)
router.post(
  '/assign-permission',
  verifyToken,
  checkRole(['admin']),
  rolesController.assignPermissionToRole
)

module.exports = router
