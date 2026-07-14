import { LeadStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { apiError, requireAdminApi } from '../../../../../lib/cms-api'
import { deleteLeadById, updateLeadStatus } from '../../../../../lib/lead-data'

const validStatuses = new Set<string>(Object.values(LeadStatus))

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const body = (await request.json()) as { status?: string }

    if (!body.status || !validStatuses.has(body.status)) {
      return NextResponse.json({ success: false, error: 'Invalid lead status' }, { status: 400 })
    }

    const lead = await updateLeadStatus(params.id, body.status as LeadStatus)
    revalidatePath('/admin')
    revalidatePath('/admin/leads')

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    return apiError(error, 'Unable to update lead')
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminApi()

  if (auth.response) {
    return auth.response
  }

  try {
    const deleted = await deleteLeadById(params.id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 })
    }

    revalidatePath('/admin')
    revalidatePath('/admin/leads')

    return NextResponse.json({ success: true })
  } catch (error) {
    return apiError(error, 'Unable to delete lead')
  }
}
