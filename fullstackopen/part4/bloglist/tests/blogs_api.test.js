process.env.NODE_ENV = 'test'

const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const config = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let token
let otherToken
let owner

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
  const passwordHash = await bcrypt.hash('secret123', 4)
  owner = await new User({ username: 'blog_owner', name: 'Owner', passwordHash, blogs: [] }).save()
  await new User({ username: 'other_user', name: 'Other', passwordHash, blogs: [] }).save()

  const response = await api.post('/api/login').send({ username: 'blog_owner', password: 'secret123' }).expect(200)
  const otherResponse = await api.post('/api/login').send({ username: 'other_user', password: 'secret123' }).expect(200)
  token = response.body.token
  otherToken = otherResponse.body.token
  await Blog.insertMany([
    { title: 'First', author: 'Alice', url: 'https://example.com/first', likes: 3, user: owner.id },
    { title: 'Second', author: 'Bob', url: 'https://example.com/second', likes: 5, user: owner.id }
  ])
})

after(async () => {
  await mongoose.disconnect()
})

describe('GET /api/blogs', () => {
  test('returns correct amount of JSON blogs', async () => {
    const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
    assert.equal(response.body.length, 2)
  })

  test('blogs use id instead of _id', async () => {
    const response = await api.get('/api/blogs').expect(200)
    assert.ok(response.body[0].id)
    assert.equal(response.body[0]._id, undefined)
  })

  test('blogs contain populated user', async () => {
    const response = await api.get('/api/blogs').expect(200)
    assert.equal(response.body[0].user.username, 'blog_owner')
    assert.equal(response.body[0].user.passwordHash, undefined)
  })
})

describe('POST /api/blogs', () => {
  const newBlog = { title: 'Third', author: 'Carol', url: 'https://example.com/third', likes: 7 }

  test('authorized user creates blog', async () => {
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201)
    assert.equal(response.body.title, 'Third')
    assert.equal(response.body.user.username, 'blog_owner')
    assert.equal(await Blog.countDocuments({}), 3)
    const user = await User.findById(owner.id)
    assert.equal(user.blogs.length, 1)
  })

  test('likes defaults to zero', async () => {
    const response = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
      .send({ title: 'No likes', url: 'https://example.com/zero' }).expect(201)
    assert.equal(response.body.likes, 0)
  })

  test('missing title rejects with 400', async () => {
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
      .send({ url: 'https://example.com/missing' }).expect(400)
    assert.equal(await Blog.countDocuments({}), 2)
  })

  test('missing url rejects with 400', async () => {
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`)
      .send({ title: 'Missing URL' }).expect(400)
    assert.equal(await Blog.countDocuments({}), 2)
  })

  test('missing token rejects with 401', async () => {
    await api.post('/api/blogs').send(newBlog).expect(401)
  })

  test('invalid token rejects with 401', async () => {
    await api.post('/api/blogs').set('Authorization', 'Bearer invalid').send(newBlog).expect(401)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('updates likes', async () => {
    const blog = await Blog.findOne({ title: 'First' })
    const response = await api.put(`/api/blogs/${blog.id}`).send({ likes: 12 }).expect(200)
    assert.equal(response.body.likes, 12)
  })

  test('missing blog returns 404', async () => {
    await api.put(`/api/blogs/${new mongoose.Types.ObjectId()}`).send({ likes: 12 }).expect(404)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('owner can delete own blog', async () => {
    const blog = await Blog.findOne({ title: 'First' })
    await api.delete(`/api/blogs/${blog.id}`).set('Authorization', `Bearer ${token}`).expect(204)
    assert.equal(await Blog.countDocuments({}), 1)
  })

  test('missing token returns 401', async () => {
    const blog = await Blog.findOne({ title: 'First' })
    await api.delete(`/api/blogs/${blog.id}`).expect(401)
  })

  test('different user cannot delete blog', async () => {
    const blog = await Blog.findOne({ title: 'First' })
    await api.delete(`/api/blogs/${blog.id}`).set('Authorization', `Bearer ${otherToken}`).expect(403)
    assert.equal(await Blog.countDocuments({}), 2)
  })
})
