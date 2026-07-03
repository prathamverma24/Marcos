import type { PrismaClient } from '@prisma/client'
import type { Session } from 'next-auth'
import { NextResponse } from 'next/server'
import { getAdminSession } from './auth'

export async function requireAdminApi() {
  const session = await getAdminSession()

  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ success: false, error: 'Admin access required' }, { status: 401 }),
    }
  }

  return { session, response: null }
}

export async function getOrCreateAdminUser(db: PrismaClient, session: Session) {
  const email = session.user?.email || process.env.ADMIN_EMAIL

  if (!email) {
    return null
  }

  return db.user.upsert({
    where: { email },
    update: {
      name: session.user?.name || 'Marcos Admin',
      role: 'ADMIN',
    },
    create: {
      email,
      name: session.user?.name || 'Marcos Admin',
      role: 'ADMIN',
    },
  })
}

export function apiError(error: unknown, fallback = 'Something went wrong', status = 500) {
  return NextResponse.json(
    { success: false, error: error instanceof Error ? error.message : fallback },
    { status },
  )
}
