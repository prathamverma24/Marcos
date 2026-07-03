import Link from 'next/link'
import { FilePlus2 } from 'lucide-react'
import AdminShell from '../../components/admin/AdminShell'
import SetupRequired from '../../components/admin/SetupRequired'
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
  } catch (error) {
    return (
      <AdminShell title="Dashboard" description="Connect the database to enable admin blog management.">
        <SetupRequired message={error instanceof Error ? error.message : undefined} />
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
