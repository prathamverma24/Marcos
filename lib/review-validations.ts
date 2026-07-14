import { z } from 'zod'

export const reviewSubmissionSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(80, 'Keep name under 80 characters'),
  location: z.string().trim().max(120, 'Keep project/location under 120 characters').optional(),
  rating: z.coerce.number().int().min(1, 'Choose a rating').max(5, 'Choose a rating from 1 to 5'),
  message: z.string().trim().min(10, 'Review must be at least 10 characters').max(500, 'Keep review under 500 characters'),
  honeypot: z.string().optional(),
})

export type ReviewSubmissionData = z.infer<typeof reviewSubmissionSchema>
