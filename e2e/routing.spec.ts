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
