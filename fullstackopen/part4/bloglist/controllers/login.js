const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = typeof username === 'string' ? await User.findOne({ username }) : null
  const passwordCorrect = user && typeof password === 'string'
    ? await bcrypt.compare(password, user.passwordHash)
    : false

  if (!user || !passwordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const token = jwt.sign(
    { username: user.username, id: user.id },
    config.SECRET,
    { expiresIn: '1h' }
  )

  response.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
