import type { BookingFormData, ContactFormData } from './validations'

type EmailResult = {
  provider: 'web3forms' | 'resend' | 'not-configured'
  setupRequired: boolean
}

function buildMessage(data: ContactFormData) {
  return [
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Organization: ${data.organization || 'Not provided'}`,
    `Interest: ${data.interest}`,
    '',
    data.message,
  ].join('\n')
}

export async function sendContactEmail(data: ContactFormData): Promise<EmailResult> {
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY

  if (web3FormsKey) {
    const formData = new FormData()
    formData.append('access_key', web3FormsKey)
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('phone', data.phone)
    formData.append('subject', `Marcos Water Solutions inquiry: ${data.interest}`)
    formData.append('message', buildMessage(data))
    formData.append('from_name', 'Marcos Water Solutions Website')

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    })
    const payload = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null

    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message || 'Web3Forms could not send the message')
    }

    return { provider: 'web3forms', setupRequired: false }
  }

  const resendKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL_TO
  const from = process.env.CONTACT_EMAIL_FROM

  if (resendKey && to && from) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: data.email,
        subject: `Marcos Water Solutions inquiry: ${data.interest}`,
        text: buildMessage(data),
      }),
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(text || 'Resend could not send the message')
    }

    return { provider: 'resend', setupRequired: false }
  }

  return { provider: 'not-configured', setupRequired: true }
}

function buildBookingMessage(data: BookingFormData) {
  return [
    `Customer name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Company: ${data.company || 'Not provided'}`,
    `Selected product: ${data.productName} (${data.productId})`,
    `Requirement type: ${data.requirementType}`,
    `Preferred date/time: ${data.preferredDate} ${data.preferredTime}`,
    `Location: ${data.location}`,
    '',
    data.message,
  ].join('\n')
}

export async function sendBookingEmail(data: BookingFormData): Promise<EmailResult> {
  const resendKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL_TO
  const from = process.env.CONTACT_EMAIL_FROM

  if (resendKey && to && from) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: data.email,
        subject: `Booking request: ${data.productName}`,
        text: buildBookingMessage(data),
      }),
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(text || 'Resend could not send the booking request')
    }

    return { provider: 'resend', setupRequired: false }
  }

  return { provider: 'not-configured', setupRequired: true }
}
