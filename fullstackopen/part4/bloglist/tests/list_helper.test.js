const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const listHelper = require('../utils/list_helper')

const blogs = [
  { title: 'Clean Code', author: 'Robert C. Martin', likes: 3 },
  { title: 'TDD', author: 'Robert C. Martin', likes: 5 },
  { title: 'Refactoring', author: 'Martin Fowler', likes: 10 },
  { title: 'Patterns', author: 'Robert C. Martin', likes: 8 },
  { title: 'Algorithms', author: 'Edsger W. Dijkstra', likes: 17 }
]

test('dummy returns one', () => {
  assert.equal(listHelper.dummy([]), 1)
})

describe('totalLikes', () => {
  test('empty array returns 0', () => assert.equal(listHelper.totalLikes([]), 0))
  test('single blog returns its likes', () => assert.equal(listHelper.totalLikes([blogs[0]]), 3))
  test('multiple blogs returns sum', () => assert.equal(listHelper.totalLikes(blogs), 43))
})

describe('favoriteBlog', () => {
  test('empty array returns null', () => assert.equal(listHelper.favoriteBlog([]), null))
  test('single blog is favorite', () => assert.deepEqual(listHelper.favoriteBlog([blogs[0]]), blogs[0]))
  test('finds blog with most likes', () => assert.deepEqual(listHelper.favoriteBlog(blogs), blogs[4]))
})

describe('mostBlogs', () => {
  test('empty array returns null', () => assert.equal(listHelper.mostBlogs([]), null))
  test('finds author with most blogs', () => assert.deepEqual(listHelper.mostBlogs(blogs), { author: 'Robert C. Martin', blogs: 3 }))
})

describe('mostLikes', () => {
  test('empty array returns null', () => assert.equal(listHelper.mostLikes([]), null))
  test('finds author with most total likes', () => assert.deepEqual(listHelper.mostLikes(blogs), { author: 'Edsger W. Dijkstra', likes: 17 }))
})
