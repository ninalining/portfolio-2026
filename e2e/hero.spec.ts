import { test, expect } from '@playwright/test'

test.describe('Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en')
  })

  test('renders hero section with a visible h1 heading', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('CTA buttons link to correct sections', async ({ page }) => {
    const hero = page.locator('#hero')
    // Verify there are two CTA links pointing to #projects and #contact
    const projectsLink = hero.getByRole('link', { name: /projects/i })
    const contactLink = hero.getByRole('link', { name: /contact|in touch/i })
    await expect(projectsLink).toHaveAttribute('href', '#projects')
    await expect(contactLink).toHaveAttribute('href', '#contact')
  })

  test('social links are present', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero.getByRole('link', { name: /github/i })).toBeVisible()
    await expect(hero.getByRole('link', { name: /linkedin/i })).toBeVisible()
    await expect(hero.getByRole('link', { name: /email/i })).toBeVisible()
  })
})
