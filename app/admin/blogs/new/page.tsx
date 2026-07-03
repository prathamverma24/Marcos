import AdminShell from '../../../../components/admin/AdminShell'
import BlogForm from '../../../../components/admin/BlogForm'
import SetupRequired from '../../../../components/admin/SetupRequired'
import { getAdminCategories } from '../../../../lib/admin-blog-data'
import { requireAdmin } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export default async function NewBlogPage() {
  await requireAdmin()

  try {
    const categories = await getAdminCategories()

    return (
      <AdminShell title="Create Blog" description="Create a draft, upload a featured image, add SEO fields, and publish when ready.">
        <BlogForm categories={categories} />
      </AdminShell>
    )
  } catch (error) {
    return (
      <AdminShell title="Create Blog" description="Connect the database to create CMS blogs.">
        <SetupRequired message={error instanceof Error ? error.message : undefined} />
      </AdminShell>
    )
  }
}
