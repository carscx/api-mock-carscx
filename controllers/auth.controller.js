const Validator = require('fastest-validator')
const models = require('@models')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ResponseHandler = require('@utils/ResponseHandler') // Asegúrate de ajustar la ruta según tu estructura de proyecto

const v = new Validator()

const userSchema = {
  name: { type: 'string', optional: false, max: '100' },
  email: { type: 'string', optional: false, max: '500' },
  password: { type: 'string', optional: false },
}

const handleValidation = (user, res, req) => {
  const validationResponse = v.validate(user, userSchema)
  if (validationResponse !== true) {
    return ResponseHandler.validationError(res, req.t('validation_failed'), validationResponse)
  }
  return true
}

const createUser = (user, res, req) => {
  bcryptjs.genSalt(10, (err, salt) => {
    if (err) return ResponseHandler.error(res, req.t('something_went_wrong'))
    bcryptjs.hash(user.password, salt, (err, hash) => {
      if (err) return ResponseHandler.error(res, req.t('something_went_wrong'))
      models.User.create({ ...user, password: hash })
        .then(() => ResponseHandler.created(res, req.t('user_created_successfully')))
        .catch(() => ResponseHandler.error(res, req.t('something_went_wrong')))
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
    .catch(() => ResponseHandler.error(res, req.t('something_went_wrong')))
}

const generateTokens = (user) => {
  const accessToken = jwt.sign({ email: user.email, userId: user.id }, 'accessSecret', {
    expiresIn: '15m',
  })
  const refreshToken = jwt.sign({ email: user.email, userId: user.id }, 'refreshSecret', {
    expiresIn: '7d',
  })
  return { accessToken, refreshToken }
}

const login = (req, res) => {
  models.User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return ResponseHandler.error(res, req.t('invalid_credentials'), {}, 401)
      }
      bcryptjs.compare(req.body.password, user.password, (err, result) => {
        if (err) return ResponseHandler.error(res, req.t('something_went_wrong'))
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
          .catch(() => ResponseHandler.error(res, req.t('something_went_wrong')))
      })
    })
    .catch(() => ResponseHandler.error(res, req.t('something_went_wrong')))
}

const refreshToken = (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return ResponseHandler.error(res, req.t('missing_token'), {}, 400)
  }

  jwt.verify(refreshToken, 'refreshSecret', (err, decoded) => {
    if (err) {
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
          .catch(() => ResponseHandler.error(res, req.t('something_went_wrong')))
      })
      .catch(() => ResponseHandler.error(res, req.t('something_went_wrong')))
  })
}

module.exports = {
  signUp,
  login,
  refreshToken,
}
