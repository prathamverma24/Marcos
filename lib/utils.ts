export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function mailHref(email: string) {
  return `mailto:${email}`
}

export function whatsappHref(number: string, message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${text}`
}
