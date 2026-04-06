import { NextResponse } from 'next/server'

interface ContactPayload {
  name: string
  email: string
  message: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 422 })
  }
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 422 })
  }

  // TODO: Wire up an email delivery service (e.g. Resend).
  // Example:
  //   import { Resend } from 'resend'
  //   const resend = new Resend(process.env.RESEND_API_KEY)
  //   await resend.emails.send({ from: 'noreply@...', to: process.env.CONTACT_EMAIL, ... })
  console.log('[contact] New submission from:', email)

  return NextResponse.json({ ok: true }, { status: 200 })
}
