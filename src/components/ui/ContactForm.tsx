'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import type { ContactFormData, ContactFormStatus } from '@/types/contact'
import type { ContactFormLabels } from '@/types/contact'
import { type FieldErrors, validateContactForm, MAX_NAME_LENGTH, MAX_EMAIL_LENGTH, MAX_MESSAGE_LENGTH } from '@/lib/contact-validation'

interface ContactFormProps {
  labels: ContactFormLabels
}

export function ContactForm({ labels }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<ContactFormStatus>('idle')
  const [serverError, setServerError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError(null)

    const errors = validateContactForm(formData)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setStatus('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const json = (await res.json()) as { error?: string }
        throw new Error(json.error ?? 'Submission failed.')
      }

      setStatus('success')
    } catch (err) {
      setStatus('idle')
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-4xl p-8 shadow-xl flex flex-col items-center justify-center gap-4 text-center min-h-64">
        <CheckCircle className="w-12 h-12 text-primary" aria-hidden="true" />
        <p className="text-lg font-medium text-foreground">{labels.successMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-4xl p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {serverError && (
          <p role="alert" className="text-sm text-destructive font-medium">
            {serverError}
          </p>
        )}

        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium mb-2 text-foreground">
            {labels.nameLabel}
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            required
            aria-required="true"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
            maxLength={MAX_NAME_LENGTH}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined })
            }}
            className="w-full px-5 py-4 border-2 border-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-cream aria-invalid:border-destructive"
            placeholder={labels.namePlaceholder}
          />
          {fieldErrors.name && (
            <p id="contact-name-error" role="alert" className="mt-1 text-xs text-destructive">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium mb-2 text-foreground">
            {labels.emailLabel}
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            required
            aria-required="true"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
            maxLength={MAX_EMAIL_LENGTH}
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined })
            }}
            className="w-full px-5 py-4 border-2 border-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-cream aria-invalid:border-destructive"
            placeholder={labels.emailPlaceholder}
          />
          {fieldErrors.email && (
            <p id="contact-email-error" role="alert" className="mt-1 text-xs text-destructive">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium mb-2 text-foreground"
          >
            {labels.messageLabel}
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            aria-required="true"
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
            rows={6}
            maxLength={MAX_MESSAGE_LENGTH}
            value={formData.message}
            onChange={(e) => {
              setFormData({ ...formData, message: e.target.value })
              if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: undefined })
            }}
            className="w-full px-5 py-4 border-2 border-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all bg-cream aria-invalid:border-destructive"
            placeholder={labels.messagePlaceholder}
          />
          {fieldErrors.message && (
            <p id="contact-message-error" role="alert" className="mt-1 text-xs text-destructive">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full px-8 py-5 bg-primary text-primary-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2 group font-medium disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
        >
          <span>{status === 'submitting' ? '...' : labels.submit}</span>
          <Send
            size={20}
            className="group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  )
}
