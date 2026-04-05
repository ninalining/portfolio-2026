'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import type { ContactFormData, ContactFormLabels, ContactFormStatus } from '@/types/contact'

interface ContactFormProps {
  labels: ContactFormLabels
}

export function ContactForm({ labels }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<ContactFormStatus>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')
    // TODO: Integrate with an email service (e.g. Resend via Next.js API route)
    await new Promise<void>((resolve) => setTimeout(resolve, 600))
    setStatus('success')
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-5 py-4 border-2 border-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-cream"
            placeholder={labels.namePlaceholder}
          />
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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-5 py-4 border-2 border-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-cream"
            placeholder={labels.emailPlaceholder}
          />
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
            rows={6}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-5 py-4 border-2 border-muted rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all bg-cream"
            placeholder={labels.messagePlaceholder}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full px-8 py-5 bg-primary text-primary-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2 group font-medium disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
        >
          <span>{labels.submit}</span>
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
