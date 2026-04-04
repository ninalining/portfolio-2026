import { test, expect } from '@playwright/test'

test.describe('Skills section', () => {
  test('renders section heading', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('#skills')
    await expect(section).toBeVisible()
    await expect(section.getByRole('heading', { name: 'Skills' })).toBeVisible()
  })

  test('renders 3 category headings', async ({ page }) => {
    await page.goto('/en')
    // frontend, backend, tools — matches categories in src/data/skills.ts
    const headings = page.locator('#skills h3')
    await expect(headings).toHaveCount(3)
  })

  test('renders skill tags for each category', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('#skills')
    await expect(section.getByText('React')).toBeVisible()
    await expect(section.getByText('Node.js')).toBeVisible()
    await expect(section.getByText('Git & GitHub')).toBeVisible()
  })

  test('renders highlights row', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('#skills').getByText('5+')).toBeVisible()
  })

  test('renders Swedish heading', async ({ page }) => {
    await page.goto('/sv')
    const section = page.locator('#skills')
    await expect(section.getByRole('heading', { name: 'Kompetenser' })).toBeVisible()
  })
})
