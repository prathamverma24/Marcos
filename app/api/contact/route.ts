import { NextResponse } from 'next/server'
import { sendContactEmail } from '../../../lib/email'
import { contactSchema } from '../../../lib/validations'

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Please check the form fields and try again' },
      { status: 400 },
    )
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ success: true, provider: 'spam-filter' })
  }

  try {
    const result = await sendContactEmail(parsed.data)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to send message',
      },
      { status: 500 },
    )
  }
}
