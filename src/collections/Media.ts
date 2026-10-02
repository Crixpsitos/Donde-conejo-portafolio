import { getStorageFilePath } from '@payloadcms/plugin-cloud-storage/utilities'
import type { CollectionConfig } from 'payload'

import type { Media as MediaDocument } from '@/payload-types'
import { gcsBucket, getGcsStorage } from '@/utilities/gcs'

type MediaWithSizes = MediaDocument & {
  sizes?: Record<string, { filename?: null | string } | null>
}

type MediaAfterOperationHook = NonNullable<
  NonNullable<CollectionConfig['hooks']>['afterOperation']
>[number]

const cacheControlByPreset = {
  'long-term': 'public, max-age=31536000, immutable',
  'no-store': 'no-store',
  revalidate: 'public, max-age=0, must-revalidate',
  short: 'public, max-age=3600',
} as const

const syncCacheControlToGcs: MediaAfterOperationHook = async ({
  collection,
  operation,
  req,
  result,
}) => {
  if (!gcsBucket || (operation !== 'create' && operation !== 'updateByID')) {
    return result
  }

  const media = result as MediaWithSizes

  if (!media.filename || !media.cacheControl) {
    return result
  }

  const cacheControl = media.cacheControl
  const filenames = [
    media.filename,
    ...Object.values(media.sizes || {}).flatMap((size) => (size?.filename ? [size.filename] : [])),
  ]

  try {
    const bucket = getGcsStorage().bucket(gcsBucket)

    await Promise.all(
      filenames.map(async (filename) => {
        const filePath = await getStorageFilePath({
          collection,
          doc: {
            ...media,
            _objectKey: media._objectKey || undefined,
          },
          filename,
          req,
        })

        await bucket.file(filePath).setMetadata({ cacheControl })
      }),
    )
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: `No se pudo actualizar Cache-Control para el medio ${media.id}`,
    })
  }

  return result
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'cache',
      label: 'Caché',
      type: 'group',
      admin: {
        description: 'Controla cuánto tiempo los navegadores y CDN conservan este archivo.',
      },
      fields: [
        {
          name: 'preset',
          label: 'Política',
          type: 'select',
          defaultValue: 'long-term',
          options: [
            {
              label: 'Larga duración (1 año, inmutable)',
              value: 'long-term',
            },
            {
              label: 'Corta duración (1 hora)',
              value: 'short',
            },
            {
              label: 'Revalidar siempre',
              value: 'revalidate',
            },
            {
              label: 'No guardar en caché',
              value: 'no-store',
            },
            {
              label: 'Personalizada',
              value: 'custom',
            },
          ],
          required: true,
        },
        {
          name: 'customValue',
          label: 'Valor personalizado',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.preset === 'custom',
            description: 'Ejemplo: public, max-age=86400, stale-while-revalidate=3600',
          },
        },
      ],
    },
    {
      name: 'cacheControl',
      label: 'Cabecera Cache-Control',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        const preset = data.cache?.preset || 'long-term'
        const cacheControl =
          preset === 'custom'
            ? data.cache?.customValue?.trim() || cacheControlByPreset['no-store']
            : cacheControlByPreset[preset as keyof typeof cacheControlByPreset]

        return {
          ...data,
          cacheControl,
        }
      },
    ],
    afterOperation: [syncCacheControlToGcs],
  },
  upload: {
    mimeTypes: ['image/*', 'video/*'],
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', cacheControlByPreset['long-term'])
      return headers
    },
  },
}
