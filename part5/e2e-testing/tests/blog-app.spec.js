const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, addUser } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await addUser(request, 'Test User', 'testuser', 'password')
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'password')

      await expect(page.getByText('Test User logged in', { exact: false })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Test User logged in', { exact: false })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'first blog', 'new author', 'https://www.newexample.com')
      await expect(page.getByText('a new blog first blog by new author added')).toBeVisible()
    })

    describe('and a blog already exists', () => {
      beforeEach(async({ page }) => {
        await createBlog(page, 'another blog', 'some author', 'https://www.newoneexample.com')
      })

      test('can be liked', async({ page }) => {
        await page.getByText('another blog some author', {exact: false})
          .getByRole('button', { name: 'view'}).click()
        
        await page.getByRole('button', { name: 'like'}).click()
        await expect(page.getByText('likes 1', { exact: false })).toBeVisible()
      })

      test('the user who created a blog can delete it', async({ page }) => {
        page.on('dialog', dialog => dialog.accept())

        await page.getByText('another blog some author', {exact: false})
          .getByRole('button', { name: 'view'}).click()

        await page.getByRole('button', { name: 'remove'}).click()
        await expect(page.getByText('another blog some author', { exact: false })).not.toBeVisible() 
      })

      describe('and second blog addded by different user',() => {
        beforeEach(async({ page, request}) => {
          await addUser(request, 'Second User', 'seconduser', 'secondpassword')
          await page.getByRole('button',{ name: 'logout' }).click()
          await loginWith(page, 'seconduser', 'secondpassword')
          await createBlog(page, 'second blog', 'second author', 'https://www.secondexample.com')
        })

        test('only the user who added the blog sees the remove button', async({ page }) => {
          const secondBlog = page.getByText('second blog second author', {exact: false})
          await secondBlog.getByRole('button', { name: 'view'}).click()

          await expect(secondBlog.getByRole('button', { name: 'remove'})).toBeVisible()

          const anotherBlog = page.getByText('another blog some author', {exact: false})
          await anotherBlog.getByRole('button', { name: 'view'}).click()

          await expect(anotherBlog.getByRole('button', { name: 'remove'})).not.toBeVisible()
        })

        test('are arranged in the order according to the likes', async({ page }) => {
          const blogs = page.locator('.blog') 
          const secondBlog = blogs.filter({ hasText: 'second blog second author' })
          // page.getByText('second blog second author', {exact: false})
          const anotherBlog = blogs.filter({ hasText: 'another blog some author' })
          // page.getByText('another blog some author', {exact: false})

          // second blog: 2 likes
          await secondBlog.getByRole('button', { name: 'view' }).click()
          await secondBlog.getByRole('button', { name: 'like' }).click()
          await secondBlog.getByRole('button', { name: 'like' }).click()

          // another blog: 1 likes
          await anotherBlog.getByRole('button', { name: 'view' }).click()
          await anotherBlog.getByRole('button', { name: 'like' }).click()

          await expect(secondBlog.getByText('likes 2', { exact: false })).toBeVisible()
          await expect(anotherBlog.getByText('likes 1', { exact: false })).toBeVisible()

          const blogTexts = await blogs.allTextContents()
          expect(blogTexts[0]).toContain('second blog second author')
          expect(blogTexts[1]).toContain('another blog some author')
        })
      })
    })
  })
})