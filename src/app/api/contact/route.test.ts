import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MAX_NAME_LENGTH, MAX_EMAIL_LENGTH, MAX_MESSAGE_LENGTH } from '@/lib/contact-validation'
import { POST } from './route'

// ── Hoist mock vars so they are available inside vi.mock factory ─────────
const mockSend = vi.hoisted(() => vi.fn())

// ── Mock Resend before importing the route ────────────────────────────────
vi.mock('resend', () => ({
  // Must be a regular function (not arrow) to act as a constructor with `new`
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: mockSend } }
  }),
}))

// ── Helpers ────────────────────────────────────────────────────────────────
function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validBody = {
  name: 'Nina',
  email: 'nina@example.com',
  message: 'Hello, this is a test.',
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe('POST /api/contact', () => {
  beforeEach(() => {
    mockSend.mockReset()
    mockSend.mockResolvedValue({ data: {}, error: null })
    vi.stubEnv('CONTACT_TO_EMAIL', 'inbox@example.com')
    vi.stubEnv('CONTACT_FROM_EMAIL', 'Portfolio Contact <onboarding@resend.dev>')
  })

  describe('input validation — 422', () => {
    it('rejects missing name', async () => {
      const res = await POST(makeRequest({ ...validBody, name: '' }))
      expect(res.status).toBe(422)
      const json = await res.json()
      expect(json.error).toMatch(/name/i)
    })

    it('rejects name over MAX_NAME_LENGTH', async () => {
      const res = await POST(makeRequest({ ...validBody, name: 'a'.repeat(MAX_NAME_LENGTH + 1) }))
      expect(res.status).toBe(422)
    })

    it('rejects invalid email', async () => {
      const res = await POST(makeRequest({ ...validBody, email: 'notvalid' }))
      expect(res.status).toBe(422)
      const json = await res.json()
      expect(json.error).toMatch(/email/i)
    })

    it('rejects email over MAX_EMAIL_LENGTH', async () => {
      const longEmail = 'a'.repeat(MAX_EMAIL_LENGTH - 5) + '@b.com'
      const res = await POST(makeRequest({ ...validBody, email: longEmail }))
      expect(res.status).toBe(422)
    })

    it('rejects missing message', async () => {
      const res = await POST(makeRequest({ ...validBody, message: '' }))
      expect(res.status).toBe(422)
      const json = await res.json()
      expect(json.error).toMatch(/message/i)
    })

    it('rejects message over MAX_MESSAGE_LENGTH', async () => {
      const res = await POST(makeRequest({ ...validBody, message: 'a'.repeat(MAX_MESSAGE_LENGTH + 1) }))
      expect(res.status).toBe(422)
    })

    it('rejects malformed JSON body', async () => {
      const req = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not json',
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  describe('server misconfiguration — 500', () => {
    it('returns 500 when CONTACT_TO_EMAIL is not set', async () => {
      vi.stubEnv('CONTACT_TO_EMAIL', '')
      const res = await POST(makeRequest(validBody))
      expect(res.status).toBe(500)
      const json = await res.json()
      expect(json.error).toMatch(/misconfiguration/i)
    })
  })

  describe('Resend failure — 500', () => {
    it('returns 500 when Resend reports an error', async () => {
      mockSend.mockResolvedValue({ data: null, error: { message: 'Resend API error' } })
      const res = await POST(makeRequest(validBody))
      expect(res.status).toBe(500)
      const json = await res.json()
      expect(json.error).toMatch(/failed to send/i)
    })
  })

  describe('success — 200', () => {
    it('returns { ok: true } for valid payload', async () => {
      const res = await POST(makeRequest(validBody))
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json).toEqual({ ok: true })
    })

    it('strips control chars from user name in subject line', async () => {
      const injected = { ...validBody, name: 'Nina\r\nBcc: evil@x.com' }
      await POST(makeRequest(injected))
      const call = mockSend.mock.calls[0][0] as { subject: string }
      // \r and \n stripped → no CRLF header injection possible
      expect(call.subject).not.toMatch(/\r/)
      expect(call.subject).not.toMatch(/\n/)
    })

    it('uses CONTACT_FROM_EMAIL env var as from address', async () => {
      vi.stubEnv('CONTACT_FROM_EMAIL', 'Test <noreply@ninali.dev>')
      await POST(makeRequest(validBody))
      const call = mockSend.mock.calls[0][0] as { from: string }
      expect(call.from).toBe('Test <noreply@ninali.dev>')
    })

    it('falls back to onboarding@resend.dev when CONTACT_FROM_EMAIL is unset', async () => {
      vi.stubEnv('CONTACT_FROM_EMAIL', '')
      await POST(makeRequest(validBody))
      const call = mockSend.mock.calls[0][0] as { from: string }
      expect(call.from).toMatch(/onboarding@resend\.dev/)
    })
  })
})
