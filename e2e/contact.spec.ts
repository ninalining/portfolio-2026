import { test, expect } from '@playwright/test'

test.describe('Contact section', () => {
  test('shows section heading and subtitle (EN)', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('section#contact')
    await expect(section.getByRole('heading', { level: 2 })).toBeVisible()
    await expect(section.getByRole('heading', { level: 2 })).toContainText('Contact')
  })

  test('shows contact info items and social links', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('section#contact')
    // Email link (role=link inside the info list)
    await expect(section.getByRole('link', { name: /linkedin/i })).toBeVisible()
    await expect(section.getByRole('link', { name: /github/i })).toBeVisible()
  })

  test('renders form with name, email, message fields and submit button', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('section#contact')
    await expect(section.getByLabel('Name')).toBeVisible()
    await expect(section.getByLabel('Email')).toBeVisible()
    await expect(section.getByLabel('Message')).toBeVisible()
    await expect(section.getByRole('button', { name: /send message/i })).toBeVisible()
  })

  test('shows inline validation errors on empty submit', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('section#contact')
    await section.getByRole('button', { name: /send message/i }).click()
    await expect(section.getByText('Name is required.')).toBeVisible()
    await expect(section.getByText('A valid email is required.')).toBeVisible()
    await expect(section.getByText('Message is required.')).toBeVisible()
  })

  test('shows success state after form submission via mocked API', async ({ page }) => {
    await page.route('/api/contact', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) }),
    )
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

  test('shows error message on API failure', async ({ page }) => {
    await page.route('/api/contact', (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      }),
    )
    await page.goto('/en')
    const section = page.locator('section#contact')
    await section.getByLabel('Name').fill('Test User')
    await section.getByLabel('Email').fill('test@example.com')
    await section.getByLabel('Message').fill('Test message')
    await section.getByRole('button', { name: /send message/i }).click()
    await expect(section.getByRole('alert')).toBeVisible({ timeout: 5000 })
  })

  test('shows Swedish translations (SV)', async ({ page }) => {
    await page.goto('/sv')
    const section = page.locator('section#contact')
    await expect(section.getByRole('heading', { level: 2 })).toContainText('Kontakta Mig')
    await expect(section.getByRole('button', { name: /skicka meddelande/i })).toBeVisible()
  })
})
