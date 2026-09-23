'use client'

import { useEffect } from 'react'

const getFieldPath = (element: HTMLElement) => {
  const fieldContainer = element.closest<HTMLElement>('[id^="field-"], [class*="field-type"]')
  const candidates = [
    element.getAttribute('name'),
    element.id,
    fieldContainer?.getAttribute('data-path'),
    fieldContainer?.id,
  ]

  for (const candidate of candidates) {
    const normalized = candidate?.replace(/^field-/, '').replaceAll('__', '.')
    if (normalized && !['updatedAt', 'createdAt', '_status'].includes(normalized)) return normalized
  }

  return null
}

const getPreviewFrame = () =>
  Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe')).find((frame) => {
    try {
      return new URL(frame.src).searchParams.has('preview')
    } catch {
      return false
    }
  })

export function PreviewFocusBridge() {
  useEffect(() => {
    let activeFieldPath: null | string = null

    const sendFieldPath = (fieldPath: string) => {
      const frame = fieldPath ? getPreviewFrame() : undefined
      if (!frame?.contentWindow) return

      const frameURL = new URL(frame.src)
      frame.contentWindow.postMessage(
        { type: 'donde-conejo:highlight-field', fieldPath },
        frameURL.origin,
      )
    }

    const handleFocus = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return

      activeFieldPath = getFieldPath(event.target)
      if (activeFieldPath) sendFieldPath(activeFieldPath)
    }

    document.addEventListener('focusin', handleFocus, true)
    const resendInterval = window.setInterval(() => {
      if (activeFieldPath) sendFieldPath(activeFieldPath)
    }, 750)

    return () => {
      document.removeEventListener('focusin', handleFocus, true)
      window.clearInterval(resendInterval)
    }
  }, [])

  return null
}
