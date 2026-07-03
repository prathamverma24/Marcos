'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-400 hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100"
    >
      <LogOut size={16} aria-hidden="true" />
      Logout
    </button>
  )
}
