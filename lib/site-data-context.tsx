'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  categories as defaultCategories,
  products as defaultProducts,
  type Category,
  type Product,
} from '@/lib/data'

const STORAGE_KEY = 'pentamerch-admin-data-v1'

export interface HomePageConfig {
  hero: {
    enabled: boolean
    title: string
    subtitle: string
    ctaText: string
    ctaHref: string
    slides: string[]
  }
  featured: {
    enabled: boolean
    title: string
    productIds: string[]
  }
  bannerOne: {
    enabled: boolean
    title: string
    subtitle: string
    ctaText: string
    ctaHref: string
    background: string
  }
  bestSellers: {
    enabled: boolean
    title: string
    productIds: string[]
  }
  trust: {
    enabled: boolean
    eyebrow: string
    title: string
    subtitle: string
  }
  categories: {
    enabled: boolean
    title: string
  }
  bannerTwo: {
    enabled: boolean
    title: string
    subtitle: string
    ctaText: string
    ctaHref: string
    background: string
  }
  trending: {
    enabled: boolean
    title: string
    productIds: string[]
  }
}

export interface ProductPageConfig {
  detailBanner: {
    enabled: boolean
    title: string
    text: string
    image: string
    linkText: string
    linkHref: string
  }
}

interface SiteDataState {
  products: Product[]
  categories: Category[]
  homeConfig: HomePageConfig
  productPageConfig: ProductPageConfig
}

interface SiteDataContextValue extends SiteDataState {
  hydrated: boolean
  setHomeConfig: (config: HomePageConfig) => void
  setProductPageConfig: (config: ProductPageConfig) => void
  createCategory: (payload: Omit<Category, 'id'> & { id?: string }) => void
  updateCategory: (id: string, payload: Partial<Category>) => void
  deleteCategory: (id: string) => void
  createProduct: (payload: Omit<Product, 'id'> & { id?: string }) => void
  updateProduct: (id: string, payload: Partial<Product>) => void
  deleteProduct: (id: string) => void
  resetAllData: () => void
}

const defaultHomeConfig: HomePageConfig = {
  hero: {
    enabled: true,
    title: 'Welcome to PentaMerch',
    subtitle:
      'A curated collection of premium products across electronics, fashion, home, beauty, and more.',
    ctaText: 'Shop Now',
    ctaHref: '/products',
    slides: [
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&h=900&fit=crop',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=900&fit=crop',
      'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1600&h=900&fit=crop',
    ],
  },
  featured: {
    enabled: true,
    title: 'Featured Products',
    productIds: defaultProducts.slice(0, 8).map((item) => item.id),
  },
  bannerOne: {
    enabled: true,
    title: 'Mid-Season Essentials',
    subtitle:
      'Refresh your cart with curated picks and limited-time savings across top categories.',
    ctaText: 'Shop Collections',
    ctaHref: '/products',
    background: 'bg-gradient-to-r from-primary to-primary/80',
  },
  bestSellers: {
    enabled: true,
    title: 'Best Sellers',
    productIds: defaultProducts
      .filter((item) => item.isBestseller)
      .slice(0, 8)
      .map((item) => item.id),
  },
  trust: {
    enabled: true,
    eyebrow: 'Trusted Shopping Experience',
    title: 'Why Customers Choose PentaMerch',
    subtitle:
      'Clear policies, secure payments, and dependable delivery from a store built for long-term trust.',
  },
  categories: {
    enabled: true,
    title: 'Shop by Category',
  },
  bannerTwo: {
    enabled: true,
    title: 'Limited Time Offer',
    subtitle: "Get up to 40% off on selected items. Don't miss out!",
    ctaText: 'Shop Sale',
    ctaHref: '/products',
    background: 'bg-gradient-to-r from-accent to-accent/80',
  },
  trending: {
    enabled: true,
    title: 'Trending Now',
    productIds: defaultProducts.slice(8, 16).map((item) => item.id),
  },
}

const defaultProductPageConfig: ProductPageConfig = {
  detailBanner: {
    enabled: false,
    title: 'Explore More at PentaMerch',
    text: 'Discover more standout products from our curated collection.',
    image: '',
    linkText: 'Shop Collections',
    linkHref: '/products',
  },
}

const defaultState: SiteDataState = {
  products: defaultProducts,
  categories: defaultCategories,
  homeConfig: defaultHomeConfig,
  productPageConfig: defaultProductPageConfig,
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null)

function getNextNumericId(values: string[]): string {
  const numericIds = values
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value))

  if (numericIds.length === 0) {
    return '1'
  }

  return String(Math.max(...numericIds) + 1)
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SiteDataState>(defaultState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SiteDataState>
        setState({
          products: parsed.products ?? defaultState.products,
          categories: parsed.categories ?? defaultState.categories,
          homeConfig: parsed.homeConfig ?? defaultState.homeConfig,
          productPageConfig:
            parsed.productPageConfig ?? defaultState.productPageConfig,
        })
      }
    } catch {
      setState(defaultState)
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, hydrated])

  const value = useMemo<SiteDataContextValue>(() => ({
    ...state,
    hydrated,
    setHomeConfig: (config) => {
      setState((prev) => ({ ...prev, homeConfig: config }))
    },
    setProductPageConfig: (config) => {
      setState((prev) => ({ ...prev, productPageConfig: config }))
    },
    createCategory: (payload) => {
      setState((prev) => {
        const id = payload.id || payload.slug || getNextNumericId(prev.categories.map((item) => item.id))
        return {
          ...prev,
          categories: [...prev.categories, { ...payload, id }],
        }
      })
    },
    updateCategory: (id, payload) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.map((item) => (item.id === id ? { ...item, ...payload } : item)),
      }))
    },
    deleteCategory: (id) => {
      setState((prev) => ({
        ...prev,
        categories: prev.categories.filter((item) => item.id !== id),
      }))
    },
    createProduct: (payload) => {
      setState((prev) => {
        const id = payload.id || getNextNumericId(prev.products.map((item) => item.id))
        return {
          ...prev,
          products: [...prev.products, { ...payload, id }],
        }
      })
    },
    updateProduct: (id, payload) => {
      setState((prev) => ({
        ...prev,
        products: prev.products.map((item) => (item.id === id ? { ...item, ...payload } : item)),
      }))
    },
    deleteProduct: (id) => {
      setState((prev) => ({
        ...prev,
        products: prev.products.filter((item) => item.id !== id),
        homeConfig: {
          ...prev.homeConfig,
          featured: {
            ...prev.homeConfig.featured,
            productIds: prev.homeConfig.featured.productIds.filter((item) => item !== id),
          },
          bestSellers: {
            ...prev.homeConfig.bestSellers,
            productIds: prev.homeConfig.bestSellers.productIds.filter((item) => item !== id),
          },
          trending: {
            ...prev.homeConfig.trending,
            productIds: prev.homeConfig.trending.productIds.filter((item) => item !== id),
          },
        },
      }))
    },
    resetAllData: () => {
      setState(defaultState)
      window.localStorage.removeItem(STORAGE_KEY)
    },
  }), [state, hydrated])

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error('useSiteData must be used inside SiteDataProvider')
  }

  return context
}
