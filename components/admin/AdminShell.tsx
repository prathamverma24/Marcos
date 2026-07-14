import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { BookOpen, FilePlus2, LayoutDashboard, MessageSquareQuote } from 'lucide-react'
import { siteData } from '../../data/site'
import LogoutButton from './LogoutButton'

type AdminShellProps = {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}

const adminNavigation = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquareQuote },
  { href: '/admin/blogs/new', label: 'New Blog', icon: FilePlus2 },
]

export default function AdminShell({ title, description, children, actions }: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#f5fbff] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-cyan-900/10 bg-slate-950 px-5 py-6 text-white">
          <Link
            href="/admin"
            className="group inline-flex w-full max-w-[210px] items-center justify-center rounded-xl bg-white px-4 py-3 shadow-[0_18px_45px_rgba(8,145,178,0.18)] ring-1 ring-cyan-200/20 transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(34,197,94,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            aria-label="Marcos Water Solutions admin dashboard"
          >
            <span className="relative block h-14 w-full overflow-hidden">
              <Image
                src={siteData.logoPath}
                alt="Marcos Water Solutions"
                fill
                sizes="210px"
                className="object-contain object-center transition duration-300 group-hover:scale-[1.02]"
                priority
              />
            </span>
          </Link>
          <nav className="mt-8 grid gap-2" aria-label="Admin navigation">
            {adminNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                <item.icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/blog"
            className="mt-8 inline-flex min-h-10 w-full items-center justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View Public Blog
          </Link>
        </aside>

        <section>
          <header className="sticky top-0 z-20 border-b border-cyan-900/10 bg-white/92 px-5 py-4 backdrop-blur lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Admin CMS</p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-950 md:text-3xl">{title}</h1>
                {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {actions}
                <LogoutButton />
              </div>
            </div>
          </header>
          <div className="px-5 py-8 lg:px-8">{children}</div>
        </section>
      </div>
    </main>
  )
}
