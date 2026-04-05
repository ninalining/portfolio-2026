import { test, expect } from '@playwright/test'

test.describe('Contact section', () => {
  test('shows section heading and subtitle (EN)', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('section#contact')
    await expect(section.getByRole('heading', { level: 2, name: 'Contact' })).toBeVisible()
    await expect(
      section.getByText("Have a project or idea? I'd love to hear from you."),
    ).toBeVisible()
  })

  test('shows contact info (email, location) and social links', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('section#contact')
    // Email link
    await expect(section.getByRole('link', { name: 'hello@ninali.dev' })).toBeVisible()
    // Location text
    await expect(section.getByText('Stockholm, Sweden')).toBeVisible()
    // Social links
    await expect(section.getByRole('link', { name: 'LinkedIn' })).toBeVisible()
    await expect(section.getByRole('link', { name: 'GitHub' })).toBeVisible()
  })

  test('renders form with name, email, message fields and submit button', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('section#contact')
    await expect(section.getByLabel('Name')).toBeVisible()
    await expect(section.getByLabel('Email')).toBeVisible()
    await expect(section.getByLabel('Message')).toBeVisible()
    await expect(section.getByRole('button', { name: /send message/i })).toBeVisible()
  })

  test('shows success state after form submission', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('section#contact')
    await section.getByLabel('Name').fill('Test User')
    await section.getByLabel('Email').fill('test@example.com')
    await section.getByLabel('Message').fill('Hello, this is a test message.')
    await section.getByRole('button', { name: /send message/i }).click()
    await expect(
      section.getByText("Thank you for your message! I'll get back to you soon."),
    ).toBeVisible({ timeout: 5000 })
  })

  test('shows Swedish translations (SV)', async ({ page }) => {
    await page.goto('/sv')
    const section = page.locator('section#contact')
    await expect(section.getByRole('heading', { level: 2, name: 'Kontakta Mig' })).toBeVisible()
    await expect(section.getByRole('button', { name: /skicka meddelande/i })).toBeVisible()
  })
})
