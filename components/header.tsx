'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { useSiteData } from '@/lib/site-data-context'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Header() {
  const { items } = useCart()
  const { navItems } = useSiteData()
  const { user, getUserSlug } = useAuth()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const profileLink = user && getUserSlug() ? `/user/${getUserSlug()}` : `/auth/login?returnTo=${encodeURIComponent(pathname)}`

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 inline-flex items-center">
            <Image
              src="/penta-merch-logo.png"
              alt="PentaMerch"
              width={220}
              height={60}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.id} href={item.href} className="text-foreground hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href={profileLink} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label={user ? 'Go to account' : 'Go to login'}>
              <User className="w-5 h-5 text-foreground" />
            </Link>
            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={`mobile-${item.id}`} href={item.href} className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
