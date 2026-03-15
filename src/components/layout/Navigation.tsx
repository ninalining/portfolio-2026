'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Globe, Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import type { NavLink } from '@/types/navigation'
import { cn } from '@/lib/utils'

const LOGO_SIZE = 32
const ICON_SIZE_SM = 18
const ICON_SIZE_MD = 24

const NAV_LINKS: NavLink[] = [
  { labelKey: 'about', href: '#about' },
  { labelKey: 'experience', href: '#experience' },
  { labelKey: 'skills', href: '#skills' },
  { labelKey: 'projects', href: '#projects' },
  { labelKey: 'contact', href: '#contact' },
]

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'sv', label: 'SV' },
] as const

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Navigation() {
  const t = useTranslations('navigation')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const globeRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    hamburgerRef.current?.focus()
  }, [])

  const switchLocale = useCallback((targetLocale: string) => {
    setLangOpen(false)
    router.replace(pathname, { locale: targetLocale as 'en' | 'sv' })
  }, [router, pathname])

  // Scroll lock + focus trap when mobile menu opens
  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'

    const overlay = overlayRef.current
    if (!overlay) return

    const focusable = Array.from(
      overlay.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    )
    focusable[0]?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeMenu()
        return
      }
      if (e.key !== 'Tab' || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [menuOpen, closeMenu])

  // Escape to close language dropdown
  useEffect(() => {
    if (!langOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setLangOpen(false)
        globeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [langOpen])

  // Close language dropdown on outside click
  useEffect(() => {
    if (!langOpen) return
    function handleMouseDown(e: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [langOpen])

  return (
    <header
      data-testid="navigation"
      className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md bg-cream/80"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" aria-label="Nina Li — back to top" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm">
          <Image src="/logo-mark.svg" width={LOGO_SIZE} height={LOGO_SIZE} alt="NL logo" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
            >
              {t(link.labelKey as Parameters<typeof t>[0])}
            </a>
          ))}

          {/* Language dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              ref={globeRef}
              aria-label={t('languageMenu')}
              aria-expanded={langOpen}
              aria-haspopup="menu"
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm p-1"
            >
              <Globe size={ICON_SIZE_SM} aria-hidden="true" />
              <span className="uppercase">{locale}</span>
            </button>

            {langOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-24 bg-card rounded-[var(--radius)] shadow-lg border border-border py-1"
              >
                {LOCALES.map(({ code, label }) => (
                  <button
                    key={code}
                    role="menuitem"
                    onClick={() => switchLocale(code)}
                    className={cn(
                      'w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors focus-visible:outline-none focus-visible:bg-muted',
                      locale === code && 'font-semibold text-primary'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile: hamburger */}
        <button
          ref={hamburgerRef}
          aria-label={t('openMenu')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="md:hidden p-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
        >
          <Menu size={ICON_SIZE_MD} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-50 flex flex-col bg-cream md:hidden"
        >
          <div className="flex items-center justify-between px-6 h-16 border-b border-border/40">
            <Image src="/logo-mark.svg" width={LOGO_SIZE} height={LOGO_SIZE} alt="NL logo" />
            <button
              aria-label={t('closeMenu')}
              onClick={closeMenu}
              className="p-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm"
            >
              <X size={ICON_SIZE_MD} aria-hidden="true" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 px-6 pt-8" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-2xl font-medium text-foreground py-3 border-b border-border/20 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {t(link.labelKey as Parameters<typeof t>[0])}
              </a>
            ))}
          </nav>

          {/* Language switcher in mobile overlay */}
          <div className="flex gap-4 px-6 pt-8">
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => { switchLocale(code); closeMenu() }}
                className={cn(
                  'text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-sm',
                  locale === code ? 'text-primary font-semibold' : 'text-foreground/60 hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
