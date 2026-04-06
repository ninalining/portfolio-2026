import { describe, it, expect } from 'vitest'
import { isValidEmail, validateContactForm } from './contact-validation'

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

  it('requires valid email', () => {
    const errors = validateContactForm({ ...valid, email: 'notvalid' })
    expect(errors.email).toBe('A valid email is required.')
  })

  it('requires non-empty email', () => {
    const errors = validateContactForm({ ...valid, email: '' })
    expect(errors.email).toBe('A valid email is required.')
  })

  it('requires message', () => {
    const errors = validateContactForm({ ...valid, message: '' })
    expect(errors.message).toBe('Message is required.')
  })

  it('treats whitespace-only message as empty', () => {
    const errors = validateContactForm({ ...valid, message: '   ' })
    expect(errors.message).toBe('Message is required.')
  })

  it('returns all three errors when all fields are empty', () => {
    const errors = validateContactForm({ name: '', email: '', message: '' })
    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.message).toBeDefined()
  })
})
