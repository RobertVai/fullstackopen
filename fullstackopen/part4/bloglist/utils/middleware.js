const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')
const logger = require('./logger')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  request.token = authorization && authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : null
  next()
}

const userExtractor = async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(request.token, config.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'user not found' })
    }

    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }
  if (error.code === 11000) {
    return response.status(400).json({ error: 'username must be unique' })
  }

  response.status(500).json({ error: 'internal server error' })
}

module.exports = { tokenExtractor, userExtractor, unknownEndpoint, errorHandler }
