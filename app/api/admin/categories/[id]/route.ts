import { NextResponse } from 'next/server'
import { categorySchema } from '../../../../../lib/blog-validations'
import { apiError, requireAdminApi } from '../../../../../lib/cms-api'
import { requireDatabase } from '../../../../../lib/prisma'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const body = await request.json()
    const parsed = categorySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Please check the category fields', issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const db = requireDatabase()
    const category = await db.category.update({
      where: { id: params.id },
      data: parsed.data,
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    return apiError(error, 'Unable to update category')
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const db = requireDatabase()
    await db.category.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return apiError(error, 'Unable to delete category')
  }
}
