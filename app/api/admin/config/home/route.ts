import { NextResponse } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/server/admin-auth'
import { saveHomeConfig } from '@/lib/server/site-data-service'

export async function PUT(request: Request) {
  const isAuthorized = await isAdminRequestAuthorized()
  if (!isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const config = await saveHomeConfig(payload)
    return NextResponse.json(config)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save home configuration.'
    return NextResponse.json({ message }, { status: 400 })
  }
}
