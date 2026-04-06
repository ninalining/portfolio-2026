import type { ContactFormData } from '@/types/contact'

export interface FieldErrors {
  name?: string
  email?: string
  message?: string
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateContactForm(data: ContactFormData): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.name.trim()) errors.name = 'Name is required.'
  if (!data.email.trim() || !isValidEmail(data.email)) errors.email = 'A valid email is required.'
  if (!data.message.trim()) errors.message = 'Message is required.'
  return errors
}
