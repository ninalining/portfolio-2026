'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Globe, Menu, X, User, Briefcase, Award, Mail, Clock, Linkedin, Github } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import type { NavLink } from '@/types/navigation'
import { cn } from '@/lib/utils'

const LOGO_SIZE = 32
const ICON_SIZE_NAV = 20
const ICON_SIZE_MOBILE = 24
const ICON_SIZE_SOCIAL = 18
const SCROLL_THRESHOLD = 50

const NAV_LINKS: NavLink[] = [
  { labelKey: 'about', href: '#about', Icon: User },
  { labelKey: 'experience', href: '#experience', Icon: Clock },
  { labelKey: 'skills', href: '#skills', Icon: Award },
  { labelKey: 'projects', href: '#projects', Icon: Briefcase },
  { labelKey: 'contact', href: '#contact', Icon: Mail },
]

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'sv', label: 'SV' },
] as const

const FOCUSABLE_SELECTORS = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Navigation({
  linkedin,
  github,
}: {
  linkedin: string
  github: string
}): React.ReactElement {
  const t = useTranslations('navigation')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const globeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    hamburgerRef.current?.focus()
  }, [])

  const switchLocale = useCallback(
    (targetLocale: string) => {
      setLangOpen(false)
      router.replace(pathname, { locale: targetLocale as 'en' | 'sv' })
    },
    [router, pathname],
  )

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // inert: set imperatively to avoid React 18 hydration warning (inert is a boolean HTML attr
  // serialised as empty string by SSR; React 19+ supports it natively as a prop)
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    if (menuOpen) {
      panel.removeAttribute('inert')
    } else {
      panel.setAttribute('inert', '')
    }
  }, [menuOpen])

  // Scroll lock + focus trap when mobile menu opens
  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'

    const panel = panelRef.current
    if (!panel) return

    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS))
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
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-border/40 shadow-sm py-3'
          : 'bg-cream border-b border-transparent py-5',
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          aria-label="Nina Li — back to top"
          className={cn(
            'flex items-center gap-2 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
            isScrolled ? 'scale-95' : 'scale-100',
          )}
        >
          <Image src="/logo.svg" width={LOGO_SIZE} height={LOGO_SIZE} alt="NL logo" />
          <span className="font-bold text-foreground text-lg hidden sm:block">Nina Li</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ labelKey, href, Icon }) => (
            <a
              key={href}
              href={href}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all text-foreground/80 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon
                size={ICON_SIZE_NAV}
                aria-hidden="true"
                className="group-hover:scale-110 transition-transform shrink-0"
              />
              <span className="font-medium">{t(labelKey as Parameters<typeof t>[0])}</span>
            </a>
          ))}

          {/* Language dropdown */}
          <div className="relative ml-2" ref={langDropdownRef}>
            <button
              ref={globeRef}
              aria-label={t('languageMenu')}
              aria-expanded={langOpen}
              aria-haspopup="menu"
              onClick={() => setLangOpen((o) => !o)}
              className="group flex items-center gap-1 px-3 py-2.5 rounded-2xl transition-all text-foreground/80 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Globe
                size={ICON_SIZE_NAV}
                aria-hidden="true"
                className="group-hover:scale-110 transition-transform"
              />
              <span className="uppercase font-medium">{locale}</span>
            </button>

            {langOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-24 bg-card rounded-(--radius) shadow-lg border border-border py-1"
              >
                {LOCALES.map(({ code, label }) => (
                  <button
                    key={code}
                    role="menuitem"
                    onClick={() => switchLocale(code)}
                    className={cn(
                      'w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors focus-visible:outline-none focus-visible:bg-muted',
                      locale === code && 'font-semibold text-primary',
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
          className={cn(
            'md:hidden w-10 h-10 rounded-2xl flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isScrolled ? 'bg-primary text-white' : 'bg-white text-foreground shadow-md',
          )}
        >
          <Menu size={ICON_SIZE_MOBILE} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile: backdrop + slide-in panel */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden transition-all duration-300',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Slide-in panel */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={cn(
            'absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300',
            menuOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-border/20 shrink-0">
            <Image src="/logo.svg" width={LOGO_SIZE} height={LOGO_SIZE} alt="NL logo" />
            <button
              aria-label={t('closeMenu')}
              onClick={closeMenu}
              className="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X size={ICON_SIZE_MOBILE} aria-hidden="true" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-2 px-4 pt-6" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ labelKey, href, Icon }) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className="group flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-primary hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="w-10 h-10 bg-cream group-hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors shrink-0">
                  <Icon size={ICON_SIZE_NAV} aria-hidden="true" />
                </span>
                <span className="text-lg font-medium">
                  {t(labelKey as Parameters<typeof t>[0])}
                </span>
              </a>
            ))}
          </nav>

          {/* Language switcher */}
          <div className="flex gap-4 px-6 pt-6">
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => {
                  switchLocale(code)
                  closeMenu()
                }}
                className={cn(
                  'text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
                  locale === code
                    ? 'text-primary font-semibold'
                    : 'text-foreground/60 hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Social links */}
          <div className="mt-auto px-6 pb-8 pt-8 border-t border-border/20">
            <p className="text-sm text-muted-foreground mb-4">{t('followLabel')}</p>
            <ul className="flex gap-3">
              <li>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  <Linkedin size={ICON_SIZE_SOCIAL} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-12 h-12 bg-yellow rounded-2xl flex items-center justify-center text-foreground hover:scale-110 transition-transform"
                >
                  <Github size={ICON_SIZE_SOCIAL} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
