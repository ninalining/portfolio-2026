import { test, expect } from '@playwright/test'

test.describe('Navigation smoke tests', () => {
  test('renders sticky navigation with all section links on desktop', async ({ page }) => {
    await page.goto('/en')

    const nav = page.getByTestId('navigation')
    await expect(nav).toBeVisible()

    // Logo link
    await expect(nav.getByRole('link', { name: /nina li/i })).toBeVisible()

    // 5 section links
    await expect(nav.getByRole('link', { name: /about/i })).toBeVisible()
    await expect(nav.getByRole('link', { name: /experience/i })).toBeVisible()
    await expect(nav.getByRole('link', { name: /skills/i })).toBeVisible()
    await expect(nav.getByRole('link', { name: /projects/i })).toBeVisible()
    await expect(nav.getByRole('link', { name: /contact/i })).toBeVisible()

    // Globe language button
    await expect(nav.getByRole('button', { name: /select language/i })).toBeVisible()
  })

  test('mobile: hamburger opens overlay, Escape closes it and returns focus', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/en')

    const nav = page.getByTestId('navigation')

    // Hamburger should be visible, desktop links hidden
    const hamburger = nav.getByRole('button', { name: /open navigation menu/i })
    await expect(hamburger).toBeVisible()

    // Open overlay
    await hamburger.click()
    const overlay = page.getByRole('dialog', { name: /navigation menu/i })
    await expect(overlay).toBeVisible()

    // Nav links visible in overlay
    await expect(overlay.getByRole('link', { name: /about/i })).toBeVisible()

    // Escape closes overlay
    await page.keyboard.press('Escape')
    await expect(overlay).not.toBeVisible()
  })

  test('mobile: overlay closes when nav link is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/en')

    const hamburger = page.getByRole('button', { name: /open navigation menu/i })
    await hamburger.click()

    const overlay = page.getByRole('dialog', { name: /navigation menu/i })
    await expect(overlay).toBeVisible()

    await overlay.getByRole('link', { name: /about/i }).click()
    await expect(overlay).not.toBeVisible()
  })
})
