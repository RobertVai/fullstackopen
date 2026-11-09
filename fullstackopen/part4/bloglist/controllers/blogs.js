const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (!blog) return response.status(404).end()
  response.json(blog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  if (typeof title !== 'string' || !title.trim() || typeof url !== 'string' || !url.trim()) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({ title: title.trim(), author, url: url.trim(), likes: likes ?? 0, user: request.user.id })
  const savedBlog = await blog.save()
  await User.findByIdAndUpdate(request.user.id, { $push: { blogs: savedBlog.id } })
  await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  if (typeof likes !== 'number' || !Number.isFinite(likes) || likes < 0) {
    return response.status(400).json({ error: 'valid likes required' })
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true }
  ).populate('user', { username: 1, name: 1 })

  if (!updatedBlog) return response.status(404).end()
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()

  if (!blog.user || blog.user.toString() !== request.user.id.toString()) {
    return response.status(403).json({ error: 'only the owner can delete this blog' })
  }

  await Blog.findByIdAndDelete(blog.id)
  await User.findByIdAndUpdate(request.user.id, { $pull: { blogs: blog._id } })
  response.status(204).end()
})

module.exports = blogsRouter
