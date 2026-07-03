import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import AdminLoginForm from '../../../components/admin/AdminLoginForm'
import { siteData } from '../../../data/site'
import { getAdminSession } from '../../../lib/auth'

export default async function AdminLoginPage() {
  const session = await getAdminSession()

  if (session) {
    redirect('/admin')
  }

  return (
    <main className="grid min-h-screen bg-[#f5fbff] px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <section className="mx-auto flex w-full max-w-6xl items-center">
        <div className="max-w-xl">
          <span className="relative block h-16 w-24 overflow-hidden rounded-lg bg-white shadow-sm">
            <Image src="/images/logo-Bo6gkKPH.jpeg" alt="Marcos Water Solution logo" fill sizes="96px" className="object-contain" priority />
          </span>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Secure Blog CMS</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">{siteData.companyName}</h2>
          <p className="mt-5 text-base leading-8 text-slate-700">
            Admin-only access for creating, editing, publishing, and managing SEO blog content. Public visitors can only read published blogs.
          </p>
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-md items-center">
        <Suspense fallback={<div className="h-96 w-full rounded-lg border border-cyan-900/10 bg-white shadow-sm" />}>
          <AdminLoginForm />
        </Suspense>
      </section>
    </main>
  )
}
