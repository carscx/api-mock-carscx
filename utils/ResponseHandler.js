const validationError = (res, message, details) => {
  return res.status(400).json({
    status: 'error',
    message,
    details,
  })
}

const error = (res, message, status = 500) => {
  return res.status(status).json({
    status: 'error',
    message,
  })
}

const created = (res, message) => {
  return res.status(201).json({
    status: 'success',
    message,
  })
}

const loginSuccess = (res, accessToken, refreshToken, user) => {
  return res.status(200).json({
    status: 'success',
    message: 'Login successful',
    accessToken,
    refreshToken,
    user,
  })
}

const success = (res, message) => {
  return res.status(200).json({
    status: 'success',
    message,
  })
}

module.exports = {
  validationError,
  error,
  created,
  loginSuccess,
  success,
}
