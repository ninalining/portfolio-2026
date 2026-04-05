import { test, expect } from '@playwright/test'

test.describe('Footer', () => {
  test('renders copyright with current year and name', async ({ page }) => {
    await page.goto('/en')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText(String(new Date().getFullYear()))
    await expect(footer).toContainText('Nina Li')
  })

  test('renders English tagline', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('footer')).toContainText('Built with passion')
  })

  test('renders Swedish tagline', async ({ page }) => {
    await page.goto('/sv')
    await expect(page.locator('footer')).toContainText('Skapad med passion')
  })
})
