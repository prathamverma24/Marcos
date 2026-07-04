import Link from 'next/link'
import { FilePlus2, Search } from 'lucide-react'
import AdminBlogActions from '../../../components/admin/AdminBlogActions'
import AdminShell from '../../../components/admin/AdminShell'
import SetupRequired from '../../../components/admin/SetupRequired'
import { getAdminBlogs, getAdminCategories } from '../../../lib/admin-blog-data'
import { requireAdmin } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

type AdminBlogsPageProps = {
  searchParams: {
    q?: string
    status?: string
    categoryId?: string
  }
}

export default async function AdminBlogsPage({ searchParams }: AdminBlogsPageProps) {
  await requireAdmin()

  try {
    const [blogs, categories] = await Promise.all([
      getAdminBlogs(searchParams),
      getAdminCategories(),
    ])

    return (
      <AdminShell
        title="Manage Blogs"
        description="Search, filter, preview, publish, unpublish, edit, and delete CMS blogs."
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
        <form className="grid gap-3 rounded-lg border border-cyan-900/10 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_220px_auto] md:items-end">
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Search by title</span>
            <span className="relative mt-2 block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} aria-hidden="true" />
              <input name="q" defaultValue={searchParams.q || ''} className="form-field pl-11" />
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Category</span>
            <select name="categoryId" defaultValue={searchParams.categoryId || 'ALL'} className="form-field mt-2">
              <option value="ALL">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Status</span>
            <select name="status" defaultValue={searchParams.status || 'ALL'} className="form-field mt-2">
              <option value="ALL">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Filter
          </button>
        </form>

        <section className="mt-6 overflow-hidden rounded-lg border border-cyan-900/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Home</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-slate-100 align-top">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">{blog.title}</p>
                      <p className="mt-1 text-xs text-slate-500">/{blog.slug}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{blog.category?.name || 'Uncategorized'}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={blog.status} />
                    </td>
                    <td className="px-4 py-4">
                      <HomeBadge showOnHomepage={blog.showOnHomepage} homepageOrder={blog.homepageOrder} />
                    </td>
                    <td className="px-4 py-4 text-slate-600">{blog.createdAt.toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-4 text-slate-600">
                      {blog.publishedAt ? blog.publishedAt.toLocaleDateString('en-IN') : 'Not published'}
                    </td>
                    <td className="px-4 py-4">
                      <AdminBlogActions blogId={blog.id} status={blog.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {blogs.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-lg font-semibold text-slate-950">No blogs found</p>
              <p className="mt-2 text-sm text-slate-600">Adjust filters or create a new blog draft.</p>
            </div>
          ) : null}
        </section>
      </AdminShell>
    )
  } catch (error) {
    return (
      <AdminShell title="Manage Blogs" description="Connect the database to enable admin blog management.">
        <SetupRequired message={error instanceof Error ? error.message : undefined} />
      </AdminShell>
    )
  }
}

function HomeBadge({ showOnHomepage, homepageOrder }: { showOnHomepage: boolean; homepageOrder: number | null }) {
  if (!showOnHomepage) {
    return <span className="inline-flex rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Hidden</span>
  }

  return (
    <span className="inline-flex rounded-md border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800">
      {homepageOrder ? `Shown #${homepageOrder}` : 'Shown'}
    </span>
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
