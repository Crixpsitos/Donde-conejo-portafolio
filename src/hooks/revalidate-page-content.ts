import { revalidatePath, revalidateTag } from 'next/cache'
import { after } from 'next/server'
import type { GlobalAfterChangeHook } from 'payload'

import { routing } from '@/i18n/routing'
import { PAGE_CONTENT_CACHE_TAG } from '@/utilities/cache-tags'

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const warmupTimeoutMS = 15_000

const warmLocalePage = async (locale: (typeof routing.locales)[number]) => {
  const url = new URL(`/${locale}`, serverURL)
  url.searchParams.set('_warm', Date.now().toString())

  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(warmupTimeoutMS),
  })

  await response.arrayBuffer()

  if (!response.ok) {
    throw new Error(`GET ${url.pathname} respondió ${response.status}`)
  }
}

export const revalidatePageContent: GlobalAfterChangeHook = ({ doc, req }) => {
  if (req.context?.disableRevalidate) return doc
  if ('_status' in doc && doc._status !== 'published') return doc

  req.payload.logger.info('Invalidando la caché del contenido público')
  revalidateTag(PAGE_CONTENT_CACHE_TAG, { expire: 0 })
  routing.locales.forEach((locale) => revalidatePath(`/${locale}`))

  after(async () => {
    const results = await Promise.allSettled(
      routing.locales.map(async (locale) => {
        await warmLocalePage(locale)
        req.payload.logger.info(`Caché regenerada para /${locale}`)
      }),
    )

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const locale = routing.locales[index]
        const reason =
          result.reason instanceof Error ? result.reason.message : String(result.reason)
        req.payload.logger.error(`No se pudo regenerar /${locale}: ${reason}`)
      }
    })
  })

  return doc
}
