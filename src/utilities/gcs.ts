import { Storage, type StorageOptions } from '@google-cloud/storage'

const credentials = process.env.GCS_CREDENTIALS

export const gcsBucket = process.env.GCS_BUCKET || ''

export const gcsOptions: StorageOptions = {
  projectId: process.env.GCS_PROJECT_ID,
  ...(credentials ? { credentials: JSON.parse(credentials) } : {}),
}

let storage: Storage | undefined

export const getGcsStorage = () => {
  storage ??= new Storage(gcsOptions)
  return storage
}
