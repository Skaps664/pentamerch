'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Category, Product } from '@/lib/data'
import {
  emptySiteDataState,
  getNavbarPageOptions,
  normalizeNavItems,
  type HomePageConfig,
  type NavItem,
  type ProductPageConfig,
  type SiteDataState,
} from '@/lib/site-config'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser'

export { getNavbarPageOptions }
export type { HomePageConfig, NavItem, ProductPageConfig }

interface SiteDataContextValue extends SiteDataState {
  hydrated: boolean
  setHomeConfig: (config: HomePageConfig) => Promise<void>
  setProductPageConfig: (config: ProductPageConfig) => Promise<void>
  setNavItems: (items: NavItem[]) => Promise<void>
  createCategory: (payload: Omit<Category, 'id'> & { id?: string }) => Promise<void>
  updateCategory: (id: string, payload: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  createProduct: (payload: Omit<Product, 'id'> & { id?: string }) => Promise<void>
  updateProduct: (id: string, payload: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  resetAllData: () => Promise<void>
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null)

function isDataUrl(value: string | undefined): value is string {
  return typeof value === 'string' && value.startsWith('data:')
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as T & { message?: string }
  if (!response.ok) {
    throw new Error(payload.message ?? 'Request failed.')
  }

  return payload
}

async function getAdminRequestHeaders(): Promise<HeadersInit> {
  const supabase = getSupabaseBrowserClient()
  const { data } = await supabase.auth.getSession()
  const accessToken = data.session?.access_token

  return accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : {}
}

async function uploadImage(dataUrl: string, folder: string): Promise<string> {
  const authHeaders = await getAdminRequestHeaders()
  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify({ dataUrl, folder }),
  })

  const payload = await parseJsonResponse<{ url: string }>(response)
  return payload.url
}

async function uploadCategoryImages(payload: Omit<Category, 'id'> & { id?: string }) {
  if (!isDataUrl(payload.image)) {
    return payload
  }

  return {
    ...payload,
    image: await uploadImage(payload.image, 'categories'),
  }
}

async function uploadProductImages(payload: Omit<Product, 'id'> & { id?: string } | Partial<Product>) {
  const next: Partial<Product> = { ...payload }

  if (isDataUrl(payload.image)) {
    next.image = await uploadImage(payload.image, 'products')
  }

  if (Array.isArray(payload.images)) {
    next.images = await Promise.all(
      payload.images.map(async (image) => (isDataUrl(image) ? uploadImage(image, 'products') : image))
    )
  }

  return next
}

async function uploadHomeConfigImages(config: HomePageConfig): Promise<HomePageConfig> {
  const nextSlides = await Promise.all(
    config.hero.slides.map(async (slide) => (isDataUrl(slide) ? uploadImage(slide, 'home/hero') : slide))
  )

  const bannerOneImage = isDataUrl(config.bannerOne.image)
    ? await uploadImage(config.bannerOne.image, 'home/banner-one')
    : config.bannerOne.image

  const bannerTwoImage = isDataUrl(config.bannerTwo.image)
    ? await uploadImage(config.bannerTwo.image, 'home/banner-two')
    : config.bannerTwo.image

  return {
    ...config,
    hero: {
      ...config.hero,
      slides: nextSlides,
    },
    bannerOne: {
      ...config.bannerOne,
      image: bannerOneImage,
    },
    bannerTwo: {
      ...config.bannerTwo,
      image: bannerTwoImage,
    },
  }
}

async function uploadProductPageConfigImages(config: ProductPageConfig): Promise<ProductPageConfig> {
  const bannerImage = isDataUrl(config.detailBanner.image)
    ? await uploadImage(config.detailBanner.image, 'product-page')
    : config.detailBanner.image

  return {
    ...config,
    detailBanner: {
      ...config.detailBanner,
      image: bannerImage,
    },
  }
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SiteDataState>(emptySiteDataState)
  const [hydrated, setHydrated] = useState(false)

  const refreshSiteData = useCallback(async () => {
    const response = await fetch('/api/site-data', { cache: 'no-store' })
    const payload = await parseJsonResponse<SiteDataState>(response)
    setState({
      ...payload,
      navItems: normalizeNavItems(payload.navItems, payload.categories),
    })
  }, [])

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        await refreshSiteData()
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) {
          setHydrated(true)
        }
      }
    }

    void run()

    return () => {
      isMounted = false
    }
  }, [refreshSiteData])

  const value = useMemo<SiteDataContextValue>(() => ({
    ...state,
    hydrated,
    setHomeConfig: async (config) => {
      const withUploadedImages = await uploadHomeConfigImages(config)
      const authHeaders = await getAdminRequestHeaders()
      const response = await fetch('/api/admin/config/home', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(withUploadedImages),
      })

      const saved = await parseJsonResponse<HomePageConfig>(response)
      setState((prev) => ({ ...prev, homeConfig: saved }))
    },
    setProductPageConfig: async (config) => {
      const withUploadedImages = await uploadProductPageConfigImages(config)
      const authHeaders = await getAdminRequestHeaders()
      const response = await fetch('/api/admin/config/product-page', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(withUploadedImages),
      })

      const saved = await parseJsonResponse<ProductPageConfig>(response)
      setState((prev) => ({ ...prev, productPageConfig: saved }))
    },
    setNavItems: async (items) => {
      const nextItems = normalizeNavItems(items, state.categories)
      const authHeaders = await getAdminRequestHeaders()
      const response = await fetch('/api/admin/config/nav', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(nextItems),
      })

      const saved = await parseJsonResponse<NavItem[]>(response)
      setState((prev) => ({
        ...prev,
        navItems: normalizeNavItems(saved, prev.categories),
      }))
    },
    createCategory: async (payload) => {
      const withUploadedImages = await uploadCategoryImages(payload)
      const authHeaders = await getAdminRequestHeaders()
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(withUploadedImages),
      })

      const created = await parseJsonResponse<Category>(response)
      setState((prev) => ({
        ...prev,
        categories: [...prev.categories, created],
      }))
    },
    updateCategory: async (id, payload) => {
      const withUploadedImages = await uploadCategoryImages(payload as Omit<Category, 'id'> & { id?: string })
      const authHeaders = await getAdminRequestHeaders()
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(withUploadedImages),
      })

      const updated = await parseJsonResponse<Category>(response)
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((item) => (item.id === id ? updated : item)),
      }))
    },
    deleteCategory: async (id) => {
      const authHeaders = await getAdminRequestHeaders()
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          ...authHeaders,
        },
      })

      await parseJsonResponse<{ ok: boolean }>(response)
      setState((prev) => ({
        ...prev,
        categories: prev.categories.filter((item) => item.id !== id),
      }))
    },
    createProduct: async (payload) => {
      const withUploadedImages = (await uploadProductImages(payload)) as Omit<Product, 'id'> & { id?: string }
      const authHeaders = await getAdminRequestHeaders()
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(withUploadedImages),
      })

      const created = await parseJsonResponse<Product>(response)
      setState((prev) => ({
        ...prev,
        products: [...prev.products, created],
      }))
    },
    updateProduct: async (id, payload) => {
      const withUploadedImages = await uploadProductImages(payload)
      const authHeaders = await getAdminRequestHeaders()
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(withUploadedImages),
      })

      const updated = await parseJsonResponse<Product>(response)
      setState((prev) => ({
        ...prev,
        products: prev.products.map((item) => (item.id === id ? updated : item)),
      }))
    },
    deleteProduct: async (id) => {
      const authHeaders = await getAdminRequestHeaders()
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          ...authHeaders,
        },
      })

      await parseJsonResponse<{ ok: boolean }>(response)
      await refreshSiteData()
    },
    resetAllData: async () => {
      await refreshSiteData()
    },
  }), [state, hydrated, refreshSiteData])

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error('useSiteData must be used inside SiteDataProvider')
  }

  return context
}
