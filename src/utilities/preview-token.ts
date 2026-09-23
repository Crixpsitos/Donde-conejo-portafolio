import { createHmac, timingSafeEqual } from 'node:crypto'

type PreviewTokenPayload = {
  expiresAt: number
  locale: string
  userId: string
}

const getSecret = () => process.env.PAYLOAD_SECRET || ''

const sign = (payload: string) =>
  createHmac('sha256', getSecret()).update(payload).digest('base64url')

export const createPreviewToken = (locale: string, userId: string) => {
  const payload: PreviewTokenPayload = {
    expiresAt: Date.now() + 60 * 60 * 1000,
    locale,
    userId,
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')

  return `${encodedPayload}.${sign(encodedPayload)}`
}

export const verifyPreviewToken = (token: string | undefined, locale: string) => {
  if (!token || !getSecret()) return false

  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return false

  const expectedSignature = sign(encodedPayload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return false
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString(),
    ) as PreviewTokenPayload
    return payload.locale === locale && Boolean(payload.userId) && payload.expiresAt > Date.now()
  } catch {
    return false
  }
}
