import { NextResponse } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/server/admin-auth'
import { deleteCategory, updateCategory } from '@/lib/server/site-data-service'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthorized = await isAdminRequestAuthorized()
  if (!isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const payload = await request.json()
    const category = await updateCategory(id, payload)
    return NextResponse.json(category)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update category.'
    return NextResponse.json({ message }, { status: 400 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthorized = await isAdminRequestAuthorized()
  if (!isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await deleteCategory(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to delete category.'
    return NextResponse.json({ message }, { status: 400 })
  }
}
