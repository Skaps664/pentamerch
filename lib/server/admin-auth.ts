import 'server-only'

import { getSupabaseServerClient } from '@/lib/supabase/server'

function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export async function isAdminRequestAuthorized(): Promise<boolean> {
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
