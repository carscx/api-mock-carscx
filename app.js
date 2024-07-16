require('dotenv').config() // Cargar variables de entorno al inicio de la aplicación
const express = require('express')
const setupMiddlewares = require('./middlewares/setupMiddlewares')
const routes = require('./routes')

const app = express()

// Configuración de middlewares
setupMiddlewares(app)

// Configuración de rutas
app.use('/', routes)

module.exports = app
