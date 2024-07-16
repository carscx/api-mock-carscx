const jwt = require('jsonwebtoken')
const models = require('@models')

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(403).json({ message: 'Token is missing' })
  }

  jwt.verify(token, 'accessSecret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is invalid' })
    }

    req.user = user
    next()
  })
}

const checkRole = (roles) => {
  return async (req, res, next) => {
    const user = await models.User.findByPk(req.user.userId, {
      include: {
        model: models.Role,
        through: {
          attributes: [],
        },
      },
    })

    if (!user) {
      return res.status(403).json({ message: 'User not found' })
    }

    const userRoles = user.Roles.map((role) => role.name)

    const hasRole = roles.some((role) => userRoles.includes(role))

    if (!hasRole) {
      return res.status(403).json({ message: 'You do not have the required permissions' })
    }

    next()
  }
}

module.exports = {
  verifyToken,
  checkRole,
}
