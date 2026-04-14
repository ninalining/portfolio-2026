import { describe, it, expect } from 'vitest'
import { locales, defaultLocale, ogLocaleMap, isSupportedLocale } from './routing'

describe('locales', () => {
  it('includes en and sv', () => {
    expect(locales).toContain('en')
    expect(locales).toContain('sv')
  })
})

describe('defaultLocale', () => {
  it('is en', () => {
    expect(defaultLocale).toBe('en')
  })

  it('is a member of locales', () => {
    expect(locales).toContain(defaultLocale)
  })
})

describe('ogLocaleMap', () => {
  it('maps en to en_US', () => {
    expect(ogLocaleMap.en).toBe('en_US')
  })

  it('maps sv to sv_SE', () => {
    expect(ogLocaleMap.sv).toBe('sv_SE')
  })

  it('has an entry for every locale', () => {
    for (const locale of locales) {
      expect(ogLocaleMap).toHaveProperty(locale)
    }
  })
})

describe('isSupportedLocale()', () => {
  it('returns true for supported locales', () => {
    expect(isSupportedLocale('en')).toBe(true)
    expect(isSupportedLocale('sv')).toBe(true)
  })

  it('returns false for unsupported locales', () => {
    expect(isSupportedLocale('fr')).toBe(false)
    expect(isSupportedLocale('')).toBe(false)
    expect(isSupportedLocale('EN')).toBe(false)
  })
})
