'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { NAVBAR_PAGE_OPTIONS, useSiteData } from '@/lib/site-data-context'

export default function AdminDashboardPage() {
  const { products, categories, homeConfig, navItems, setNavItems } = useSiteData()
  const [selectedNavIds, setSelectedNavIds] = useState<string[]>(navItems.map((item) => item.id))
  const [savedNav, setSavedNav] = useState(false)

  const totalInStock = products.filter((item) => item.inStock).length
  const featuredCount = products.filter((item) => item.isFeatured).length

  useEffect(() => {
    setSelectedNavIds(navItems.map((item) => item.id))
  }, [navItems])

  const toggleNavItem = (id: string) => {
    setSelectedNavIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const saveNavbarItems = () => {
    const nextItems = NAVBAR_PAGE_OPTIONS.filter((item) => selectedNavIds.includes(item.id))
    if (nextItems.length === 0) {
      return
    }

    setNavItems(nextItems)
    setSavedNav(true)
    window.setTimeout(() => setSavedNav(false), 1800)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-600 mt-1">This is your control center for PentaMerch storefront data.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-slate-300 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Products</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{products.length}</p>
        </div>
        <div className="rounded-lg border border-slate-300 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">In Stock</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{totalInStock}</p>
        </div>
        <div className="rounded-lg border border-slate-300 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Categories</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{categories.length}</p>
        </div>
        <div className="rounded-lg border border-slate-300 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Featured Items</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{featuredCount}</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Home Page Section Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <p className="text-slate-700">Hero Section: <span className="font-medium">{homeConfig.hero.enabled ? 'Visible' : 'Hidden'}</span></p>
          <p className="text-slate-700">Featured Products: <span className="font-medium">{homeConfig.featured.enabled ? 'Visible' : 'Hidden'}</span></p>
          <p className="text-slate-700">Best Sellers: <span className="font-medium">{homeConfig.bestSellers.enabled ? 'Visible' : 'Hidden'}</span></p>
          <p className="text-slate-700">Categories Section: <span className="font-medium">{homeConfig.categories.enabled ? 'Visible' : 'Hidden'}</span></p>
          <p className="text-slate-700">Trending Section: <span className="font-medium">{homeConfig.trending.enabled ? 'Visible' : 'Hidden'}</span></p>
          <p className="text-slate-700">Trust Section: <span className="font-medium">{homeConfig.trust.enabled ? 'Visible' : 'Hidden'}</span></p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/home-page" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100">
            Edit Home Page
          </Link>
          <Link href="/admin/categories" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100">
            Manage Categories
          </Link>
          <Link href="/admin/products" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100">
            Manage Products
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-slate-300 bg-white p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Navbar Links</h3>
          <p className="text-sm text-slate-600 mt-1">Select which pages should appear in the storefront header navigation.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {NAVBAR_PAGE_OPTIONS.map((item) => (
            <label key={item.id} className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={selectedNavIds.includes(item.id)}
                onChange={() => toggleNavItem(item.id)}
              />
              {item.label}
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={saveNavbarItems}
            disabled={selectedNavIds.length === 0}
            className="rounded-md bg-slate-900 text-white px-5 py-2 text-sm font-medium hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Save Navbar Links
          </button>
          {selectedNavIds.length === 0 ? <p className="text-sm text-red-700">Select at least one page.</p> : null}
          {savedNav ? <p className="text-sm text-green-700">Navbar links updated.</p> : null}
        </div>
      </div>
    </div>
  )
}
