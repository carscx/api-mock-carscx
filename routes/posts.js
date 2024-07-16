const express = require('express')
const postsController = require('@controllers/posts.controller')
const { verifyToken, checkRole } = require('@middlewares/auth')

const router = express.Router()

router.post('/', verifyToken, checkRole(['admin', 'editor']), postsController.save)
router.get('/:id', postsController.show)
router.get('/', postsController.index)
router.put('/:id', verifyToken, checkRole(['admin', 'editor']), postsController.update)
router.delete('/:id', verifyToken, checkRole(['admin']), postsController.destroy)

module.exports = router
