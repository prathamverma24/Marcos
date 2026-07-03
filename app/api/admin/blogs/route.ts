import { BlogStatus, type Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { estimateReadTime } from '../../../../lib/blog-content'
import { blogMutationSchema } from '../../../../lib/blog-validations'
import { apiError, getOrCreateAdminUser, requireAdminApi } from '../../../../lib/cms-api'
import { getAdminBlogs } from '../../../../lib/admin-blog-data'
import { requireDatabase } from '../../../../lib/prisma'

export async function GET(request: Request) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const { searchParams } = new URL(request.url)
    const blogs = await getAdminBlogs({
      q: searchParams.get('q') || undefined,
      status: searchParams.get('status') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
    })

    return NextResponse.json({ success: true, blogs })
  } catch (error) {
    return apiError(error, 'Unable to load blogs')
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const body = await request.json()
    const parsed = blogMutationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Please check the blog fields', issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const db = requireDatabase()
    const existing = await db.blog.findUnique({ where: { slug: parsed.data.slug } })

    if (existing) {
      return NextResponse.json({ success: false, error: 'A blog with this slug already exists' }, { status: 409 })
    }

    const author = auth.session ? await getOrCreateAdminUser(db, auth.session) : null
    const publishedAt =
      parsed.data.status === BlogStatus.PUBLISHED
        ? parsed.data.publishedAt
          ? new Date(parsed.data.publishedAt)
          : new Date()
        : null

    const blog = await db.blog.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content as Prisma.InputJsonValue,
        featuredImage: parsed.data.featuredImage,
        imageAlt: parsed.data.imageAlt,
        categoryId: parsed.data.categoryId,
        authorId: author?.id,
        authorName: parsed.data.authorName,
        seoTitle: parsed.data.seoTitle,
        metaDescription: parsed.data.metaDescription,
        keywords: parsed.data.keywords,
        readTime: parsed.data.readTime || estimateReadTime(parsed.data.content),
        status: parsed.data.status,
        publishedAt,
      },
    })

    return NextResponse.json({ success: true, blog }, { status: 201 })
  } catch (error) {
    return apiError(error, 'Unable to create blog')
  }
}
