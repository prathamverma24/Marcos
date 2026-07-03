import { notFound } from 'next/navigation'
import AdminShell from '../../../../../components/admin/AdminShell'
import BlogForm from '../../../../../components/admin/BlogForm'
import SetupRequired from '../../../../../components/admin/SetupRequired'
import { getAdminBlogById, getAdminCategories } from '../../../../../lib/admin-blog-data'
import { requireAdmin } from '../../../../../lib/auth'

export const dynamic = 'force-dynamic'

type EditBlogPageProps = {
  params: {
    id: string
  }
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  await requireAdmin()

  try {
    const [blog, categories] = await Promise.all([
      getAdminBlogById(params.id),
      getAdminCategories(),
    ])

    if (!blog) {
      notFound()
    }

    return (
      <AdminShell title="Edit Blog" description="Update content, SEO fields, image, status, and publish settings.">
        <BlogForm
          categories={categories}
          initialValue={{
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            featuredImage: blog.featuredImage,
            imageAlt: blog.imageAlt,
            categoryId: blog.categoryId,
            authorName: blog.authorName,
            seoTitle: blog.seoTitle,
            metaDescription: blog.metaDescription,
            keywords: blog.keywords,
            readTime: blog.readTime,
            status: blog.status,
            publishedAt: blog.publishedAt?.toISOString() || null,
          }}
        />
      </AdminShell>
    )
  } catch (error) {
    return (
      <AdminShell title="Edit Blog" description="Connect the database to edit CMS blogs.">
        <SetupRequired message={error instanceof Error ? error.message : undefined} />
      </AdminShell>
    )
  }
}
