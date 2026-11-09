process.env.NODE_ENV = 'test'

const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const config = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

before(async () => {
  if (!config.MONGODB_URI || !config.SECRET) throw new Error('Configure TEST_MONGODB_URI and SECRET in .env before API tests')
  if (process.env.MONGODB_URI && config.MONGODB_URI === process.env.MONGODB_URI) {
    throw new Error('Test database must differ from MONGODB_URI')
  }
  await mongoose.connect(config.MONGODB_URI)
  await User.init()
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await api.post('/api/users').send({ username: 'existing', name: 'Existing User', password: 'secret123' }).expect(201)
})

after(async () => {
  await mongoose.disconnect()
})

describe('POST /api/users', () => {
  test('creates user without exposing password hash', async () => {
    const response = await api.post('/api/users')
      .send({ username: 'newuser', name: 'New User', password: 'password123' }).expect(201)
    assert.equal(response.body.username, 'newuser')
    assert.equal(response.body.passwordHash, undefined)
    assert.equal(await User.countDocuments({}), 2)
  })

  test('rejects duplicate username', async () => {
    await api.post('/api/users').send({ username: 'existing', password: 'different' }).expect(400)
    assert.equal(await User.countDocuments({}), 1)
  })

  test('rejects short username', async () => {
    await api.post('/api/users').send({ username: 'ab', password: 'validpass' }).expect(400)
  })

  test('rejects short password', async () => {
    await api.post('/api/users').send({ username: 'validuser', password: 'ab' }).expect(400)
  })

  test('rejects missing fields', async () => {
    await api.post('/api/users').send({ username: 'validuser' }).expect(400)
    await api.post('/api/users').send({ password: 'validpass' }).expect(400)
  })
})

describe('GET /api/users', () => {
  test('returns users without password hashes', async () => {
    const response = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)
    assert.equal(response.body.length, 1)
    assert.equal(response.body[0].passwordHash, undefined)
    assert.ok(Array.isArray(response.body[0].blogs))
  })
})

describe('POST /api/login', () => {
  test('valid credentials return token', async () => {
    const response = await api.post('/api/login').send({ username: 'existing', password: 'secret123' }).expect(200)
    assert.ok(response.body.token)
  })

  test('bad password returns 401', async () => {
    await api.post('/api/login').send({ username: 'existing', password: 'wrong' }).expect(401)
  })
})
