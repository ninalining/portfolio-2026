import { test, expect } from '@playwright/test'

test.describe('About section', () => {
  test('renders section heading', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('#about')
    await expect(section.getByRole('heading', { level: 2 })).toContainText('About Me')
  })

  test('renders all three feature cards', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('#about')
    await expect(section.getByText('Web Development')).toBeVisible()
    await expect(section.getByText('UI/UX Design')).toBeVisible()
    await expect(section.getByText('Performance')).toBeVisible()
  })

  test('renders Swedish content when locale is sv', async ({ page }) => {
    await page.goto('/sv')
    const section = page.locator('#about')
    await expect(section.getByRole('heading', { level: 2 })).toContainText('Om Mig')
    await expect(section.getByText('Webbutveckling')).toBeVisible()
  })
})
