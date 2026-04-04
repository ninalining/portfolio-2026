import type { ReactNode } from 'react'

export type LocaleParams = Promise<{ locale: string }>

export type LocaleLayoutProps = {
  children: ReactNode
  params: LocaleParams
}

export type LocalePageProps = {
  params: LocaleParams
}
