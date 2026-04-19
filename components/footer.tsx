import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center mb-4 rounded-lg bg-white/95 px-3 py-2 shadow-sm ring-1 ring-white/40">
              <Image
                src="/penta-merch-logo.png"
                alt="PentaMerch"
                width={180}
                height={48}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-sm opacity-90">
              PentaMerch is a modern online store for quality electronics, fashion, lifestyle, and home essentials.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:opacity-80 transition-opacity">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics" className="hover:opacity-80 transition-opacity">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=fashion" className="hover:opacity-80 transition-opacity">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?category=home" className="hover:opacity-80 transition-opacity">
                  Home & Garden
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact-us" className="hover:opacity-80 transition-opacity">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping-info" className="hover:opacity-80 transition-opacity">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:opacity-80 transition-opacity">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:opacity-80 transition-opacity">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground border-opacity-20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>&copy; {currentYear} PentaMerch. All rights reserved. Made by them <a href="https://skordlabs.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              skordlabs
            </a></p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:opacity-80 transition-opacity">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:opacity-80 transition-opacity">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:opacity-80 transition-opacity">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
