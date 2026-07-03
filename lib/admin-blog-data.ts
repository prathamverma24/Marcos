import { BlogStatus, type Prisma } from '@prisma/client'
import { ensureDefaultCategories } from './default-categories'
import { requireDatabase } from './prisma'

export type AdminBlogFilters = {
  q?: string
  status?: string
  categoryId?: string
}

const adminBlogInclude = {
  category: true,
  author: true,
} satisfies Prisma.BlogInclude

export async function getAdminDashboardData() {
  const db = requireDatabase()
  const [totalBlogs, publishedBlogs, draftBlogs, categories, recentBlogs] = await Promise.all([
    db.blog.count(),
    db.blog.count({ where: { status: BlogStatus.PUBLISHED } }),
    db.blog.count({ where: { status: BlogStatus.DRAFT } }),
    db.category.count(),
    db.blog.findMany({
      include: adminBlogInclude,
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
  ])

  return {
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    categories,
    recentBlogs,
  }
}

export async function getAdminBlogs(filters: AdminBlogFilters = {}) {
  const db = requireDatabase()
  const where: Prisma.BlogWhereInput = {}

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: 'insensitive' } },
      { slug: { contains: filters.q, mode: 'insensitive' } },
    ]
  }

  if (filters.status && filters.status !== 'ALL') {
    where.status = filters.status as BlogStatus
  }

  if (filters.categoryId && filters.categoryId !== 'ALL') {
    where.categoryId = filters.categoryId
  }

  return db.blog.findMany({
    where,
    include: adminBlogInclude,
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getAdminBlogById(id: string) {
  const db = requireDatabase()

  return db.blog.findUnique({
    where: { id },
    include: adminBlogInclude,
  })
}

export async function getAdminCategories() {
  const db = requireDatabase()
  await ensureDefaultCategories(db)

  return db.category.findMany({
    orderBy: { name: 'asc' },
  })
}
