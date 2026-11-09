import { apiRequest } from './api'
import type { LoggedInUser } from '../types'

export const login = (username: string, password: string) =>
  apiRequest<LoggedInUser>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
