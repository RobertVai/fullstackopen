import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { test, expect, vi } from 'vitest'
import Blog from './Blog'
import type { Blog as BlogType, LoggedInUser } from '../types'

const blog: BlogType = {
  id: 'blog-1',
  title: 'Test-driven React',
  author: 'Ada',
  url: 'https://example.com/react',
  likes: 7,
  user: { id: 'user-1', username: 'ada', name: 'Ada' },
}

const loggedUser: LoggedInUser = { token: 'test-token', username: 'ada', name: 'Ada' }

function showBlog(onLike = vi.fn()) {
  render(
    <MemoryRouter>
      <Blog blog={blog} user={loggedUser} onLike={onLike} onRemove={vi.fn()} />
    </MemoryRouter>,
  )
}

test('renders title and author but hides URL and likes initially', () => {
  showBlog()
  expect(screen.getByText(/Test-driven React/)).toBeInTheDocument()
  expect(screen.getByText(/by Ada/)).toBeInTheDocument()
  expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
  expect(screen.queryByText('Likes: 7')).not.toBeInTheDocument()
})

test('view button reveals URL and likes', async () => {
  const user = userEvent.setup()
  showBlog()
  await user.click(screen.getByRole('button', { name: 'view' }))
  expect(screen.getByText(blog.url)).toBeInTheDocument()
  expect(screen.getByText('Likes: 7')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'hide' }))
  expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
})

test('like twice calls handler twice', async () => {
  const user = userEvent.setup()
  const onLike = vi.fn()
  showBlog(onLike)
  await user.click(screen.getByRole('button', { name: 'view' }))
  await user.click(screen.getByRole('button', { name: 'like' }))
  await user.click(screen.getByRole('button', { name: 'like' }))
  expect(onLike).toHaveBeenCalledTimes(2)
})
