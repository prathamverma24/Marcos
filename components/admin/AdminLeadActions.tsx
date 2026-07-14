'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const leadStatuses = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
  { value: 'ARCHIVED', label: 'Archived' },
]

type AdminLeadActionsProps = {
  leadId: string
  initialStatus: string
}

export default function AdminLeadActions({ leadId, initialStatus }: AdminLeadActionsProps) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const updateStatus = async (nextStatus: string) => {
    setStatus(nextStatus)
    setBusy(true)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      const payload = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Unable to update lead')
      }

      setMessage('Saved.')
      router.refresh()
    } catch (error) {
      setStatus(initialStatus)
      setMessage(error instanceof Error ? error.message : 'Unable to update lead')
    } finally {
      setBusy(false)
    }
  }

  const deleteLead = async () => {
    if (!window.confirm('Delete this lead? This cannot be undone.')) {
      return
    }

    setBusy(true)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'DELETE',
      })
      const payload = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Unable to delete lead')
      }

      setMessage('Deleted.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to delete lead')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor={`lead-status-${leadId}`}>
        Lead status
      </label>
      <select
        id={`lead-status-${leadId}`}
        value={status}
        onChange={(event) => updateStatus(event.target.value)}
        disabled={busy}
        className="h-9 rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:opacity-60"
      >
        {leadStatuses.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={deleteLead}
        disabled={busy}
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-red-200 bg-white px-3 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
      >
        <Trash2 size={15} aria-hidden="true" />
        Delete
      </button>
      {message ? (
        <span className="text-xs font-semibold text-slate-500" role="status">
          {message}
        </span>
      ) : null}
    </div>
  )
}
