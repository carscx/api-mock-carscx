const Validator = require('fastest-validator')
const logger = require('@config/logger')
const ResponseHandler = require('@utils/responseHandler')

const v = new Validator()

const userSchema = {
  name: { type: 'string', optional: false, max: '100' },
  email: { type: 'string', optional: false, max: '500' },
  password: { type: 'string', optional: false },
}

const validateUser = (user, res, req) => {
  const validationResponse = v.validate(user, userSchema)
  if (validationResponse !== true) {
    logger.error('Validation failed', { validationResponse })
    return ResponseHandler.validationError(res, req.t('validation_failed'), validationResponse)
  }
  return true
}

module.exports = { validateUser }
