import { defineRouting } from 'next-intl/routing'

export const locales = ['es', 'fr', 'en'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'es',
  localePrefix: 'always',
})
