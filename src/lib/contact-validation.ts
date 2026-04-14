import type { ContactFormData } from '@/types/contact'

export interface FieldErrors {
  name?: string
  email?: string
  message?: string
}

/** Maximum allowed byte lengths — mirrored in route.ts server-side check */
export const MAX_NAME_LENGTH = 100
export const MAX_EMAIL_LENGTH = 254 // RFC 5321
export const MAX_MESSAGE_LENGTH = 5000

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateContactForm(data: ContactFormData): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.name.trim()) {
    errors.name = 'Name is required.'
  } else if (data.name.length > MAX_NAME_LENGTH) {
    errors.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`
  }
  if (!data.email.trim() || !isValidEmail(data.email)) {
    errors.email = 'A valid email is required.'
  } else if (data.email.length > MAX_EMAIL_LENGTH) {
    errors.email = `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.`
  }
  if (!data.message.trim()) {
    errors.message = 'Message is required.'
  } else if (data.message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`
  }
  return errors
}

/** Strip ASCII control characters (\x00–\x1F, \x7F) to prevent email header injection */
export function stripControlChars(value: string): string {
  return value.replace(/[\x00-\x1F\x7F]/g, '')
}
