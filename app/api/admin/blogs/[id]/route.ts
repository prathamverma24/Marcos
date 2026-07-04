import { BlogStatus, type Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { estimateReadTime } from '../../../../../lib/blog-content'
import { blogMutationSchema } from '../../../../../lib/blog-validations'
import { apiError, requireAdminApi } from '../../../../../lib/cms-api'
import { requireDatabase } from '../../../../../lib/prisma'
import { revalidatePublicBlogPaths } from '../../../../../lib/public-blog-cache'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const db = requireDatabase()
    const blog = await db.blog.findUnique({
      where: { id: params.id },
      include: { category: true, author: true },
    })

    if (!blog) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, blog })
  } catch (error) {
    return apiError(error, 'Unable to load blog')
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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
    const current = await db.blog.findUnique({ where: { id: params.id } })

    if (!current) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    const existingSlug = await db.blog.findUnique({ where: { slug: parsed.data.slug } })

    if (existingSlug && existingSlug.id !== params.id) {
      return NextResponse.json({ success: false, error: 'A blog with this slug already exists' }, { status: 409 })
    }

    const publishedAt =
      parsed.data.status === BlogStatus.PUBLISHED
        ? parsed.data.publishedAt
          ? new Date(parsed.data.publishedAt)
          : current.publishedAt || new Date()
        : null

    const blog = await db.blog.update({
      where: { id: params.id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content as Prisma.InputJsonValue,
        featuredImage: parsed.data.featuredImage,
        imageAlt: parsed.data.imageAlt,
        categoryId: parsed.data.categoryId,
        authorName: parsed.data.authorName,
        seoTitle: parsed.data.seoTitle,
        metaDescription: parsed.data.metaDescription,
        keywords: parsed.data.keywords,
        readTime: parsed.data.readTime || estimateReadTime(parsed.data.content),
        status: parsed.data.status,
        publishedAt,
        showOnHomepage: parsed.data.showOnHomepage,
        homepageOrder: parsed.data.showOnHomepage ? parsed.data.homepageOrder : null,
      },
    })

    revalidatePublicBlogPaths(current.slug, blog.slug)

    return NextResponse.json({ success: true, blog })
  } catch (error) {
    return apiError(error, 'Unable to update blog')
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const db = requireDatabase()
    const blog = await db.blog.delete({ where: { id: params.id } })

    revalidatePublicBlogPaths(blog.slug)

    return NextResponse.json({ success: true })
  } catch (error) {
    return apiError(error, 'Unable to delete blog')
  }
}
