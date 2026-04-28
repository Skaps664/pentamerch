import 'server-only'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

async function authorizeWithBearerToken(request: Request): Promise<boolean> {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return false
  }

  const token = authorization.slice('Bearer '.length).trim()
  if (!token) {
    return false
  }

  const supabase = getSupabaseAdminClient()
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user?.email) {
    return false
  }

  const allowedEmails = getAllowedAdminEmails()
  return allowedEmails.length === 0 || allowedEmails.includes(data.user.email.toLowerCase())
}

export async function isAdminRequestAuthorized(request?: Request): Promise<boolean> {
  if (request && (await authorizeWithBearerToken(request))) {
    return true
  }

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user?.email) {
    return false
  }

  const allowedEmails = getAllowedAdminEmails()
  if (allowedEmails.length === 0) {
    return true
  }

  return allowedEmails.includes(user.email.toLowerCase())
}
