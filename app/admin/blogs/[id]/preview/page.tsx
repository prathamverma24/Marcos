import { notFound } from 'next/navigation'
import AdminShell from '../../../../../components/admin/AdminShell'
import SetupRequired from '../../../../../components/admin/SetupRequired'
import RichTextRenderer from '../../../../../components/ui/RichTextRenderer'
import SiteImage from '../../../../../components/ui/SiteImage'
import { getAdminBlogById } from '../../../../../lib/admin-blog-data'
import { requireAdmin } from '../../../../../lib/auth'

export const dynamic = 'force-dynamic'

type PreviewBlogPageProps = {
  params: {
    id: string
  }
}

export default async function PreviewBlogPage({ params }: PreviewBlogPageProps) {
  await requireAdmin()

  try {
    const blog = await getAdminBlogById(params.id)

    if (!blog) {
      notFound()
    }

    return (
      <AdminShell title="Preview Blog" description="Admin-only preview. Draft and unpublished content is never exposed publicly.">
        <article className="overflow-hidden rounded-lg border border-cyan-900/10 bg-white shadow-sm">
          <header className="section-band px-5 py-12 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <p className="inline-flex rounded-md bg-cyan-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
                {blog.category?.name || 'Water Treatment'} · {blog.status}
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">{blog.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">{blog.excerpt}</p>
            </div>
          </header>
          {blog.featuredImage ? (
            <div className="bg-white px-5 py-10 lg:px-8">
              <div className="mx-auto max-w-5xl">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100 shadow-[0_20px_70px_rgba(8,145,178,0.12)]">
                  <SiteImage
                    src={blog.featuredImage}
                    alt={blog.imageAlt || `${blog.title} featured image`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ) : null}
          <div className="bg-white px-5 pb-12 lg:px-8">
            <RichTextRenderer content={blog.content} />
          </div>
        </article>
      </AdminShell>
    )
  } catch (error) {
    return (
      <AdminShell title="Preview Blog" description="Connect the database to preview CMS blogs.">
        <SetupRequired message={error instanceof Error ? error.message : undefined} />
      </AdminShell>
    )
  }
}
