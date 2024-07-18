const Validator = require('fastest-validator')
const models = require('@models')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ResponseHandler = require('@utils/ResponseHandler')
const logger = require('@config/logger')

const v = new Validator()

const userSchema = {
  name: { type: 'string', optional: false, max: '100' },
  email: { type: 'string', optional: false, max: '500' },
  password: { type: 'string', optional: false },
}

const handleValidation = (user, res, req) => {
  const validationResponse = v.validate(user, userSchema)
  if (validationResponse !== true) {
    logger.error('Validation failed', { validationResponse })
    return ResponseHandler.validationError(res, req.t('validation_failed'), validationResponse)
  }
  return true
}

const createUser = (user, res, req) => {
  bcryptjs.genSalt(10, (err, salt) => {
    if (err) {
      logger.error('Error generating salt', err)
      return ResponseHandler.error(res, req.t('something_went_wrong'))
    }
    bcryptjs.hash(user.password, salt, (err, hash) => {
      if (err) {
        logger.error('Error hashing password', err)
        return ResponseHandler.error(res, req.t('something_went_wrong'))
      }
      models.User.create({ ...user, password: hash })
        .then(() => ResponseHandler.created(res, req.t('user_created_successfully')))
        .catch((error) => {
          logger.error('Error creating user', error)
          ResponseHandler.error(res, req.t('something_went_wrong'))
        })
    })
  })
}

const signUp = (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }
  if (!handleValidation(user, res, req)) return

  models.User.findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) {
        return ResponseHandler.error(res, req.t('email_already_exist'), {}, 409)
      }
      createUser(user, res, req)
    })
    .catch((error) => {
      logger.error('Error finding user', error)
      ResponseHandler.error(res, req.t('something_went_wrong'))
    })
}

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { email: user.email, userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m',
    }
  )
  const refreshToken = jwt.sign(
    { email: user.email, userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  )
  return { accessToken, refreshToken }
}

const login = (req, res) => {
  models.User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return ResponseHandler.error(res, req.t('invalid_credentials'), {}, 401)
      }
      bcryptjs.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          logger.error('Error comparing password', err)
          return ResponseHandler.error(res, req.t('something_went_wrong'))
        }
        if (!result) {
          return ResponseHandler.error(res, req.t('invalid_credentials'), {}, 401)
        }
        const { accessToken, refreshToken } = generateTokens(user)
        user
          .update({ refreshToken }) // Guarda el refresh token en la base de datos
          .then(() => {
            const userData = {
              id: user.id,
              email: user.email,
              fullName: user.name,
            }
            return ResponseHandler.loginSuccess(res, accessToken, refreshToken, userData)
          })
          .catch((error) => {
            logger.error('Error updating user with refresh token', error)
            ResponseHandler.error(res, req.t('something_went_wrong'))
          })
      })
    })
    .catch((error) => {
      logger.error('Error finding user for login', error)
      ResponseHandler.error(res, req.t('something_went_wrong'))
    })
}

const refreshToken = (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    logger.error('Missing refresh token')
    return ResponseHandler.error(res, req.t('missing_token'), {}, 400)
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      logger.error('Error verifying refresh token', err)
      return ResponseHandler.error(res, req.t('invalid_token'), {}, 403)
    }

    models.User.findOne({ where: { id: decoded.userId, refreshToken } })
      .then((user) => {
        if (!user) {
          return ResponseHandler.error(res, req.t('invalid_token'), {}, 403)
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user)
        user
          .update({ refreshToken: newRefreshToken }) // Actualiza el refresh token en la base de datos
          .then(() => {
            const userData = {
              id: user.id,
              email: user.email,
              fullName: user.name,
            }
            return ResponseHandler.loginSuccess(res, accessToken, newRefreshToken, userData)
          })
          .catch((error) => {
            logger.error('Error updating user with new refresh token', error)
            ResponseHandler.error(res, req.t('something_went_wrong'))
          })
      })
      .catch((error) => {
        logger.error('Error finding user for refresh token', error)
        ResponseHandler.error(res, req.t('something_went_wrong'))
      })
  })
}

const logout = (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    logger.error('Missing refresh token')
    return ResponseHandler.error(res, req.t('missing_token'), {}, 400)
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      logger.error('Error verifying refresh token', err)
      return ResponseHandler.error(res, req.t('invalid_token'), {}, 403)
    }

    models.User.findOne({ where: { id: decoded.userId, refreshToken } })
      .then((user) => {
        if (!user) {
          return ResponseHandler.error(res, req.t('invalid_token'), {}, 403)
        }

        user
          .update({ refreshToken: null }) // Invalida el refresh token
          .then(() => {
            return ResponseHandler.success(res, req.t('logout_successful'))
          })
          .catch((error) => {
            logger.error('Error updating user for logout', error)
            ResponseHandler.error(res, req.t('something_went_wrong'))
          })
      })
      .catch((error) => {
        logger.error('Error finding user for logout', error)
        ResponseHandler.error(res, req.t('something_went_wrong'))
      })
  })
}

module.exports = {
  signUp,
  login,
  refreshToken,
  logout,
}
