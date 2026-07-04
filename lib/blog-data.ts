import { BlogStatus, type Prisma } from '@prisma/client'
import { blogs as staticBlogs } from '../data/blogs'
import { legacyBlogToRichText, slugify } from './blog-content'
import { prisma } from './prisma'

export type PublicBlog = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: unknown
  featuredImage: string
  imageAlt: string
  category: {
    id?: string
    name: string
    slug: string
  }
  authorName: string
  seoTitle?: string | null
  metaDescription?: string | null
  keywords: string[]
  readTime: string
  publishedAt: string
  updatedAt: string
}

const publicInclude = {
  category: true,
  author: true,
} satisfies Prisma.BlogInclude

function publishedWhere() {
  return {
    status: BlogStatus.PUBLISHED,
    OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }],
  } satisfies Prisma.BlogWhereInput
}

function mapPrismaBlog(blog: Prisma.BlogGetPayload<{ include: typeof publicInclude }>): PublicBlog {
  const fallbackImage = '/images/blog-industrial-ro.jpg'
  const publishedAt = blog.publishedAt || blog.createdAt

  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    featuredImage: blog.featuredImage || fallbackImage,
    imageAlt: blog.imageAlt || `${blog.title} featured image`,
    category: {
      id: blog.category?.id,
      name: blog.category?.name || 'Water Treatment',
      slug: blog.category?.slug || 'water-treatment',
    },
    authorName: blog.author?.name || blog.authorName || 'Marcos Water Solutions',
    seoTitle: blog.seoTitle,
    metaDescription: blog.metaDescription,
    keywords: blog.keywords,
    readTime: blog.readTime || '3 min read',
    publishedAt: publishedAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  }
}

function mapStaticBlog(blog: (typeof staticBlogs)[number]): PublicBlog {
  return {
    id: String(blog.id),
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: legacyBlogToRichText(blog),
    featuredImage: blog.image,
    imageAlt: `${blog.title} featured image`,
    category: {
      name: blog.category,
      slug: slugify(blog.category),
    },
    authorName: blog.author,
    seoTitle: blog.metaTitle,
    metaDescription: blog.metaDescription,
    keywords: blog.keywords,
    readTime: blog.readTime,
    publishedAt: new Date(blog.date).toISOString(),
    updatedAt: new Date(blog.date).toISOString(),
  }
}

function staticPublishedBlogs() {
  return [...staticBlogs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(mapStaticBlog)
}

function byHomepagePreference(
  a: Prisma.BlogGetPayload<{ include: typeof publicInclude }>,
  b: Prisma.BlogGetPayload<{ include: typeof publicInclude }>,
) {
  const aOrder = a.homepageOrder ?? Number.POSITIVE_INFINITY
  const bOrder = b.homepageOrder ?? Number.POSITIVE_INFINITY

  if (aOrder !== bOrder) {
    return aOrder - bOrder
  }

  const aDate = (a.publishedAt || a.createdAt).getTime()
  const bDate = (b.publishedAt || b.createdAt).getTime()

  return bDate - aDate
}

export async function getPublishedBlogs() {
  if (!prisma) {
    return staticPublishedBlogs()
  }

  try {
    const blogs = await prisma.blog.findMany({
      where: publishedWhere(),
      include: publicInclude,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    })

    return blogs.map(mapPrismaBlog)
  } catch (error) {
    console.error('Falling back to static blogs because Prisma published blog lookup failed', error)
    return staticPublishedBlogs()
  }
}

export async function getHomepageBlogs(limit = 6) {
  if (!prisma) {
    return staticPublishedBlogs().slice(0, limit)
  }

  try {
    const blogs = await prisma.blog.findMany({
      where: {
        ...publishedWhere(),
        showOnHomepage: true,
      },
      include: publicInclude,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 24,
    })

    return blogs.sort(byHomepagePreference).slice(0, limit).map(mapPrismaBlog)
  } catch (error) {
    console.error('Falling back to static blogs because Prisma homepage blog lookup failed', error)
    return staticPublishedBlogs().slice(0, limit)
  }
}

export async function getPublishedBlogBySlug(slug: string) {
  if (!prisma) {
    return staticPublishedBlogs().find((blog) => blog.slug === slug) || null
  }

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        slug,
        ...publishedWhere(),
      },
      include: publicInclude,
    })

    return blog ? mapPrismaBlog(blog) : null
  } catch (error) {
    console.error('Falling back to static blog because Prisma blog lookup failed', error)
    return staticPublishedBlogs().find((blog) => blog.slug === slug) || null
  }
}

export async function getPublishedBlogSlugs() {
  const blogs = await getPublishedBlogs()
  return blogs.map((blog) => blog.slug)
}

export async function getPublishedBlogCategories() {
  const blogs = await getPublishedBlogs()
  const categories = new Map<string, PublicBlog['category']>()

  blogs.forEach((blog) => {
    categories.set(blog.category.slug, blog.category)
  })

  return [{ name: 'All', slug: 'all' }, ...Array.from(categories.values())]
}

export async function getRelatedPublishedBlogs(blog: PublicBlog, limit = 3) {
  const blogs = await getPublishedBlogs()

  return blogs.filter((item) => item.category.slug === blog.category.slug && item.slug !== blog.slug).slice(0, limit)
}
