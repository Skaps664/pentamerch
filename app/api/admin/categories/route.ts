import { NextResponse } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/server/admin-auth'
import { createCategory } from '@/lib/server/site-data-service'

export async function POST(request: Request) {
  const isAuthorized = await isAdminRequestAuthorized()
  if (!isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const category = await createCategory(payload)
    return NextResponse.json(category)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create category.'
    return NextResponse.json({ message }, { status: 400 })
  }
}
