import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { createReview } from '../../../lib/review-data'
import { reviewSubmissionSchema } from '../../../lib/review-validations'

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = reviewSubmissionSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Please check the review fields and try again', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ success: true, provider: 'spam-filter' })
  }

  try {
    const review = await createReview(parsed.data)
    revalidatePath('/')

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to save review',
      },
      { status: 500 },
    )
  }
}
