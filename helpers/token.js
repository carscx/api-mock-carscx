const jwt = require('jsonwebtoken')

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { email: user.email, userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { email: user.email, userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret)
}

module.exports = { generateTokens, verifyToken }
