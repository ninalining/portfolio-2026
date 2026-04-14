import type { LucideIcon } from 'lucide-react'

export interface ContactInfoItem {
  Icon: LucideIcon
  label: string
  value: string
  href: string | null
  iconBg: string
}

export interface ContactSocialLink {
  Icon: LucideIcon
  label: string
  href: string
  iconBg: string
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export type ContactFormStatus = 'idle' | 'submitting' | 'success'

export interface ContactFormLabels {
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submit: string
  successMessage: string
}
