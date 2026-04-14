import { test, expect } from '@playwright/test'

test.describe('About section', () => {
  test('renders section heading in English', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('#about')
    await expect(section.getByRole('heading', { level: 2 })).toBeVisible()
  })

  test('renders feature cards', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('#about')
    // Expect at least one feature card rendered (CMS-driven count may vary)
    const cards = section.locator('[class*="rounded"]').filter({ hasText: /.+/ })
    await expect(cards.first()).toBeVisible()
  })

  test('renders Swedish section heading when locale is sv', async ({ page }) => {
    await page.goto('/sv')
    const section = page.locator('#about')
    await expect(section.getByRole('heading', { level: 2 })).toContainText('Om Mig')
  })
})
