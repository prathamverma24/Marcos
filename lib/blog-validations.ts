import { z } from 'zod'

export const blogStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Category name is required'),
  slug: z
    .string()
    .trim()
    .min(2, 'Category slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase SEO slug'),
})

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined)

const optionalHomepageOrder = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined
    }

    if (typeof value === 'string') {
      return Number(value)
    }

    return value
  },
  z.number().int().min(1, 'Use a value from 1 to 6').max(6, 'Use a value from 1 to 6').optional(),
)

function hasRichTextContent(value: unknown) {
  if (!value || typeof value !== 'object') {
    return false
  }

  const walk = (node: unknown): boolean => {
    if (!node || typeof node !== 'object') {
      return false
    }

    const current = node as { text?: unknown; type?: unknown; content?: unknown }

    if (typeof current.text === 'string' && current.text.trim().length > 0) {
      return true
    }

    if (current.type === 'image') {
      return true
    }

    if (Array.isArray(current.content)) {
      return current.content.some(walk)
    }

    return false
  }

  return walk(value)
}

export const blogMutationSchema = z.object({
  title: z.string().trim().min(3, 'Blog title is required'),
  slug: z
    .string()
    .trim()
    .min(2, 'Blog slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase SEO slug'),
  excerpt: z.string().trim().min(10, 'Excerpt is required'),
  content: z.unknown().refine(hasRichTextContent, 'Blog content is required'),
  featuredImage: optionalText,
  imageAlt: optionalText,
  categoryId: z.string().trim().min(1, 'Category is required'),
  authorName: z.string().trim().min(2, 'Author name is required').default('Marcos Water Solutions'),
  seoTitle: optionalText,
  metaDescription: optionalText,
  keywords: z.array(z.string().trim().min(1)).default([]),
  readTime: optionalText,
  status: blogStatusSchema.default('DRAFT'),
  publishedAt: optionalText,
  showOnHomepage: z.boolean().default(true),
  homepageOrder: optionalHomepageOrder,
})

export type BlogMutationInput = z.infer<typeof blogMutationSchema>
export type CategoryInput = z.infer<typeof categorySchema>
