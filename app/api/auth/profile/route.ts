import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const defaultAddress = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  county: '',
  postcode: '',
  country: 'United Kingdom',
}

function defaultUsernameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'user'
  return local.trim() || 'user'
}

export async function GET() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { data: existing } = await supabase
    .from('user_profiles')
    .select('username,address')
    .eq('user_id', user.id)
    .single()

  const username = (existing?.username as string | undefined) ?? defaultUsernameFromEmail(user.email ?? '')
  const address = {
    ...defaultAddress,
    ...((existing?.address as Record<string, string> | undefined) ?? {}),
  }

  await supabase.from('user_profiles').upsert(
    {
      user_id: user.id,
      username,
      address,
    },
    { onConflict: 'user_id' }
  )

  return NextResponse.json({
    email: user.email,
    username,
    address,
  })
}

export async function PUT(request: Request) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const payload = (await request.json()) as {
    username?: string
    address?: Record<string, string>
  }

  const username = payload.username?.trim() || defaultUsernameFromEmail(user.email ?? '')
  const address = {
    ...defaultAddress,
    ...(payload.address ?? {}),
  }

  const { error } = await supabase.from('user_profiles').upsert(
    {
      user_id: user.id,
      username,
      address,
    },
    { onConflict: 'user_id' }
  )

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  return NextResponse.json({
    email: user.email,
    username,
    address,
  })
}
