'use client'

import { Send, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

type ReviewApiResponse = {
  success?: boolean
  error?: string
}

export default function ReviewForm() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setBusy(true)
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const payload = (await response.json()) as ReviewApiResponse

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Unable to submit review')
      }

      form.reset()
      setStatus('success')
      setMessage('Thank you. Your review has been added.')
      router.refresh()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to submit review')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-cyan-50 text-cyan-700">
          <Star size={20} aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-xl font-semibold text-slate-950">Give a review</h3>
          <p className="mt-1 text-sm text-slate-600">Share your experience with Marcos Water Solutions.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Name</span>
          <input name="name" type="text" required minLength={2} maxLength={80} className="form-field mt-2" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Rating</span>
          <select name="rating" defaultValue="5" className="form-field mt-2">
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-slate-800">Project or location</span>
        <input name="location" type="text" maxLength={120} className="form-field mt-2" />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-slate-800">Review</span>
        <textarea name="message" required minLength={10} maxLength={500} rows={5} className="form-field mt-2 resize-y" />
      </label>

      <input name="honeypot" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <button
        type="submit"
        disabled={busy}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 disabled:opacity-60"
      >
        <Send size={17} aria-hidden="true" />
        {busy ? 'Submitting...' : 'Submit Review'}
      </button>

      {message ? (
        <p
          role="status"
          className={`mt-4 rounded-lg border px-4 py-3 text-sm leading-6 ${
            status === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  )
}
