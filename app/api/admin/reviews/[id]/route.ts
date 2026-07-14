import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { apiError, requireAdminApi } from '../../../../../lib/cms-api'
import { deleteReviewById } from '../../../../../lib/review-data'

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const deleted = await deleteReviewById(params.id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })
    }
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    return apiError(error, 'Unable to delete review')
  }
}
