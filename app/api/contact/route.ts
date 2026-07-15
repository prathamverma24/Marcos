import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { sendContactEmail } from '../../../lib/email'
import { createContactLead } from '../../../lib/lead-data'
import { isDatabaseConfigured } from '../../../lib/prisma'
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
    const shouldCaptureLead = isDatabaseConfigured()
    const lead = await createContactLead(parsed.data)
    let emailResult: Awaited<ReturnType<typeof sendContactEmail>> | null = null

    if (shouldCaptureLead && !lead) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to save your inquiry to the admin lead dashboard. Please try again.',
        },
        { status: 500 },
      )
    }

    if (lead) {
      revalidatePath('/admin')
      revalidatePath('/admin/leads')
    }

    try {
      emailResult = await sendContactEmail(parsed.data)
    } catch (error) {
      console.error('Unable to send contact email notification', error)

      if (!lead) {
        throw error
      }
    }

    if (!lead && emailResult?.setupRequired) {
      return NextResponse.json(
        {
          success: false,
          setupRequired: true,
          error: 'Contact capture is not connected yet. Please email or WhatsApp Marcos Water Solutions directly.',
        },
        { status: 503 },
      )
    }

    return NextResponse.json({
      success: true,
      leadId: lead?.id,
      leadCaptured: Boolean(lead),
      notificationProvider: emailResult?.provider || 'failed',
      notificationDelivered: Boolean(emailResult && !emailResult.setupRequired),
      message: lead
        ? 'Thank you. Your inquiry has been received, and Marcos Water Solutions will contact you soon.'
        : 'Message sent successfully. Marcos Water Solutions will contact you soon.',
    })
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
