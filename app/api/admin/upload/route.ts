import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/server/admin-auth'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

interface UploadPayload {
  dataUrl: string
  folder?: string
  fileName?: string
}

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; contentType: string; extension: string } {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/)
  if (!match) {
    throw new Error('Invalid data URL.')
  }

  const contentType = match[1]
  const base64 = match[2]
  const buffer = Buffer.from(base64, 'base64')
  const extension = contentType.split('/')[1] ?? 'bin'

  return { buffer, contentType, extension }
}

export async function POST(request: Request) {
  const isAuthorized = await isAdminRequestAuthorized(request)
  if (!isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as UploadPayload
    if (!body?.dataUrl?.startsWith('data:')) {
      return NextResponse.json({ message: 'Missing image data.' }, { status: 400 })
    }

    const { buffer, contentType, extension } = dataUrlToBuffer(body.dataUrl)
    const supabase = getSupabaseAdminClient()
    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'site-images'

    await supabase.storage.createBucket(bucket, { public: true }).catch(() => undefined)

    const sanitizedFolder = (body.folder ?? 'general').replace(/[^a-zA-Z0-9/_-]/g, '')
    const fileName = (body.fileName ?? randomUUID()).replace(/[^a-zA-Z0-9._-]/g, '')
    const path = `${sanitizedFolder}/${fileName}.${extension}`

    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType,
      upsert: true,
    })

    if (error) {
      throw new Error(error.message)
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return NextResponse.json({ url: data.publicUrl })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to upload image.'
    return NextResponse.json({ message }, { status: 400 })
  }
}
