const bcryptjs = require('bcryptjs')
const logger = require('@config/logger')

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcryptjs.genSalt(10, (err, salt) => {
      if (err) {
        logger.error('Error generating salt', err)
        return reject(err)
      }
      bcryptjs.hash(password, salt, (err, hash) => {
        if (err) {
          logger.error('Error hashing password', err)
          return reject(err)
        }
        resolve(hash)
      })
    })
  })
}

const comparePassword = (password, hash) => {
  return bcryptjs.compare(password, hash)
}

module.exports = { hashPassword, comparePassword }
