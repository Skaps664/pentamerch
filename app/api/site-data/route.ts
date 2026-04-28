import { NextResponse } from 'next/server'
import { getSiteData } from '@/lib/server/site-data-service'

export async function GET() {
  try {
    const data = await getSiteData()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load site data.'
    return NextResponse.json({ message }, { status: 500 })
  }
}
