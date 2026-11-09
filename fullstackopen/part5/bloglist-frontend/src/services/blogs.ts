import { apiRequest } from './api'
import type { Blog, NewBlog } from '../types'

const baseUrl = '/api/blogs'

export const getAll = () => apiRequest<Blog[]>(baseUrl)

export const create = (blog: NewBlog, token: string) =>
  apiRequest<Blog>(baseUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(blog),
  })

export const addLike = (blog: Blog) =>
  apiRequest<Blog>(`${baseUrl}/${blog.id}`, {
    method: 'PUT',
    body: JSON.stringify({ likes: blog.likes + 1 }),
  })

export const remove = (blogId: string, token: string) =>
  apiRequest<void>(`${baseUrl}/${blogId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
