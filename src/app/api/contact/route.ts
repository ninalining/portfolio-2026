import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  isValidEmail,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  stripControlChars,
} from '@/lib/contact-validation'

interface ContactPayload {
  name: string
  email: string
  message: string
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, message } = body as Partial<ContactPayload>

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 422 })
  }
  if (name.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: `Name must be ${MAX_NAME_LENGTH} characters or fewer.` },
      { status: 422 },
    )
  }
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 422 })
  }
  if (email.length > MAX_EMAIL_LENGTH) {
    return NextResponse.json(
      { error: `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.` },
      { status: 422 },
    )
  }
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 422 })
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
      { status: 422 },
    )
  }

  const to = process.env.CONTACT_TO_EMAIL
  if (!to) {
    console.error('[contact] CONTACT_TO_EMAIL is not set')
    return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 })
  }

  // Sanitize fields used in email headers to prevent header injection
  const safeName = stripControlChars(name.trim())
  const safeEmail = stripControlChars(email.trim())
  const safeMessage = stripControlChars(message.trim())

  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>'

  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: safeEmail,
    subject: `New message from ${safeName}`,
    text: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${safeMessage}`,
  })

  if (error) {
    console.error('[contact] Resend error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
