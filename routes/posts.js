// routes/posts.js
const express = require('express')
const postsController = require('@controllers/posts.controller')
const { checkAuthAndRole } = require('@middlewares/check.auth')

const router = express.Router()

router.post('/', checkAuthAndRole(['admin', 'editor']), postsController.save)
router.get('/:id', postsController.show)
router.get('/', postsController.index)
router.put('/:id', checkAuthAndRole(['admin', 'editor']), postsController.update)
router.delete('/:id', checkAuthAndRole(['admin']), postsController.destroy)

module.exports = router
