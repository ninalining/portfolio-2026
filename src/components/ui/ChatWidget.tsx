'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'
import { Bot, Send, X } from 'lucide-react'

import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChatWidgetProps } from '@/types/chat'

export function ChatWidget({ locale }: ChatWidgetProps) {
  const t = useTranslations('chat')
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const welcomeMessage = useMemo<UIMessage>(
    () => ({
      id: 'welcome',
      role: 'assistant',
      parts: [{ type: 'text', text: t('welcomeMessage') }],
    }),
    [t],
  )

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat', body: { locale } }),
    [locale],
  )

  const { messages, sendMessage, status } = useChat({
    transport,
    messages: [welcomeMessage],
  })

  const suggestedQuestions = [t('q1'), t('q2'), t('q3')]
  const isLoading = status === 'streaming' || status === 'submitted'
  const hasOnlyWelcome = messages.length === 1 && messages[0]?.id === 'welcome'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    void sendMessage({ text })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* FAB — collapsed state */}
      {!isExpanded && (
        <div className="fixed bottom-6 right-6 z-50">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />

          {/* Tooltip bubble */}
          <div className="absolute -top-16 right-0 flex items-center gap-2 whitespace-nowrap rounded-xl border-2 border-primary bg-background px-5 py-2.5 shadow-xl">
            <Bot size={18} className="text-primary" />
            <span className="text-sm font-bold text-foreground">{t('fabLabel')}</span>
            <span className="absolute -bottom-2 right-8 size-4 rotate-45 border-b-2 border-r-2 border-primary bg-background" />
          </div>

          <button
            onClick={() => setIsExpanded(true)}
            className="relative flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-all duration-200 hover:scale-110 hover:brightness-95"
            aria-label={t('openLabel')}
          >
            <Bot size={36} strokeWidth={2.5} />
            <span className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-bold text-secondary-foreground shadow-lg">
              AI
            </span>
          </button>
        </div>
      )}

      {/* Chat panel — expanded state */}
      {isExpanded && (
        <div
          role="dialog"
          aria-label={t('openLabel')}
          className="fixed bottom-6 right-6 z-50 flex w-[380px] flex-col overflow-hidden rounded-[24px] bg-background shadow-2xl
            max-md:inset-x-0 max-md:bottom-0 max-md:w-full max-md:rounded-b-none max-md:rounded-t-[24px]"
          style={{ height: '520px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-background">
                <Bot size={22} className="text-primary" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary-foreground">{t('headerTitle')}</h3>
                <p className="mt-0.5 text-xs text-primary-foreground/80">{t('headerSubtitle')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
              aria-label={t('closeLabel')}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex gap-2 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot size={16} className="text-primary-foreground" strokeWidth={2} />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-primary-foreground text-background'
                        : 'bg-accent text-accent-foreground'
                    }`}
                  >
                    {message.parts.map((part, i) => {
                      if (part.type === 'text') {
                        return <span key={i}>{part.text}</span>
                      }
                      return null
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Bot size={16} className="text-primary-foreground" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-1 rounded-xl bg-accent px-4 py-3">
                  <span className="size-2 animate-bounce rounded-full bg-accent-foreground/50 [animation-delay:0ms]" />
                  <span className="size-2 animate-bounce rounded-full bg-accent-foreground/50 [animation-delay:150ms]" />
                  <span className="size-2 animate-bounce rounded-full bg-accent-foreground/50 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {hasOnlyWelcome && (
            <div className="border-t border-border px-6 py-3">
              <p className="mb-2 text-xs text-muted-foreground">{t('suggestedLabel')}</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="rounded-full bg-muted px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border bg-background px-6 py-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('placeholder')}
                aria-label={t('placeholder')}
                className="flex-1 rounded-full bg-input-background px-4 py-3 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-110 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={t('sendLabel')}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
