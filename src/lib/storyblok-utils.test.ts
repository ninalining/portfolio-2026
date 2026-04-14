import { describe, it, expect } from 'vitest'
import {
  getLanguage,
  splitMultilineList,
  splitCsvList,
  parseSortOrder,
  resolveAccent,
  isSkillCategoryKey,
} from './storyblok-utils'

describe('getLanguage()', () => {
  it('maps "en" to "default"', () => {
    expect(getLanguage('en')).toBe('default')
  })

  it('passes through other locales unchanged', () => {
    expect(getLanguage('sv')).toBe('sv')
    expect(getLanguage('fr')).toBe('fr')
  })
})

describe('splitMultilineList()', () => {
  it('splits on newlines', () => {
    expect(splitMultilineList('a\nb\nc')).toEqual(['a', 'b', 'c'])
  })

  it('splits on Windows CRLF', () => {
    expect(splitMultilineList('a\r\nb\r\nc')).toEqual(['a', 'b', 'c'])
  })

  it('trims whitespace from each item', () => {
    expect(splitMultilineList('  a  \n  b  ')).toEqual(['a', 'b'])
  })

  it('filters out empty lines', () => {
    expect(splitMultilineList('a\n\nb\n')).toEqual(['a', 'b'])
  })

  it('returns empty array for undefined', () => {
    expect(splitMultilineList(undefined)).toEqual([])
  })

  it('returns empty array for empty string', () => {
    expect(splitMultilineList('')).toEqual([])
  })
})

describe('splitCsvList()', () => {
  it('splits on commas', () => {
    expect(splitCsvList('React, TypeScript, Next.js')).toEqual(['React', 'TypeScript', 'Next.js'])
  })

  it('trims whitespace around items', () => {
    expect(splitCsvList('  a  ,  b  ')).toEqual(['a', 'b'])
  })

  it('filters out empty entries', () => {
    expect(splitCsvList('a,,b,')).toEqual(['a', 'b'])
  })

  it('returns empty array for undefined', () => {
    expect(splitCsvList(undefined)).toEqual([])
  })

  it('returns empty array for empty string', () => {
    expect(splitCsvList('')).toEqual([])
  })
})

describe('parseSortOrder()', () => {
  it('returns number as-is', () => {
    expect(parseSortOrder(3)).toBe(3)
    expect(parseSortOrder(0)).toBe(0)
  })

  it('parses a numeric string', () => {
    expect(parseSortOrder('2')).toBe(2)
    expect(parseSortOrder('10')).toBe(10)
  })

  it('returns 999 for non-numeric string', () => {
    expect(parseSortOrder('abc')).toBe(999)
  })

  it('returns 999 for undefined', () => {
    expect(parseSortOrder(undefined)).toBe(999)
  })

  it('returns 999 for NaN string', () => {
    expect(parseSortOrder('NaN')).toBe(999)
  })
})

describe('resolveAccent()', () => {
  it('returns first color in array', () => {
    expect(resolveAccent([{ color: 'yellow' }])).toBe('yellow')
  })

  it('returns fallback when array is empty', () => {
    expect(resolveAccent([], 'lavender')).toBe('lavender')
  })

  it('returns "mint" as default when array is empty and no fallback', () => {
    expect(resolveAccent([])).toBe('mint')
  })

  it('returns "mint" for undefined', () => {
    expect(resolveAccent(undefined)).toBe('mint')
  })

  it('uses fallback when first entry has no color', () => {
    expect(resolveAccent([{}], 'yellow')).toBe('yellow')
  })
})

describe('isSkillCategoryKey()', () => {
  it('returns true for valid keys', () => {
    expect(isSkillCategoryKey('frontend')).toBe(true)
    expect(isSkillCategoryKey('backend')).toBe(true)
    expect(isSkillCategoryKey('tools')).toBe(true)
  })

  it('returns false for invalid strings', () => {
    expect(isSkillCategoryKey('other')).toBe(false)
    expect(isSkillCategoryKey('')).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isSkillCategoryKey(undefined)).toBe(false)
  })
})
