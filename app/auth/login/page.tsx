'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { hydrated, user, login, getUserSlug } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (hydrated && user) {
      const slug = getUserSlug()
      if (slug) {
        router.replace(`/user/${slug}`)
      }
    }
  }, [hydrated, user, getUserSlug, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await login({ email, password })

    if (!result.ok) {
      setError(result.message)
      setIsSubmitting(false)
      return
    }

    const slug = getUserSlug()
    if (slug) {
      router.push(`/user/${slug}`)
      return
    }

    router.push('/')
    setIsSubmitting(false)
  }

  return (
    <section className="py-12 md:py-16 bg-muted/30 min-h-[60vh]">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your email and password.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                required
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-slate-900 text-white py-2.5 text-sm font-medium hover:bg-slate-800 disabled:opacity-70"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            Do not have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
