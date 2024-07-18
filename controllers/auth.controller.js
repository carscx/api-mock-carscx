const models = require('@models')
const logger = require('@config/logger')
const ResponseHandler = require('@utils/responseHandler')
const { validateUser } = require('@helpers/validation')
const { generateTokens, verifyToken } = require('@helpers/token')
const { hashPassword, comparePassword } = require('@helpers/hash')

const createUser = async (user, res, req) => {
  try {
    const hashedPassword = await hashPassword(user.password)
    await models.User.create({ ...user, password: hashedPassword })
    return ResponseHandler.created(res, req.t('user_created_successfully'))
  } catch (error) {
    logger.error('Error creating user', error)
    return ResponseHandler.error(res, req.t('something_went_wrong'))
  }
}

const signUp = async (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }

  if (!validateUser(user, res, req)) return

  try {
    const existingUser = await models.User.findOne({ where: { email: req.body.email } })
    if (existingUser) {
      return ResponseHandler.error(res, req.t('email_already_exist'), {}, 409)
    }
    await createUser(user, res, req)
  } catch (error) {
    logger.error('Error finding user', error)
    return ResponseHandler.error(res, req.t('something_went_wrong'))
  }
}

const login = async (req, res) => {
  try {
    const user = await models.User.findOne({ where: { email: req.body.email } })
    if (!user) {
      return ResponseHandler.error(res, req.t('invalid_credentials'), {}, 401)
    }

    const passwordMatch = await comparePassword(req.body.password, user.password)
    if (!passwordMatch) {
      return ResponseHandler.error(res, req.t('invalid_credentials'), {}, 401)
    }

    const { accessToken, refreshToken } = generateTokens(user)
    await user.update({ refreshToken })

    const userData = {
      id: user.id,
      email: user.email,
      fullName: user.name,
    }
    return ResponseHandler.loginSuccess(res, accessToken, refreshToken, userData)
  } catch (error) {
    logger.error('Error during login', error)
    return ResponseHandler.error(res, req.t('something_went_wrong'))
  }
}

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    logger.error('Missing refresh token')
    return ResponseHandler.error(res, req.t('missing_token'), {}, 400)
  }

  try {
    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await models.User.findOne({ where: { id: decoded.userId, refreshToken } })
    if (!user) {
      return ResponseHandler.error(res, req.t('invalid_token'), {}, 403)
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user)
    await user.update({ refreshToken: newRefreshToken })

    const userData = {
      id: user.id,
      email: user.email,
      fullName: user.name,
    }
    return ResponseHandler.loginSuccess(res, accessToken, newRefreshToken, userData)
  } catch (error) {
    logger.error('Error verifying refresh token', error)
    return ResponseHandler.error(res, req.t('invalid_token'), {}, 403)
  }
}

const logout = async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    logger.error('Missing refresh token')
    return ResponseHandler.error(res, req.t('missing_token'), {}, 400)
  }

  try {
    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await models.User.findOne({ where: { id: decoded.userId, refreshToken } })
    if (!user) {
      return ResponseHandler.error(res, req.t('invalid_token'), {}, 403)
    }

    await user.update({ refreshToken: null })
    return ResponseHandler.success(res, req.t('logout_successful'))
  } catch (error) {
    logger.error('Error verifying refresh token', error)
    return ResponseHandler.error(res, req.t('something_went_wrong'))
  }
}

module.exports = {
  signUp,
  login,
  refreshToken,
  logout,
}
