'use client'

import { Eye, Pencil, Send, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useState } from 'react'

export default function AdminBlogActions({
  blogId,
  status,
}: {
  blogId: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const isPublished = status === 'PUBLISHED'

  const updateStatus = async () => {
    setBusy(true)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/blogs/${blogId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: isPublished ? 'DRAFT' : 'PUBLISHED' }),
      })
      const payload = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Unable to update status')
      }

      setMessage(isPublished ? 'Unpublished.' : 'Published.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update status')
    } finally {
      setBusy(false)
    }
  }

  const deleteBlog = async () => {
    if (!window.confirm('Delete this blog? This cannot be undone.')) {
      return
    }

    setBusy(true)
    setMessage('')

    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'DELETE',
      })
      const payload = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Unable to delete blog')
      }

      setMessage('Deleted.')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to delete blog')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ActionLink href={`/admin/blogs/${blogId}/preview`} label="Preview">
        <Eye size={15} aria-hidden="true" />
      </ActionLink>
      <ActionLink href={`/admin/blogs/${blogId}/edit`} label="Edit">
        <Pencil size={15} aria-hidden="true" />
      </ActionLink>
      <button
        type="button"
        onClick={updateStatus}
        disabled={busy}
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 transition hover:border-cyan-400 hover:text-cyan-800 disabled:opacity-60"
      >
        <Send size={15} aria-hidden="true" />
        {isPublished ? 'Unpublish' : 'Publish'}
      </button>
      <button
        type="button"
        onClick={deleteBlog}
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

function ActionLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 transition hover:border-cyan-400 hover:text-cyan-800"
    >
      {children}
      {label}
    </Link>
  )
}
