import { LeadSource, LeadStatus, type Prisma } from '@prisma/client'
import { prisma, requireDatabase } from './prisma'
import type { BookingFormData, ContactFormData } from './validations'

export type AdminLeadFilters = {
  q?: string
  source?: string
  status?: string
}

function normalizeOptional(value?: string) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export async function createContactLead(data: ContactFormData) {
  if (!prisma) {
    console.warn('Skipping contact lead save because DATABASE_URL is not configured')
    return null
  }

  try {
    return await prisma.lead.create({
      data: {
        source: LeadSource.CONTACT,
        name: data.name,
        phone: data.phone,
        email: data.email,
        company: normalizeOptional(data.organization),
        interest: data.interest,
        message: data.message,
      },
    })
  } catch (error) {
    console.error('Unable to save contact lead', error)
    return null
  }
}

export async function createBookingLead(data: BookingFormData) {
  if (!prisma) {
    console.warn('Skipping booking lead save because DATABASE_URL is not configured')
    return null
  }

  try {
    return await prisma.lead.create({
      data: {
        source: LeadSource.BOOKING,
        name: data.name,
        phone: data.phone,
        email: data.email,
        company: normalizeOptional(data.company),
        interest: data.productName,
        productId: data.productId,
        productName: data.productName,
        requirementType: data.requirementType,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        location: data.location,
        message: data.message,
      },
    })
  } catch (error) {
    console.error('Unable to save booking lead', error)
    return null
  }
}

export async function getAdminLeads(filters: AdminLeadFilters = {}) {
  const db = requireDatabase()
  const where: Prisma.LeadWhereInput = {}
  const query = filters.q?.trim()

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { phone: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { company: { contains: query, mode: 'insensitive' } },
      { interest: { contains: query, mode: 'insensitive' } },
      { productName: { contains: query, mode: 'insensitive' } },
      { requirementType: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } },
      { message: { contains: query, mode: 'insensitive' } },
    ]
  }

  if (filters.source && filters.source !== 'ALL') {
    where.source = filters.source as LeadSource
  }

  if (filters.status && filters.status !== 'ALL') {
    where.status = filters.status as LeadStatus
  }

  return db.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getLeadStats() {
  const db = requireDatabase()
  const [totalLeads, newLeads, contactLeads, bookingLeads] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { status: LeadStatus.NEW } }),
    db.lead.count({ where: { source: LeadSource.CONTACT } }),
    db.lead.count({ where: { source: LeadSource.BOOKING } }),
  ])

  return {
    totalLeads,
    newLeads,
    contactLeads,
    bookingLeads,
  }
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const db = requireDatabase()

  return db.lead.update({
    where: { id },
    data: { status },
  })
}

export async function deleteLeadById(id: string) {
  const db = requireDatabase()
  const lead = await db.lead.findUnique({ where: { id } })

  if (!lead) {
    return false
  }

  await db.lead.delete({ where: { id } })
  return true
}
