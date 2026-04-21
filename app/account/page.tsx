'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function AccountPage() {
  const router = useRouter()
  const { user, hydrated, getUserSlug } = useAuth()

  useEffect(() => {
    if (!hydrated) {
      return
    }

    if (!user) {
      router.replace('/auth/login')
      return
    }

    const slug = getUserSlug()
    if (slug) {
      router.replace(`/user/${slug}`)
    }
  }, [hydrated, user, getUserSlug, router])

  return (
    <section className="py-12 md:py-16 min-h-[60vh]">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-card p-6">Redirecting to your account...</div>
      </div>
    </section>
  )
}
