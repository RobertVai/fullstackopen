import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

test('submits the title, author and URL', async () => {
  const user = userEvent.setup()
  const onCreate = vi.fn().mockResolvedValue(true)
  render(<BlogForm onCreate={onCreate} />)

  await user.type(screen.getByLabelText('title'), 'Testing React')
  await user.type(screen.getByLabelText('author'), 'Linus')
  await user.type(screen.getByLabelText('url'), 'https://example.com')
  await user.click(screen.getByRole('button', { name: 'create' }))

  expect(onCreate).toHaveBeenCalledOnce()
  expect(onCreate).toHaveBeenCalledWith({
    title: 'Testing React',
    author: 'Linus',
    url: 'https://example.com',
  })
})
