const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (typeof username !== 'string' || username.trim().length < 3 ||
      typeof password !== 'string' || password.length < 3) {
    return response.status(400).json({ error: 'username and password must have at least 3 characters' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username: username.trim(), name, passwordHash, blogs: [] })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter
