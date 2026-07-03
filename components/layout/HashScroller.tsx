'use client'

import { useEffect } from 'react'

export default function HashScroller() {
  useEffect(() => {
    let retryTimer: number | undefined

    const scrollToHash = (attempt = 0) => {
      const id = window.location.hash.replace('#', '')
      if (!id) {
        return
      }

      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ block: 'start' })
      }

      if (attempt < 16) {
        retryTimer = window.setTimeout(() => scrollToHash(attempt + 1), 180)
      }
    }

    const onHashChange = () => scrollToHash()

    scrollToHash()
    window.addEventListener('hashchange', onHashChange)

    return () => {
      if (retryTimer) {
        window.clearTimeout(retryTimer)
      }
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  return null
}
