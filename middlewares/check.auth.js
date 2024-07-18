// middlewares/check.auth.js
const jwt = require('jsonwebtoken')
const models = require('@models')

const checkAuthAndRole = (roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1] // Bearer @#3#3####
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      req.userData = decodedToken

      const user = await models.User.findByPk(req.userData.userId, {
        include: [
          {
            model: models.Role,
            through: 'UserRole',
          },
        ],
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
    } catch (err) {
      return res.status(401).json({
        message: 'Invalid or expired token provided',
        error: err,
      })
    }
  }
}

module.exports = {
  checkAuthAndRole,
}
