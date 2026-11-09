const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((favorite, blog) => blog.likes > favorite.likes ? blog : favorite)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const counts = new Map()
  for (const blog of blogs) {
    counts.set(blog.author, (counts.get(blog.author) || 0) + 1)
  }
  const [author, count] = [...counts].reduce((winner, current) => current[1] > winner[1] ? current : winner)
  return { author, blogs: count }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const counts = new Map()
  for (const blog of blogs) {
    counts.set(blog.author, (counts.get(blog.author) || 0) + (blog.likes || 0))
  }
  const [author, likes] = [...counts].reduce((winner, current) => current[1] > winner[1] ? current : winner)
  return { author, likes }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
