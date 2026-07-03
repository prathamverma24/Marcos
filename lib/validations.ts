import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s()-]{6,20}$/, 'Please enter a valid phone number'),
  email: z.string().trim().email('Please enter a valid email'),
  interest: z.string().trim().min(1, 'Please choose a product or service'),
  message: z.string().trim().min(10, 'Please share a few more details'),
  organization: z.string().trim().optional(),
  honeypot: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

function isTodayOrFuture(value: string) {
  if (!value) {
    return false
  }

  const selected = new Date(`${value}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return selected >= today
}

export const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  phone: z.string().trim().min(10, 'Valid phone number is required'),
  email: z.string().trim().email('Valid email is required'),
  company: z.string().trim().optional(),
  productId: z.string().trim().min(1, 'Product is required'),
  productName: z.string().trim().min(1, 'Product is required'),
  preferredDate: z
    .string()
    .trim()
    .min(1, 'Preferred date is required')
    .refine(isTodayOrFuture, 'Preferred date cannot be in the past'),
  preferredTime: z.string().trim().min(1, 'Preferred time is required'),
  location: z.string().trim().min(2, 'Location is required'),
  requirementType: z.string().trim().min(1, 'Requirement type is required'),
  message: z.string().trim().min(10, 'Please describe your requirement'),
})

export type BookingFormData = z.infer<typeof bookingSchema>
