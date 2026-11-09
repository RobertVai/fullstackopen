import type { Blog, LoggedInUser } from '../types'
import { Actions, Button, DangerButton, DetailText, Panel } from './ui'

interface Props {
  blog: Blog
  user: LoggedInUser | null
  onLike: (blog: Blog) => void | Promise<void>
  onRemove: (blog: Blog) => void | Promise<void>
}

export default function BlogDetails({ blog, user, onLike, onRemove }: Props) {
  const isOwner = Boolean(user && blog.user?.username === user.username)

  return (
    <Panel data-testid="blog-detail-page">
      <h2>{blog.title}</h2>
      <DetailText>Author: {blog.author}</DetailText>
      <DetailText>
        URL: <a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a>
      </DetailText>
      <DetailText>Likes: {blog.likes}</DetailText>
      <DetailText>Added by {blog.user?.name || blog.user?.username || 'Unknown user'}</DetailText>
      <Actions>
        {user && <Button type="button" onClick={() => void onLike(blog)}>like</Button>}
        {isOwner && <DangerButton type="button" onClick={() => void onRemove(blog)}>remove</DangerButton>}
      </Actions>
    </Panel>
  )
}
