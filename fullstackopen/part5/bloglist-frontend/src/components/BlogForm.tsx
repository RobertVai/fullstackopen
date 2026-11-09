import { useState, type FormEvent } from 'react'
import type { NewBlog } from '../types'
import { Button, Field, Form, Input, Panel } from './ui'

interface Props {
  onCreate: (blog: NewBlog) => Promise<boolean>
}

export default function BlogForm({ onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const created = await onCreate({ title, author, url })
    if (created) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <Panel>
      <h2>Create new blog</h2>
      <Form onSubmit={handleSubmit}>
        <Field>
          title
          <Input value={title} onChange={(event) => setTitle(event.target.value)} name="title" required />
        </Field>
        <Field>
          author
          <Input value={author} onChange={(event) => setAuthor(event.target.value)} name="author" />
        </Field>
        <Field>
          url
          <Input value={url} onChange={(event) => setUrl(event.target.value)} name="url" required />
        </Field>
        <Button type="submit">create</Button>
      </Form>
    </Panel>
  )
}
