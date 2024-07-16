const Validator = require('fastest-validator')
const models = require('@models')

const v = new Validator()

const schema = {
  title: {
    type: 'string',
    optional: false,
    max: '100',
  },
  content: {
    type: 'string',
    optional: false,
    max: '500',
  },
  categoryId: {
    type: 'number',
    optional: false,
  },
}

const save = (req, res) => {
  const post = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
    categoryId: req.body.categoryId,
    userId: req.user.userId, // Usa el ID del usuario autenticado
  }

  const validationResponse = v.validate(post, schema)

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    })
  }

  models.Post.create(post)
    .then((result) => {
      res.status(201).json({
        message: 'Post created successfully',
        post: result,
      })
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err,
      })
    })
}

const show = (req, res) => {
  const id = req.params.id

  models.Post.findByPk(id)
    .then((result) => {
      if (result) {
        res.status(200).json(result)
      } else {
        res.status(404).json({
          message: 'Post not found',
        })
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err,
      })
    })
}

const index = (req, res) => {
  models.Post.findAll()
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err,
      })
    })
}

const update = (req, res) => {
  const id = req.params.id
  const updatedPost = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
    categoryId: req.body.categoryId,
  }
  const userId = req.user.userId

  const validationResponse = v.validate(updatedPost, schema)

  if (validationResponse !== true) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: validationResponse,
    })
  }

  models.Post.update(updatedPost, { where: { id: id, userId: userId } })
    .then((result) => {
      if (result[0] === 0) {
        return res.status(404).json({
          message: 'Post not found or you do not have permission to update this post',
        })
      }
      res.status(200).json({
        message: 'Post updated successfully',
        post: updatedPost,
      })
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err,
      })
    })
}

const destroy = (req, res) => {
  const id = req.params.id
  const userId = req.user.userId

  models.Post.destroy({ where: { id: id, userId: userId } })
    .then((result) => {
      if (result === 0) {
        return res.status(404).json({
          message: 'Post not found or you do not have permission to delete this post',
        })
      }
      res.status(200).json({
        message: 'Post deleted successfully',
      })
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Something went wrong',
        error: err,
      })
    })
}

module.exports = {
  save,
  show,
  index,
  update,
  destroy,
}
