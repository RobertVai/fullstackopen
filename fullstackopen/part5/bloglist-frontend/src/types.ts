export interface BlogUser {
  id: string
  username: string
  name?: string
}

export interface Blog {
  id: string
  title: string
  author: string
  url: string
  likes: number
  user?: BlogUser | null
}

export interface NewBlog {
  title: string
  author: string
  url: string
}

export interface LoggedInUser {
  token: string
  username: string
  name?: string
}

export interface NotificationState {
  message: string
  error: boolean
}
