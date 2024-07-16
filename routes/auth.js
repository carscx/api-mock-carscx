// routes/auth.js
const express = require('express')
const authController = require('@controllers/auth.controller')

const router = express.Router()

router.post('/sign-up', authController.signUp)
router.post('/login', authController.login)
router.post('/refresh-token', authController.refreshToken)
router.post('/logout', authController.logout);

module.exports = router
