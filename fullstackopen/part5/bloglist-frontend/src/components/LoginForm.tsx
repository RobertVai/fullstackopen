import { useState, type FormEvent } from 'react'
import { Button, Field, Form, Input, Panel } from './ui'

interface Props {
  onLogin: (username: string, password: string) => Promise<void>
}

export default function LoginForm({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onLogin(username, password)
    setPassword('')
  }

  return (
    <Panel>
      <h2>Log in to application</h2>
      <Form onSubmit={handleSubmit}>
        <Field>
          username
          <Input name="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
        </Field>
        <Field>
          password
          <Input name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </Field>
        <Button type="submit">login</Button>
      </Form>
    </Panel>
  )
}
