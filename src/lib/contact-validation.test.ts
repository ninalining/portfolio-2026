import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  validateContactForm,
  stripControlChars,
  MAX_NAME_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
} from './contact-validation'

describe('isValidEmail()', () => {
  it('accepts standard email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name+tag@sub.domain.org')).toBe(true)
  })

  it('rejects addresses without @', () => {
    expect(isValidEmail('notanemail')).toBe(false)
  })

  it('rejects addresses without domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })

  it('rejects addresses without local part', () => {
    expect(isValidEmail('@example.com')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('rejects whitespace-only string', () => {
    expect(isValidEmail('   ')).toBe(false)
  })
})

describe('validateContactForm()', () => {
  const valid = { name: 'Nina', email: 'nina@example.com', message: 'Hello!' }

  it('returns no errors for valid data', () => {
    expect(validateContactForm(valid)).toEqual({})
  })

  it('requires name', () => {
    const errors = validateContactForm({ ...valid, name: '' })
    expect(errors.name).toBe('Name is required.')
    expect(errors.email).toBeUndefined()
    expect(errors.message).toBeUndefined()
  })

  it('treats whitespace-only name as empty', () => {
    const errors = validateContactForm({ ...valid, name: '   ' })
    expect(errors.name).toBe('Name is required.')
  })

  it('rejects name exceeding MAX_NAME_LENGTH', () => {
    const errors = validateContactForm({ ...valid, name: 'a'.repeat(MAX_NAME_LENGTH + 1) })
    expect(errors.name).toMatch(/100 characters/)
  })

  it('accepts name exactly at MAX_NAME_LENGTH', () => {
    const errors = validateContactForm({ ...valid, name: 'a'.repeat(MAX_NAME_LENGTH) })
    expect(errors.name).toBeUndefined()
  })

  it('requires valid email', () => {
    const errors = validateContactForm({ ...valid, email: 'notvalid' })
    expect(errors.email).toBe('A valid email is required.')
  })

  it('requires non-empty email', () => {
    const errors = validateContactForm({ ...valid, email: '' })
    expect(errors.email).toBe('A valid email is required.')
  })

  it('rejects email exceeding MAX_EMAIL_LENGTH', () => {
    // 249 'a's + '@b.com' = 255 chars, which exceeds MAX_EMAIL_LENGTH (254)
    const longEmail = 'a'.repeat(MAX_EMAIL_LENGTH - 5) + '@b.com'
    const errors = validateContactForm({ ...valid, email: longEmail })
    expect(errors.email).toMatch(/254 characters/)
  })

  it('requires message', () => {
    const errors = validateContactForm({ ...valid, message: '' })
    expect(errors.message).toBe('Message is required.')
  })

  it('treats whitespace-only message as empty', () => {
    const errors = validateContactForm({ ...valid, message: '   ' })
    expect(errors.message).toBe('Message is required.')
  })

  it('rejects message exceeding MAX_MESSAGE_LENGTH', () => {
    const errors = validateContactForm({ ...valid, message: 'a'.repeat(MAX_MESSAGE_LENGTH + 1) })
    expect(errors.message).toMatch(/5000 characters/)
  })

  it('accepts message exactly at MAX_MESSAGE_LENGTH', () => {
    const errors = validateContactForm({ ...valid, message: 'a'.repeat(MAX_MESSAGE_LENGTH) })
    expect(errors.message).toBeUndefined()
  })

  it('returns all three errors when all fields are empty', () => {
    const errors = validateContactForm({ name: '', email: '', message: '' })
    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.message).toBeDefined()
  })
})

describe('stripControlChars()', () => {
  it('leaves normal text unchanged', () => {
    expect(stripControlChars('Hello World')).toBe('Hello World')
  })

  it('strips carriage return and newline (header injection chars)', () => {
    expect(stripControlChars('name\r\nBcc: attacker@evil.com')).toBe('nameBcc: attacker@evil.com')
  })

  it('strips null byte', () => {
    expect(stripControlChars('abc\x00def')).toBe('abcdef')
  })

  it('strips DEL character (\\x7F)', () => {
    expect(stripControlChars('abc\x7Fdef')).toBe('abcdef')
  })

  it('strips all control characters in range \\x00-\\x1F', () => {
    const withControls = '\x01\x02\x1Ftest\x00'
    expect(stripControlChars(withControls)).toBe('test')
  })

  it('preserves unicode and emoji', () => {
    expect(stripControlChars('Héllo 🌍')).toBe('Héllo 🌍')
  })

  it('returns empty string unchanged', () => {
    expect(stripControlChars('')).toBe('')
  })
})
