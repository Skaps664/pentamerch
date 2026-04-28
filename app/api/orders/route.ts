import { NextResponse } from 'next/server'
import { createOrder, getOrdersForUser } from '@/lib/server/commerce-service'
import { getRequestUser } from '@/lib/server/request-user'

export async function GET(request: Request) {
  try {
    const user = await getRequestUser(request)
    const orders = await getOrdersForUser(user?.id ?? null, user?.email ?? null)
    return NextResponse.json(orders)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load orders.'
    return NextResponse.json({ message }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequestUser(request)
    const payload = (await request.json()) as Parameters<typeof createOrder>[0]
    const order = await createOrder(payload, user?.id ?? null)
    return NextResponse.json(order)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create order.'
    return NextResponse.json({ message }, { status: 400 })
  }
}