'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type HighlightMessage = {
  fieldPath?: unknown
  type?: unknown
}

export function LivePreviewBridge() {
  const router = useRouter()
  const [serverURL, setServerURL] = useState<string>()

  useEffect(() => {
    setServerURL(window.location.origin)

    const handleMessage = (event: MessageEvent<HighlightMessage>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      if (
        event.data?.type !== 'donde-conejo:highlight-field' ||
        typeof event.data.fieldPath !== 'string'
      )
        return

      const activeField = document.querySelector<HTMLElement>(
        `[data-preview-field="${CSS.escape(event.data.fieldPath)}"]`,
      )
      if (activeField?.dataset.previewActive === 'true') return

      document.querySelectorAll<HTMLElement>('[data-preview-active="true"]').forEach((field) => {
        field.removeAttribute('data-preview-active')
      })
      if (!activeField) return

      activeField.dataset.previewActive = 'true'
      activeField.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return serverURL ? (
    <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
  ) : null
}
