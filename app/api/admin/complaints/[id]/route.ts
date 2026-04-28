import { NextResponse } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/server/admin-auth'
import { updateComplaint } from '@/lib/server/commerce-service'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthorized = await isAdminRequestAuthorized(request)
  if (!isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const payload = (await request.json()) as { status?: 'Open' | 'In Review' | 'Resolved'; adminReply?: string }
    const complaint = await updateComplaint(id, {
      status: payload.status,
      adminReply: payload.adminReply,
    })
    return NextResponse.json(complaint)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update complaint.'
    return NextResponse.json({ message }, { status: 400 })
  }
}