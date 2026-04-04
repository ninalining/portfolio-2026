import { test, expect } from '@playwright/test'

test.describe('Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en')
  })

  test('renders hero section with name and title', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()
    await expect(hero.getByRole('heading', { name: /nina li/i })).toBeVisible()
    await expect(hero.getByText(/senior full-stack engineer/i)).toBeVisible()
  })

  test('CTA buttons link to correct sections', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero.getByRole('link', { name: /view projects/i })).toHaveAttribute('href', '#projects')
    await expect(hero.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', '#contact')
  })

  test('social links are present', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero.getByRole('link', { name: /github/i })).toBeVisible()
    await expect(hero.getByRole('link', { name: /linkedin/i })).toBeVisible()
    await expect(hero.getByRole('link', { name: /email/i })).toBeVisible()
  })
})
