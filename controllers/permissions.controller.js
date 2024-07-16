const models = require('@models')

const createPermission = async (req, res) => {
  const { name } = req.body

  try {
    const permission = await models.Permission.create({ name })
    res.status(201).json({ message: 'Permission created successfully', permission })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err })
  }
}

module.exports = {
  createPermission,
}
