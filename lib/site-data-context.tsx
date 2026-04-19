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
    image: string
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
    image: string
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
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&h=900&fit=crop',
      'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=1600&h=900&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&h=900&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1600&h=900&fit=crop',
  },
  trending: {
    enabled: true,
    title: 'Trending Now',
    productIds: defaultProducts.slice(8, 16).map((item) => item.id),
  },
}

const defaultProductPageConfig: ProductPageConfig = {
  detailBanner: {
    enabled: true,
    title: 'Explore More at PentaMerch',
    text: 'Discover more standout products from our curated collection.',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1600&h=700&fit=crop',
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

const IMAGE_URL_MIGRATION: Record<string, string> = {
  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&h=900&fit=crop': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=900&fit=crop': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1600&h=900&fit=crop': 'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1525261741207-4b6f9a891e11?w=400&h=400&fit=crop': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop': 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=400&fit=crop': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517836357463-d25ddfcb70ff?w=400&h=400&fit=crop': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=400&fit=crop': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1588872657840-790ff3bde1b6?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1591028171603-e14f2c4d2bef?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1593032465171-8bd017db2a98?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop': 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop',
}

function migrateImageUrl(url: string): string {
  return IMAGE_URL_MIGRATION[url] ?? url
}

function migrateProduct(product: Product): Product {
  return {
    ...product,
    image: migrateImageUrl(product.image),
    images: product.images?.map(migrateImageUrl),
  }
}

function migrateCategory(category: Category): Category {
  return {
    ...category,
    image: migrateImageUrl(category.image),
  }
}

function migrateHomeConfig(config: HomePageConfig): HomePageConfig {
  return {
    ...config,
    hero: {
      ...config.hero,
      slides: config.hero.slides.map(migrateImageUrl),
    },
    bannerOne: {
      ...config.bannerOne,
      image: migrateImageUrl(config.bannerOne.image || defaultHomeConfig.bannerOne.image),
    },
    bannerTwo: {
      ...config.bannerTwo,
      image: migrateImageUrl(config.bannerTwo.image || defaultHomeConfig.bannerTwo.image),
    },
  }
}

function migrateProductPageConfig(config: ProductPageConfig): ProductPageConfig {
  return {
    ...config,
    detailBanner: {
      ...config.detailBanner,
      enabled: true,
      image: migrateImageUrl(config.detailBanner.image),
    },
  }
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
          products: (parsed.products ?? defaultState.products).map(migrateProduct),
          categories: (parsed.categories ?? defaultState.categories).map(migrateCategory),
          homeConfig: migrateHomeConfig(parsed.homeConfig ?? defaultState.homeConfig),
          productPageConfig: migrateProductPageConfig(
            parsed.productPageConfig ?? defaultState.productPageConfig
          ),
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
