import { createGroq } from '@ai-sdk/groq'
import { convertToModelMessages, streamText } from 'ai'
import type { UIMessage } from 'ai'
import { getResumeContext } from '@/lib/resume-context'
import type { ChatLocale } from '@/types/chat'

export const runtime = 'nodejs'

// ---------------------------------------------------------------------------
// In-memory rate limiter (per IP, sliding window)
// ---------------------------------------------------------------------------
const WINDOW_MS = 60_000
const MAX_REQUESTS = 10
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const MAX_OUTPUT_TOKENS = 512

const requestLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (timestamps.length >= MAX_REQUESTS) return true
  requestLog.set(ip, [...timestamps, now])
  return false
}

// ---------------------------------------------------------------------------
// Groq client
// ---------------------------------------------------------------------------
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

// ---------------------------------------------------------------------------
// POST /api/chat
// ---------------------------------------------------------------------------
export async function POST(req: Request): Promise<Response> {
  // Rate limit
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Parse body — DefaultChatTransport sends { messages: UIMessage[], id, locale, trigger, ... }
  let rawBody: Record<string, unknown>
  try {
    rawBody = (await req.json()) as Record<string, unknown>
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const rawMessages = rawBody.messages
  const VALID_LOCALES = new Set<ChatLocale>(['en', 'sv'])
  const locale: ChatLocale =
    typeof rawBody.locale === 'string' && VALID_LOCALES.has(rawBody.locale as ChatLocale)
      ? (rawBody.locale as ChatLocale)
      : 'en'

  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages array is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (
    rawMessages.some(
      (m) =>
        typeof m !== 'object' ||
        m === null ||
        typeof (m as Record<string, unknown>).role !== 'string',
    )
  ) {
    return new Response(JSON.stringify({ error: 'Invalid messages format.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const messages = rawMessages as UIMessage[]

  // Convert UIMessages to ModelMessages for streamText
  const modelMessages = await convertToModelMessages(messages)

  // Build resume context
  let resumeContext: string
  try {
    resumeContext = await getResumeContext(locale)
  } catch {
    resumeContext = 'Resume data is temporarily unavailable.'
  }

  const languageInstruction =
    locale === 'sv'
      ? 'Always respond in Swedish (svenska) unless the user explicitly writes in another language.'
      : 'Detect the language the user is writing in and respond in the same language. Default to English if uncertain.'

  const systemPrompt = `You are an AI assistant representing Nina Li's professional portfolio. Your role is to help visitors learn about Nina's background, skills, and experience.

${languageInstruction}

IMPORTANT RULES:
- Only answer questions related to Nina Li's professional background, skills, experience, projects, and availability.
- If asked about unrelated topics, politely redirect to Nina's professional profile.
- Be friendly, concise, and professional.
- Do not invent information not present in the resume data below.
- If a visitor wants to schedule an interview or book a meeting, tell them to use the contact form on the page.

NINA'S RESUME DATA:
${resumeContext}`

  // Stream response
  const result = streamText({
    model: groq(GROQ_MODEL),
    system: systemPrompt,
    messages: modelMessages,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
  })

  return result.toUIMessageStreamResponse()
}
