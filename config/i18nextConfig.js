const i18next = require('i18next')
const i18nextFsBackend = require('i18next-fs-backend')
const i18nextMiddleware = require('i18next-http-middleware')

i18next
  .use(i18nextFsBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'es'],
    backend: {
      loadPath: __dirname + '/../locales/{{lng}}.json',
    },
    detection: {
      order: ['path', 'cookie', 'header'],
      caches: ['cookie'],
    },
  })

module.exports = i18next
