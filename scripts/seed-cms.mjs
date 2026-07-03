import fs from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName)

  if (!fs.existsSync(filePath)) {
    return
  }

  fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .forEach((line) => {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
        return
      }

      const separator = trimmed.indexOf('=')
      const key = trimmed.slice(0, separator).trim()
      const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '').replace(/\\\$/g, '$')

      if (key && process.env[key] === undefined) {
        process.env[key] = value
      }
    })
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function richTextFromBlocks(blocks) {
  return {
    type: 'doc',
    content: blocks.flatMap((block) => [
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: block.heading }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: block.paragraph }],
      },
    ]),
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required to seed CMS data.')
  process.exit(1)
}

const categories = [
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

const starterBlogs = [
  {
    title: 'How Industrial RO Plants Help Businesses Get Clean Water',
    slug: 'industrial-ro-plants-clean-water-businesses',
    seoTitle: 'Industrial RO Plants for Businesses | Marcos Water Solutions',
    metaDescription:
      'Learn how industrial RO plants help businesses get clean, safe, and reliable water for commercial and industrial operations.',
    excerpt:
      'Learn how industrial RO systems remove impurities and support safe, reliable water usage for commercial and industrial needs.',
    category: 'Industrial RO',
    keywords: ['industrial RO plant', 'commercial RO system', 'water treatment solution', 'RO plant for business'],
    authorName: 'Marcos Water Solutions',
    publishedAt: new Date('2026-01-01T00:00:00.000Z'),
    readTime: '4 min read',
    featuredImage: '/images/blog-industrial-ro.jpg',
    imageAlt: 'Industrial RO plant system by Marcos Water Solutions',
    content: richTextFromBlocks([
      {
        heading: 'What is an Industrial RO Plant?',
        paragraph:
          'An industrial RO plant is a water treatment system designed to remove dissolved salts, impurities, and contaminants from water using reverse osmosis technology.',
      },
      {
        heading: 'Why Businesses Need RO Systems',
        paragraph:
          'Businesses need consistent water quality for production, cleaning, processing, and safe daily operations.',
      },
      {
        heading: 'Maintenance and Support',
        paragraph: 'Regular maintenance improves system life, water quality, and operational efficiency.',
      },
    ]),
  },
  {
    title: 'STP and ETP Systems Explained for Commercial Properties',
    slug: 'stp-etp-systems-commercial-properties',
    seoTitle: 'STP and ETP Systems for Commercial Properties',
    metaDescription:
      'Understand the difference between STP and ETP systems and how they help commercial and industrial properties manage wastewater.',
    excerpt:
      'Understand the difference between STP and ETP systems and how they help businesses manage wastewater responsibly.',
    category: 'STP / ETP',
    keywords: ['STP plant', 'ETP plant', 'wastewater treatment', 'commercial sewage treatment'],
    authorName: 'Marcos Water Solutions',
    publishedAt: new Date('2026-01-02T00:00:00.000Z'),
    readTime: '5 min read',
    featuredImage: '/images/blog-stp-etp.jpg',
    imageAlt: 'STP and ETP plant system by Marcos Water Solutions',
    content: richTextFromBlocks([
      {
        heading: 'What is STP?',
        paragraph: 'A sewage treatment plant treats domestic wastewater from buildings, industries, hotels, and commercial spaces.',
      },
      {
        heading: 'What is ETP?',
        paragraph: 'An effluent treatment plant treats industrial wastewater before safe disposal or reuse.',
      },
      {
        heading: 'Why Proper Wastewater Treatment Matters',
        paragraph:
          'Proper wastewater treatment helps protect the environment, reduce waste, and support cleaner operations.',
      },
    ]),
  },
  {
    title: 'Why Water Softeners Are Important for Homes and Businesses',
    slug: 'why-water-softeners-important',
    seoTitle: 'Why Water Softeners Are Important | Marcos Water Solutions',
    metaDescription:
      'Learn how water softeners reduce hard water problems and protect appliances, pipelines, and water systems.',
    excerpt: 'Hard water can damage appliances, pipelines, and water systems. Learn how water softeners solve this problem.',
    category: 'Water Softeners',
    keywords: ['water softener', 'hard water treatment', 'commercial water softener', 'home water softener'],
    authorName: 'Marcos Water Solutions',
    publishedAt: new Date('2026-01-03T00:00:00.000Z'),
    readTime: '3 min read',
    featuredImage: '/images/blog-water-softener.jpg',
    imageAlt: 'Water softener plant by Marcos Water Solutions',
    content: richTextFromBlocks([
      {
        heading: 'What is Hard Water?',
        paragraph:
          'Hard water contains high levels of minerals such as calcium and magnesium, which can cause scaling and reduce system efficiency.',
      },
      {
        heading: 'How Water Softeners Help',
        paragraph: 'Water softeners reduce hardness and protect pipelines, equipment, and appliances.',
      },
      {
        heading: 'Who Needs a Water Softener?',
        paragraph: 'Homes, hotels, factories, offices, and commercial buildings can benefit from water softening solutions.',
      },
    ]),
  },
]

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

for (const name of categories) {
  await prisma.category.upsert({
    where: { slug: slugify(name) },
    update: { name },
    create: { name, slug: slugify(name) },
  })
}

const adminEmail = process.env.ADMIN_EMAIL || 'admin@marcos.local'
const admin = await prisma.user.upsert({
  where: { email: adminEmail },
  update: {
    name: 'Marcos Admin',
    role: 'ADMIN',
    password: process.env.ADMIN_PASSWORD_HASH || null,
  },
  create: {
    email: adminEmail,
    name: 'Marcos Admin',
    role: 'ADMIN',
    password: process.env.ADMIN_PASSWORD_HASH || null,
  },
})

for (const blog of starterBlogs) {
  const category = await prisma.category.findUniqueOrThrow({ where: { slug: slugify(blog.category) } })
  const { category: _categoryName, ...blogData } = blog

  await prisma.blog.upsert({
    where: { slug: blog.slug },
    update: {
      ...blogData,
      categoryId: category.id,
      authorId: admin.id,
      status: 'PUBLISHED',
    },
    create: {
      ...blogData,
      categoryId: category.id,
      authorId: admin.id,
      status: 'PUBLISHED',
    },
  })
}

const [blogCount, categoryCount] = await Promise.all([prisma.blog.count(), prisma.category.count()])
console.log(`Seeded ${categoryCount} categories and ${blogCount} blogs.`)

await prisma.$disconnect()
await pool.end()
