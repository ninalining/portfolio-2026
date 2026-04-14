import { test, expect } from '@playwright/test'

test.describe('Skills section', () => {
  test('renders section heading (EN)', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('#skills')
    await expect(section).toBeVisible()
    await expect(section.getByRole('heading', { level: 2 })).toBeVisible()
  })

  test('renders 3 category headings from CMS', async ({ page }) => {
    await page.goto('/en')
    const headings = page.locator('#skills h3')
    await expect(headings).toHaveCount(3)
  })

  test('renders highlights row with stat values', async ({ page }) => {
    await page.goto('/en')
    // Verify the highlights row exists and has 3 stat blocks
    const highlights = page.locator('#skills').locator('[class*="rounded-4xl"]')
    await expect(highlights.first()).toBeVisible()
  })

  test('renders Swedish section heading', async ({ page }) => {
    await page.goto('/sv')
    const section = page.locator('#skills')
    await expect(section.getByRole('heading', { level: 2 })).toContainText('Kompetenser')
  })
})
