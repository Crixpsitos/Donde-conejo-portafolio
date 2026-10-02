import { compatibilityOptions, mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { gcsStorage } from '@payloadcms/storage-gcs'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Locations } from './collections/Locations'
import { Homepage } from './globals/Homepage'
import { SiteSettings } from './globals/SiteSettings'
import { gcsBucket, gcsOptions } from './utilities/gcs'
import { createPreviewToken } from './utilities/preview-token'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseURL = process.env.DATABASE_URL || ''
const usesFirestoreMongoDB = databaseURL.includes('.firestore.goog:')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: ({ locale, req }) => {
        if (!req.user) return null

        const localeCode = locale?.code || 'es'
        const token = createPreviewToken(localeCode, String(req.user.id))
        return `/${localeCode}?preview=${encodeURIComponent(token)}`
      },
      globals: [Homepage.slug],
      openByDefault: true,
      breakpoints: [
        { label: 'Móvil', name: 'mobile', width: 390, height: 844 },
        { label: 'Tableta', name: 'tablet', width: 768, height: 1024 },
        { label: 'Escritorio', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Media, Locations],
  globals: [SiteSettings, Homepage],
  localization: {
    locales: [
      { code: 'es', label: 'Español' },
      { code: 'fr', label: 'Français', fallbackLocale: 'es' },
      { code: 'en', label: 'English', fallbackLocale: 'es' },
    ],
    defaultLocale: 'es',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: databaseURL,
    ...(usesFirestoreMongoDB ? compatibilityOptions.firestore : {}),
    connectOptions: usesFirestoreMongoDB
      ? {
          connectTimeoutMS: 10_000,
          maxConnecting: 2,
          maxIdleTimeMS: 10_000,
          maxPoolSize: 5,
          minPoolSize: 0,
          retryReads: true,
          serverSelectionTimeoutMS: 15_000,
        }
      : undefined,
  }),
  sharp,
  plugins: [
    gcsStorage({
      alwaysInsertFields: true,
      bucket: gcsBucket,
      collections: {
        media: true,
      },
      enabled: Boolean(gcsBucket),
      options: gcsOptions,
    }),
  ],
})
