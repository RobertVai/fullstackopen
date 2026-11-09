import { render, screen } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import BlogDetails from './BlogDetails'
import type { Blog, LoggedInUser } from '../types'

const blog: Blog = {
  id: 'blog-2', title: 'Router Testing', author: 'Ada', url: 'https://example.com', likes: 4,
  user: { id: 'user-1', username: 'ada', name: 'Ada' },
}

function renderDetails(user: LoggedInUser | null) {
  render(<BlogDetails blog={blog} user={user} onLike={vi.fn()} onRemove={vi.fn()} />)
}

test('guest sees blog data but no action buttons', () => {
  renderDetails(null)
  expect(screen.getByRole('heading', { name: 'Router Testing' })).toBeInTheDocument()
  expect(screen.getByText('Likes: 4')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})

test('other authenticated user sees only the like button', () => {
  renderDetails({ username: 'bob', token: 'token' })
  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})

test('blog creator sees like and remove buttons', () => {
  renderDetails({ username: 'ada', token: 'token' })
  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
})
