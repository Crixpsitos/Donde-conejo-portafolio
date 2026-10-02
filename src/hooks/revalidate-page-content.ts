import { revalidatePath, revalidateTag } from 'next/cache'
import type { GlobalAfterChangeHook } from 'payload'

import { routing } from '@/i18n/routing'
import { PAGE_CONTENT_CACHE_TAG } from '@/utilities/cache-tags'

export const revalidatePageContent: GlobalAfterChangeHook = ({ doc, req }) => {
  if (req.context?.disableRevalidate) return doc
  if ('_status' in doc && doc._status !== 'published') return doc

  req.payload.logger.info('Invalidando la caché del contenido público')
  revalidateTag(PAGE_CONTENT_CACHE_TAG, { expire: 0 })
  routing.locales.forEach((locale) => revalidatePath(`/${locale}`))

  return doc
}