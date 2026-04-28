import 'server-only'

import type { User } from '@supabase/supabase-js'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function getRequestUser(request?: Request): Promise<User | null> {
  const authorization = request?.headers.get('authorization')
  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.slice('Bearer '.length).trim()
    if (token) {
      const supabase = getSupabaseAdminClient()
      const { data, error } = await supabase.auth.getUser(token)
      if (!error && data.user) {
        return data.user
      }
    }
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ?? null
}