import type { PrismaClient } from '@prisma/client'
import { slugify } from './blog-content'

export const defaultBlogCategories = [
  'Industrial RO',
  'STP / ETP',
  'Water Softeners',
  'Water Treatment',
  'Wastewater Treatment',
  'Spare Parts',
  'Installation',
  'Maintenance',
  'Commercial Water Solutions',
  'Industrial Water Solutions',
]

export async function ensureDefaultCategories(db: PrismaClient) {
  const count = await db.category.count()

  if (count > 0) {
    return
  }

  await db.category.createMany({
    data: defaultBlogCategories.map((name) => ({
      name,
      slug: slugify(name),
    })),
    skipDuplicates: true,
  })
}
