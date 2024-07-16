const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors') // Importa el paquete cors
const i18nextMiddleware = require('i18next-http-middleware')
const i18next = require('@config/i18nextConfig')

const setupMiddlewares = (app) => {
  app.use(cors())
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(i18nextMiddleware.handle(i18next))
}

module.exports = setupMiddlewares
