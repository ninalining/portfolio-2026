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
