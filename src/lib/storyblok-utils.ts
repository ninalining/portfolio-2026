import type { ProjectAccent } from '@/types/project'
import type { SkillCategoryKey } from '@/types/skill'

export function getLanguage(locale: string): string {
  return locale === 'en' ? 'default' : locale
}

export function splitMultilineList(value: string | undefined): string[] {
  return value
    ? value
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    : []
}

export function splitCsvList(value: string | undefined): string[] {
  return value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : []
}

export function parseSortOrder(value: string | number | undefined): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 999
  }
  return 999
}

export function resolveAccent(
  accent: Array<{ color?: ProjectAccent }> | undefined,
  fallback?: ProjectAccent,
): ProjectAccent {
  return accent?.[0]?.color ?? fallback ?? 'mint'
}

export function isSkillCategoryKey(value: string | undefined): value is SkillCategoryKey {
  return value === 'frontend' || value === 'backend' || value === 'tools'
}
