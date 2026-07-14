'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminReviewActions({ reviewId }: { reviewId: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const deleteReview = async () => {
    if (!window.confirm('Delete this review? This cannot be undone.')) {
      return
    }

    setBusy(true)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      })
      const payload = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Unable to delete review')
      }

      setMessage('Deleted.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to delete review')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={deleteReview}
        disabled={busy}
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-red-200 bg-white px-3 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
      >
        <Trash2 size={15} aria-hidden="true" />
        Delete
      </button>
      {message ? <span className="text-xs font-semibold text-slate-500" role="status">{message}</span> : null}
    </div>
  )
}
