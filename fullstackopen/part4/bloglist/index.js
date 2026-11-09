const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

if (!config.MONGODB_URI || !config.SECRET) {
  logger.error('Missing MONGODB_URI or SECRET in .env')
  process.exit(1)
}

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`)
    })
  })
  .catch((error) => {
    logger.error('MongoDB connection failed:', error.message)
    process.exit(1)
  })
