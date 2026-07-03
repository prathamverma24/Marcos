import { NextResponse } from 'next/server'
import { slugify } from '../../../../lib/blog-content'
import { categorySchema } from '../../../../lib/blog-validations'
import { apiError, requireAdminApi } from '../../../../lib/cms-api'
import { ensureDefaultCategories } from '../../../../lib/default-categories'
import { requireDatabase } from '../../../../lib/prisma'

export async function GET() {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const db = requireDatabase()
    await ensureDefaultCategories(db)
    const categories = await db.category.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json({ success: true, categories })
  } catch (error) {
    return apiError(error, 'Unable to load categories')
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const body = await request.json()
    const parsed = categorySchema.safeParse({
      ...body,
      slug: body.slug || slugify(body.name || ''),
    })

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Please check the category fields', issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const db = requireDatabase()
    const category = await db.category.create({ data: parsed.data })
    return NextResponse.json({ success: true, category }, { status: 201 })
  } catch (error) {
    return apiError(error, 'Unable to create category')
  }
}
