import { describe, it, expect } from 'vitest'
import { cn, getInitials } from './utils'

describe('cn()', () => {
  it('returns a single class unchanged', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('merges multiple classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('ignores falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, null, '')).toBe('foo')
  })

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })

  it('correctly merges Tailwind color variants', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('supports conditional object syntax from clsx', () => {
    expect(cn({ 'font-bold': true, italic: false })).toBe('font-bold')
  })
})

describe('getInitials()', () => {
  it('returns initials from two-word name', () => {
    expect(getInitials('Nina Li')).toBe('NL')
  })

  it('returns initials from three-word name', () => {
    expect(getInitials('Anna Maria Svensson')).toBe('AMS')
  })

  it('returns single initial for one-word name', () => {
    expect(getInitials('Madonna')).toBe('M')
  })
})
