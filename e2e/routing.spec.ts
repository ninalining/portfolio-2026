import { test, expect } from '@playwright/test'

test.describe('Locale routing', () => {
  test('/ redirects to /en', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/en$/)
  })

  test('/en renders the page with navigation', async ({ page }) => {
    await page.goto('/en')
    await expect(page.getByTestId('navigation')).toBeVisible()
  })

  test('/sv renders the page in Swedish', async ({ page }) => {
    await page.goto('/sv')
    await expect(page).toHaveURL(/\/sv$/)
    await expect(page.getByTestId('navigation')).toBeVisible()
  })
})

test.describe('API routing', () => {
  test('/api/chat is not redirected by locale proxy', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: { messages: [], locale: 'en' },
    })
    // Should reach the route handler (not a locale 307 redirect)
    // 4xx is acceptable (missing GROQ key in test env), 307 is not
    expect(response.status()).not.toBe(307)
    expect(response.url()).not.toMatch(/\/en\/api\/chat/)
  })
})
