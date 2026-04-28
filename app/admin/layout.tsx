'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const ADMIN_PASSPHRASE = 'KhialinUK'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/home-page', label: 'Home Page' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/complaints', label: 'Complaints' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')

  const isActiveTab = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (passphrase === ADMIN_PASSPHRASE) {
      setIsUnlocked(true)
      setError('')
      setPassphrase('')
      return
    }

    setError('Incorrect passphrase.')
    setPassphrase('')
  }

  return (
    <div className="min-h-screen bg-white relative">
      {!isUnlocked ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white px-4">
          <form
            onSubmit={handleUnlock}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Restricted Access</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Enter Admin Passphrase</h2>
            <p className="mt-2 text-sm text-slate-600">
              The admin panel unlocks only after you enter the passphrase for this session.
            </p>

            <div className="mt-5 space-y-3">
              <Input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Passphrase"
                autoFocus
              />
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800">
                Unlock Admin Panel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 rounded-lg border border-slate-300 bg-white px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">PentaMerch Administration</p>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1">Admin Panel</h1>
          <p className="text-sm text-slate-600 mt-1">Manage storefront content, categories, and products in a clear section-based workflow.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <nav className="rounded-lg border border-slate-300 bg-white p-3">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActiveTab(item.href)
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      aria-current={isActiveTab(item.href) ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <section className="lg:col-span-9">{children}</section>
        </div>
      </div>
        </div>
      )}
    </div>
  )
}
