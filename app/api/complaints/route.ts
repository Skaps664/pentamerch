import { NextResponse } from 'next/server'
import { createComplaint, getComplaintsForUser } from '@/lib/server/commerce-service'
import { getRequestUser } from '@/lib/server/request-user'

export async function GET(request: Request) {
  try {
    const user = await getRequestUser(request)
    const complaints = await getComplaintsForUser(user?.id ?? null, user?.email ?? null)
    return NextResponse.json(complaints)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load complaints.'
    return NextResponse.json({ message }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequestUser(request)
    const payload = (await request.json()) as Parameters<typeof createComplaint>[0]
    const complaint = await createComplaint(payload, user?.id ?? null)
    return NextResponse.json(complaint)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to submit complaint.'
    return NextResponse.json({ message }, { status: 400 })
  }
}