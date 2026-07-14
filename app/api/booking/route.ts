import { NextResponse } from 'next/server'
import { sendBookingEmail } from '../../../lib/email'
import { createBookingLead } from '../../../lib/lead-data'
import { bookingSchema } from '../../../lib/validations'

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = bookingSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Please check the booking form fields and try again',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  try {
    const lead = await createBookingLead(parsed.data)
    const result = await sendBookingEmail(parsed.data)
    return NextResponse.json({
      success: true,
      leadId: lead?.id,
      ...result,
      message: result.setupRequired
        ? 'Booking request validated. Configure RESEND_API_KEY, CONTACT_EMAIL_TO, and CONTACT_EMAIL_FROM to send emails.'
        : 'Booking request sent.',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to send booking request',
      },
      { status: 500 },
    )
  }
}
