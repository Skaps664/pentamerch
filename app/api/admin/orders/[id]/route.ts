import { NextResponse } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/server/admin-auth'
import { updateOrder } from '@/lib/server/commerce-service'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthorized = await isAdminRequestAuthorized(request)
  if (!isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const payload = (await request.json()) as { status?: 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled'; trackingNumber?: string }
    const order = await updateOrder(id, {
      status: payload.status,
      trackingNumber: payload.trackingNumber,
    })
    return NextResponse.json(order)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update order.'
    return NextResponse.json({ message }, { status: 400 })
  }
}