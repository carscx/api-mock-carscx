const models = require('@models')

const createRole = async (req, res) => {
  const { name } = req.body

  try {
    const role = await models.Role.create({ name })
    res.status(201).json({ message: 'Role created successfully', role })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err })
  }
}

const assignRoleToUser = async (req, res) => {
  const { userId, roleId } = req.body

  try {
    const user = await models.User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const role = await models.Role.findByPk(roleId)
    if (!role) {
      return res.status(404).json({ message: 'Role not found' })
    }

    await user.addRole(role)

    res.status(200).json({ message: 'Role assigned to user successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err })
  }
}

const assignPermissionToRole = async (req, res) => {
  const { roleId, permissionId } = req.body

  try {
    const role = await models.Role.findByPk(roleId)
    if (!role) {
      return res.status(404).json({ message: 'Role not found' })
    }

    const permission = await models.Permission.findByPk(permissionId)
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' })
    }

    await role.addPermission(permission)

    res.status(200).json({ message: 'Permission assigned to role successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err })
  }
}

module.exports = {
  createRole,
  assignRoleToUser,
  assignPermissionToRole,
}
