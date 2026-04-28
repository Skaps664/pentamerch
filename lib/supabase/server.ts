import 'server-only'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase public environment variables.')
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }))
      },
    },
  })
}