import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { ReviewSubmissionData } from './review-validations'
import { prisma } from './prisma'

export type SiteReview = {
  id: string
  name: string
  location: string | null
  rating: number
  message: string
  createdAt: Date
  updatedAt: Date
}

type StoredReview = Omit<SiteReview, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

const reviewsFilePath = path.join(process.cwd(), 'data', 'reviews.json')
let useLocalReviewStorage = false

function parseStoredReview(review: StoredReview): SiteReview {
  return {
    ...review,
    createdAt: new Date(review.createdAt),
    updatedAt: new Date(review.updatedAt),
  }
}

function serializeReview(review: SiteReview): StoredReview {
  return {
    ...review,
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  }
}

async function readLocalReviews() {
  try {
    const content = await fs.readFile(reviewsFilePath, 'utf8')
    const reviews = JSON.parse(content) as StoredReview[]

    return reviews.map(parseStoredReview).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }

    throw error
  }
}

async function writeLocalReviews(reviews: SiteReview[]) {
  await fs.writeFile(reviewsFilePath, `${JSON.stringify(reviews.map(serializeReview), null, 2)}\n`, 'utf8')
}

export async function getPublicReviews(limit = 6) {
  if (prisma && !useLocalReviewStorage) {
    try {
      return await prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
    } catch (error) {
      console.error('Unable to load public reviews from Prisma; using local review storage', error)
      useLocalReviewStorage = true
    }
  }

  const reviews = await readLocalReviews()
  return reviews.slice(0, limit)
}

export async function getAdminReviews() {
  if (prisma && !useLocalReviewStorage) {
    try {
      return await prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
      })
    } catch (error) {
      console.error('Unable to load admin reviews from Prisma; using local review storage', error)
      useLocalReviewStorage = true
    }
  }

  return readLocalReviews()
}

export async function createReview(data: ReviewSubmissionData) {
  if (prisma && !useLocalReviewStorage) {
    try {
      return await prisma.review.create({
        data: {
          name: data.name,
          location: data.location || null,
          rating: data.rating,
          message: data.message,
        },
      })
    } catch (error) {
      console.error('Unable to create review in Prisma; using local review storage', error)
      useLocalReviewStorage = true
    }
  }

  const now = new Date()
  const review: SiteReview = {
    id: randomUUID(),
    name: data.name,
    location: data.location || null,
    rating: data.rating,
    message: data.message,
    createdAt: now,
    updatedAt: now,
  }
  const reviews = await readLocalReviews()
  await writeLocalReviews([review, ...reviews])

  return review
}

export async function deleteReviewById(id: string) {
  if (prisma && !useLocalReviewStorage) {
    try {
      const review = await prisma.review.findUnique({ where: { id } })

      if (!review) {
        return false
      }

      await prisma.review.delete({ where: { id } })
      return true
    } catch (error) {
      console.error('Unable to delete review in Prisma; using local review storage', error)
      useLocalReviewStorage = true
    }
  }

  const reviews = await readLocalReviews()
  const nextReviews = reviews.filter((review) => review.id !== id)

  if (nextReviews.length === reviews.length) {
    return false
  }

  await writeLocalReviews(nextReviews)
  return true
}
