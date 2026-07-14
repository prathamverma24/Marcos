import Link from 'next/link'
import { BookOpen, Database, FilePlus2, MessageSquareQuote } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import { getAdminDashboardData } from '../../lib/admin-blog-data'
import { requireAdmin } from '../../lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  await requireAdmin()

  try {
    const data = await getAdminDashboardData()

    return (
      <AdminShell
        title="Dashboard"
        description="Manage SEO blogs, drafts, categories, and publishing status."
        actions={
          <Link
            href="/admin/blogs/new"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <FilePlus2 size={16} aria-hidden="true" />
            Create New Blog
          </Link>
        }
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Blogs" value={data.totalBlogs} />
          <StatCard label="Published" value={data.publishedBlogs} />
          <StatCard label="Drafts" value={data.draftBlogs} />
          <StatCard label="Categories" value={data.categories} />
        </div>

        <section className="mt-8 rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">Recent Blogs</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Latest CMS updates</h2>
            </div>
            <Link href="/admin/blogs" className="text-sm font-semibold text-cyan-700 hover:text-cyan-900">
              Manage all blogs
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.recentBlogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-slate-100">
                    <td className="py-4 pr-4 font-semibold text-slate-950">{blog.title}</td>
                    <td className="py-4 pr-4 text-slate-600">{blog.category?.name || 'Uncategorized'}</td>
                    <td className="py-4 pr-4">
                      <StatusBadge status={blog.status} />
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{blog.updatedAt.toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.recentBlogs.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="font-semibold text-slate-950">No blogs yet</p>
                <p className="mt-2 text-sm text-slate-600">Create your first draft from the admin dashboard.</p>
              </div>
            ) : null}
          </div>
        </section>
      </AdminShell>
    )
  } catch {
    return (
      <AdminShell title="Dashboard" description="Manage site content, reviews, and publishing from one clean workspace.">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Blogs" value={0} />
          <StatCard label="Published" value={0} />
          <StatCard label="Drafts" value={0} />
          <StatCard label="Categories" value={0} />
        </div>

        <section className="mt-8 overflow-hidden rounded-lg border border-cyan-900/10 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.85fr]">
            <div className="p-6 md:p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-cyan-50 text-cyan-700">
                <Database size={24} aria-hidden="true" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">CMS Status</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Blog database is not connected</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                The public website is still available. Review management can continue in local storage, and blog publishing will become active after the database connection is restored.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/admin/reviews"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
                >
                  <MessageSquareQuote size={16} aria-hidden="true" />
                  Manage Reviews
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-cyan-300 hover:bg-cyan-50"
                >
                  <BookOpen size={16} aria-hidden="true" />
                  View Public Blog
                </Link>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-6 md:p-8 lg:border-l lg:border-t-0">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Available now</p>
              <div className="mt-5 grid gap-3">
                <StatusRow label="Public website" value="Online" tone="good" />
                <StatusRow label="Customer reviews" value="Local mode" tone="good" />
                <StatusRow label="Blog CMS" value="Database offline" tone="warn" />
              </div>
            </div>
          </div>
        </section>
      </AdminShell>
    )
  }
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === 'PUBLISHED'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : status === 'ARCHIVED'
        ? 'border-slate-200 bg-slate-100 text-slate-700'
        : 'border-amber-200 bg-amber-50 text-amber-800'

  return <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${classes}`}>{status}</span>
}

function StatusRow({ label, value, tone }: { label: string; value: string; tone: 'good' | 'warn' }) {
  const classes =
    tone === 'good'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-amber-200 bg-amber-50 text-amber-800'

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-4 py-3">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${classes}`}>{value}</span>
    </div>
  )
}
