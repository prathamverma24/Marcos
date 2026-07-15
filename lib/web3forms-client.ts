import type { BookingFormData, ContactFormData } from './validations'

const web3FormsAccessKey = '2012ee35-e89d-4a73-a594-db3628ab7dde'
const web3FormsEndpoint = 'https://api.web3forms.com/submit'

function submitWeb3Forms(formData: FormData) {
  formData.append('access_key', web3FormsAccessKey)
  formData.append('from_name', 'Marcos Water Solutions Website')

  return new Promise<void>((resolve) => {
    const targetId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const targetName = `web3forms-${targetId}`
    const iframe = document.createElement('iframe')
    iframe.name = targetName
    iframe.hidden = true
    iframe.title = 'Web3Forms submission'

    const form = document.createElement('form')
    form.action = web3FormsEndpoint
    form.method = 'POST'
    form.target = targetName
    form.hidden = true

    formData.forEach((value, key) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = typeof value === 'string' ? value : value.name
      form.appendChild(input)
    })

    document.body.appendChild(iframe)
    document.body.appendChild(form)
    form.submit()

    window.setTimeout(() => {
      resolve()
    }, 1200)

    window.setTimeout(() => {
      form.remove()
      iframe.remove()
    }, 10000)
  })
}

export async function submitContactToWeb3Forms(data: ContactFormData) {
  if (data.honeypot) {
    return
  }

  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('email', data.email)
  formData.append('phone', data.phone)
  formData.append('organization', data.organization || 'Not provided')
  formData.append('interest', data.interest)
  formData.append('subject', `Marcos Water Solutions inquiry: ${data.interest}`)
  formData.append(
    'message',
    [
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Organization: ${data.organization || 'Not provided'}`,
      `Interest: ${data.interest}`,
      '',
      data.message,
    ].join('\n'),
  )

  await submitWeb3Forms(formData)
}

export async function submitBookingToWeb3Forms(data: BookingFormData) {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('email', data.email)
  formData.append('phone', data.phone)
  formData.append('company', data.company || 'Not provided')
  formData.append('product_id', data.productId)
  formData.append('product_name', data.productName)
  formData.append('requirement_type', data.requirementType)
  formData.append('preferred_date', data.preferredDate)
  formData.append('preferred_time', data.preferredTime)
  formData.append('location', data.location)
  formData.append('subject', `Booking request: ${data.productName}`)
  formData.append(
    'message',
    [
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
    ].join('\n'),
  )

  await submitWeb3Forms(formData)
}
