import { compare } from 'bcryptjs'
import type { NextAuthOptions, Session } from 'next-auth'
import { getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'

export const authSecret = process.env.NEXTAUTH_SECRET || 'local-placeholder-secret-login-disabled'

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
        const email = credentials?.email?.trim().toLowerCase()
        const password = credentials?.password || ''

        if (!process.env.NEXTAUTH_SECRET || !email || !password) {
          return null
        }

        if (adminEmail && adminPasswordHash && email === adminEmail && (await compare(password, adminPasswordHash))) {
          return {
            id: adminEmail,
            email: adminEmail,
            name: 'Marcos Admin',
            role: 'ADMIN',
          }
        }

        if (prisma) {
          try {
            const user = await prisma.user.findUnique({
              where: { email },
              select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
              },
            })

            if (user?.role === 'ADMIN' && user.password && (await compare(password, user.password))) {
              return {
                id: user.id,
                email: user.email,
                name: user.name || 'Marcos Admin',
                role: 'ADMIN',
              }
            }
          } catch (error) {
            console.error('Admin database credential lookup failed', error)
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'USER'
      }

      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
      }

      return session
    },
  },
}

export async function getAdminSession() {
  if (!process.env.NEXTAUTH_SECRET) {
    return null
  }

  const session = await getServerSession(authOptions)

  if (session?.user?.role === 'ADMIN') {
    return session
  }

  return null
}

export async function requireAdmin() {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  return session as Session
}
