import { test, expect, type Page } from '@playwright/test'

const backend = 'http://localhost:3003'

async function logIn(page: Page, username = 'testuser', password = 'secret123') {
  await page.goto('/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await expect(page.getByText(`${username === 'testuser' ? 'Test User' : username} logged in`)).toBeVisible()
}

async function createBlog(page: Page, title: string) {
  await page.getByRole('link', { name: 'Create' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill('Author Example')
  await page.getByLabel('url').fill('https://example.com')
  await page.getByRole('button', { name: 'create', exact: true }).click()
  await expect(page.getByTestId('blog-list').getByText(title)).toBeVisible()
}

test.describe('Blog List', () => {
  test.beforeEach(async ({ request, page }) => {
    const reset = await request.post(`${backend}/api/testing/reset`)
    expect(reset.ok()).toBeTruthy()
    const created = await request.post(`${backend}/api/users`, {
      data: { username: 'testuser', name: 'Test User', password: 'secret123' },
    })
    expect(created.ok()).toBeTruthy()
    await page.goto('/login')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await logIn(page)
  })

  test('login fails with incorrect password', async ({ page }) => {
    await page.getByLabel('username').fill('testuser')
    await page.getByLabel('password').fill('incorrect')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByRole('alert')).toContainText('invalid username or password')
  })

  test.describe('while logged in', () => {
    test.beforeEach(async ({ page }) => { await logIn(page) })

    test('user creates a new blog', async ({ page }) => {
      await createBlog(page, 'A new blog')
      await expect(page.getByTestId('blog-item')).toHaveCount(1)
    })

    test('user likes a blog', async ({ page }) => {
      await createBlog(page, 'Likeable blog')
      await page.getByRole('link', { name: 'Likeable blog' }).click()
      await expect(page.getByText('Likes: 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('Likes: 1')).toBeVisible()
    })

    test('creator deletes own blog', async ({ page }) => {
      await createBlog(page, 'Blog to delete')
      await page.getByRole('link', { name: 'Blog to delete' }).click()
      page.once('dialog', (dialog) => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByTestId('blog-item')).toHaveCount(0)
    })

    test('only creator sees remove button', async ({ page, request }) => {
      await createBlog(page, 'Owned blog')
      await page.getByRole('link', { name: 'Owned blog' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await request.post(`${backend}/api/users`, {
        data: { username: 'bob', name: 'bob', password: 'secret123' },
      })
      await page.getByRole('button', { name: 'logout' }).click()
      await logIn(page, 'bob')
      await page.getByRole('link', { name: 'Owned blog' }).click()
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })

    test('blogs are sorted by likes, highest first', async ({ page }) => {
      await createBlog(page, 'Less popular')
      await createBlog(page, 'More popular')
      await page.getByRole('link', { name: 'More popular' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('link', { name: 'Blogs' }).click()
      const items = page.getByTestId('blog-item')
      await expect(items.nth(0)).toContainText('More popular')
      await expect(items.nth(1)).toContainText('Less popular')
    })
  })
})
