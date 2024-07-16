class ResponseHandler {
  static success(res, message, data = {}) {
    return res.status(200).json({
      status: 'success',
      message,
      data,
    })
  }

  static created(res, message, data = {}) {
    return res.status(201).json({
      status: 'success',
      message,
      data,
    })
  }

  static error(res, message, errors = {}, statusCode = 500) {
    return res.status(statusCode).json({
      status: 'error',
      message,
      errors,
    })
  }

  static validationError(res, message, errors) {
    return res.status(400).json({
      status: 'fail',
      message,
      errors,
    })
  }

  static loginSuccess(res, accessToken, refreshToken, userData) {
    return res.status(200).json({
      accessToken,
      refreshToken,
      data: userData,
    })
  }
}

module.exports = ResponseHandler
