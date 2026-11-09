import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Blog as BlogType, LoggedInUser } from '../types'
import { Actions, BlogCard, DangerButton, DetailText, SecondaryButton, Button } from './ui'

interface Props {
  blog: BlogType
  user: LoggedInUser | null
  onLike: (blog: BlogType) => void | Promise<void>
  onRemove: (blog: BlogType) => void | Promise<void>
}

export default function Blog({ blog, user, onLike, onRemove }: Props) {
  const [showDetails, setShowDetails] = useState(false)
  const isOwner = Boolean(user && blog.user?.username === user.username)

  return (
    <BlogCard data-testid="blog-item" className="blog-item">
      <div>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> by {blog.author}
        {' '}
        <SecondaryButton type="button" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </SecondaryButton>
      </div>
      {showDetails && (
        <div data-testid="blog-details">
          <DetailText>{blog.url}</DetailText>
          <DetailText>Likes: {blog.likes}</DetailText>
          <DetailText>Added by {blog.user?.name || blog.user?.username || 'Unknown user'}</DetailText>
          <Actions>
            {user && <Button type="button" onClick={() => void onLike(blog)}>like</Button>}
            {isOwner && <DangerButton type="button" onClick={() => void onRemove(blog)}>remove</DangerButton>}
          </Actions>
        </div>
      )}
    </BlogCard>
  )
}
