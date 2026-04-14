import { test, expect } from '@playwright/test'

test.describe('Projects section', () => {
  test('renders section heading', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('#projects')
    await expect(section).toBeVisible()
    await expect(section.getByRole('heading', { name: 'Projects' })).toBeVisible()
  })

  test('renders 3 project cards', async ({ page }) => {
    await page.goto('/en')
    // Count matches the number of entries in src/data/projects.ts
    const cards = page.locator('#projects article')
    await expect(cards).toHaveCount(3)
  })

  test('each card has at least one link', async ({ page }) => {
    await page.goto('/en')
    const cards = page.locator('#projects article')
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      const links = cards.nth(i).locator('a')
      await expect(links.first()).toBeVisible()
    }
  })

  test('renders Swedish project heading', async ({ page }) => {
    await page.goto('/sv')
    const section = page.locator('#projects')
    await expect(section.getByRole('heading', { name: 'Projekt' })).toBeVisible()
  })
})
