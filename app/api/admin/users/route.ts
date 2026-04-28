import { NextResponse } from 'next/server'
import { isAdminRequestAuthorized } from '@/lib/server/admin-auth'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const isAuthorized = await isAdminRequestAuthorized(request)
  if (!isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseAdminClient()
    const { data, error } = await supabase.auth.admin.listUsers()
    if (error) {
      throw new Error(error.message)
    }

    const users = (data?.users ?? []).map((user) => ({
      id: user.id,
      email: user.email ?? '',
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at ?? null,
      emailConfirmedAt: user.email_confirmed_at ?? null,
    }))

    return NextResponse.json(users)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load users.'
    return NextResponse.json({ message }, { status: 400 })
  }
}