import { BlogStatus } from '@prisma/client'
import { NextResponse } from 'next/server'
import { blogStatusSchema } from '../../../../../../lib/blog-validations'
import { apiError, requireAdminApi } from '../../../../../../lib/cms-api'
import { requireDatabase } from '../../../../../../lib/prisma'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const body = await request.json().catch(() => ({}))
    const status = blogStatusSchema.parse(body.status || 'PUBLISHED')
    const db = requireDatabase()

    const blog = await db.blog.update({
      where: { id: params.id },
      data: {
        status,
        publishedAt: status === BlogStatus.PUBLISHED ? new Date() : null,
      },
    })

    return NextResponse.json({ success: true, blog })
  } catch (error) {
    return apiError(error, 'Unable to update publish status')
  }
}
