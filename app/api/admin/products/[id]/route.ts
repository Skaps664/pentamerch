import { NextResponse } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/server/admin-auth'
import { deleteProduct, updateProduct } from '@/lib/server/site-data-service'

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
    const product = await updateProduct(id, payload)
    return NextResponse.json(product)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update product.'
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
    await deleteProduct(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to delete product.'
    return NextResponse.json({ message }, { status: 400 })
  }
}
