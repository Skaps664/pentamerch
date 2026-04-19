'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Search, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

export function Header() {
  const { items } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 inline-flex items-center">
            <Image
              src="/penta-merch-logo.png"
              alt="PentaMerch"
              width={180}
              height={48}
              className="h-8 md:h-9 w-auto"
              priority
            />
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/contact-us" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="text-foreground hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="/admin" className="text-foreground hover:text-primary transition-colors">
              Admin
            </Link>
            <Link href="/products?category=electronics" className="text-foreground hover:text-primary transition-colors">
              Electronics
            </Link>
            <Link href="/products?category=fashion" className="text-foreground hover:text-primary transition-colors">
              Fashion
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Search className="w-5 h-5 text-foreground" />
            </button>
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
            <Link href="/" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              Home
            </Link>
            <Link href="/products" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              Products
            </Link>
            <Link href="/contact-us" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              Contact Us
            </Link>
            <Link href="/shipping-info" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              Shipping Info
            </Link>
            <Link href="/returns" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              Returns
            </Link>
            <Link href="/faq" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              FAQ
            </Link>
            <Link href="/admin" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              Admin
            </Link>
            <Link href="/products?category=electronics" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              Electronics
            </Link>
            <Link href="/products?category=fashion" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              Fashion
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
