import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { getDatabaseUrl } from './database-url'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  prismaPool?: Pool
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl())
}

function createPrismaClient() {
  const connectionString = getDatabaseUrl()

  if (!connectionString) {
    return null
  }

  const pool = globalForPrisma.prismaPool ?? new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const client = new PrismaClient({ adapter })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaPool = pool
    globalForPrisma.prisma = client
  }

  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

export function requireDatabase() {
  if (!prisma) {
    throw new Error('DATABASE_URL is not configured. Add a PostgreSQL connection string to enable the Blog CMS.')
  }

  return prisma
}
