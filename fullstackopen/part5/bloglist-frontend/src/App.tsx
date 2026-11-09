import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import * as blogService from './services/blogs'
import * as loginService from './services/login'
import Blog from './components/Blog'
import BlogDetails from './components/BlogDetails'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { Button, Container, GlobalPage, Heading, Navigation, NavItem, Panel, RightContent } from './components/ui'
import type { Blog as BlogType, LoggedInUser, NewBlog, NotificationState } from './types'

const storageKey = 'loggedBlogappUser'

function getSavedUser(): LoggedInUser | null {
  try {
    const stored = window.localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) as LoggedInUser : null
  } catch {
    return null
  }
}

function BlogRoute({ blogs, user, onLike, onRemove }: {
  blogs: BlogType[]
  user: LoggedInUser | null
  onLike: (blog: BlogType) => Promise<void>
  onRemove: (blog: BlogType) => Promise<void>
}) {
  const { id } = useParams()
  const blog = blogs.find((item) => item.id === id)

  if (!blog) return <Panel>Blog not found.</Panel>
  return <BlogDetails blog={blog} user={user} onLike={onLike} onRemove={onRemove} />
}

function BlogApplication() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState<BlogType[]>([])
  const [user, setUser] = useState<LoggedInUser | null>(getSavedUser)
  const [notification, setNotification] = useState<NotificationState | null>(null)
  const [newBlogVisible, setNewBlogVisible] = useState(false)

  useEffect(() => {
    blogService.getAll()
      .then(setBlogs)
      .catch((error: Error) => setNotification({ message: error.message, error: true }))
  }, [])

  useEffect(() => {
    if (!notification) return
    const timeout = window.setTimeout(() => setNotification(null), 5000)
    return () => window.clearTimeout(timeout)
  }, [notification])

  async function handleLogin(username: string, password: string) {
    try {
      const loggedInUser = await loginService.login(username, password)
      window.localStorage.setItem(storageKey, JSON.stringify(loggedInUser))
      setUser(loggedInUser)
      setNotification({ message: `Welcome, ${loggedInUser.name || loggedInUser.username}!`, error: false })
      navigate('/')
    } catch (error) {
      setNotification({ message: (error as Error).message, error: true })
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(storageKey)
    setUser(null)
    setNewBlogVisible(false)
    navigate('/')
  }

  async function handleCreate(blog: NewBlog): Promise<boolean> {
    if (!user) return false
    try {
      const createdBlog = await blogService.create(blog, user.token)
      setBlogs((previous) => previous.concat(createdBlog))
      setNewBlogVisible(false)
      setNotification({ message: `A new blog ${createdBlog.title} by ${createdBlog.author} added`, error: false })
      navigate('/')
      return true
    } catch (error) {
      setNotification({ message: (error as Error).message, error: true })
      return false
    }
  }

  async function handleLike(blog: BlogType) {
    if (!user) return
    try {
      const updatedBlog = await blogService.addLike(blog)
      setBlogs((previous) => previous.map((item) => item.id === updatedBlog.id ? updatedBlog : item))
    } catch (error) {
      setNotification({ message: (error as Error).message, error: true })
    }
  }

  async function handleRemove(blog: BlogType) {
    if (!user || blog.user?.username !== user.username) return
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return
    try {
      await blogService.remove(blog.id, user.token)
      setBlogs((previous) => previous.filter((item) => item.id !== blog.id))
      setNotification({ message: `Removed ${blog.title}`, error: false })
      navigate('/')
    } catch (error) {
      setNotification({ message: (error as Error).message, error: true })
    }
  }

  const sortedBlogs = [...blogs].sort((first, second) => second.likes - first.likes)

  return (
    <GlobalPage>
      <Container>
        <Navigation>
          <NavItem to="/">Blogs</NavItem>
          {user ? <NavItem to="/create">Create</NavItem> : <NavItem to="/login">Login</NavItem>}
          <RightContent>{user ? `${user.name || user.username} logged in` : 'Guest'}</RightContent>
          {user && <Button type="button" onClick={handleLogout}>logout</Button>}
        </Navigation>
        <Heading>Blog List</Heading>
        <Notification notification={notification} />
        <Routes>
          <Route path="/" element={
            <>
              {user && (
                <Togglable open={newBlogVisible} onToggle={() => setNewBlogVisible(!newBlogVisible)}>
                  <BlogForm onCreate={handleCreate} />
                </Togglable>
              )}
              <Panel>
                <h2>Blogs</h2>
                <div data-testid="blog-list">
                  {sortedBlogs.map((blog) => (
                    <Blog key={blog.id} blog={blog} user={user} onLike={handleLike} onRemove={handleRemove} />
                  ))}
                </div>
                {sortedBlogs.length === 0 && <p>No blogs yet.</p>}
              </Panel>
            </>
          } />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginForm onLogin={handleLogin} />} />
          <Route path="/create" element={user ? <BlogForm onCreate={handleCreate} /> : <Navigate to="/login" replace />} />
          <Route path="/blogs/:id" element={
            <BlogRoute blogs={blogs} user={user} onLike={handleLike} onRemove={handleRemove} />
          } />
          <Route path="*" element={<Panel>Page not found. <Link to="/">Go home</Link></Panel>} />
        </Routes>
      </Container>
    </GlobalPage>
  )
}

export default function App() {
  return <BrowserRouter><BlogApplication /></BrowserRouter>
}
