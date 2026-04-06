export type ChatLocale = 'en' | 'sv'

export interface ChatRequestBody {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  locale: ChatLocale
}

export interface ChatWidgetProps {
  locale: ChatLocale
}
