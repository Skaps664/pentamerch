import { NextResponse } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/server/admin-auth'
import { getAllComplaints } from '@/lib/server/commerce-service'

export async function GET(request: Request) {
  const isAuthorized = await isAdminRequestAuthorized(request)
  if (!isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const complaints = await getAllComplaints()
    return NextResponse.json(complaints)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load complaints.'
    return NextResponse.json({ message }, { status: 400 })
  }
}