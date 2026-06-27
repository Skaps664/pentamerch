import {
  categories as defaultCategories,
  products as defaultProducts,
  type Category,
  type Product,
} from '@/lib/data'

export interface NavItem {
  id: string
  label: string
  href: string
}

const CORE_NAVBAR_PAGE_OPTIONS: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'all-products', label: 'All Products', href: '/products' },
  { id: 'contact', label: 'Contact', href: '/contact-us' },
]

export function getNavbarPageOptions(categories: Category[]): NavItem[] {
  const categoryItems = categories.map((category) => ({
    id: `category:${category.id}`,
    label: category.name,
    href: `/products?category=${encodeURIComponent(category.slug)}`,
  }))

  return [...CORE_NAVBAR_PAGE_OPTIONS, ...categoryItems]
}

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

export interface SiteDataState {
  products: Product[]
  categories: Category[]
  homeConfig: HomePageConfig
  productPageConfig: ProductPageConfig
  navItems: NavItem[]
}

export const defaultHomeConfig: HomePageConfig = {
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

export const defaultProductPageConfig: ProductPageConfig = {
  detailBanner: {
    enabled: true,
    title: 'Explore More at PentaMerch',
    text: 'Discover more standout products from our curated collection.',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1600&h=700&fit=crop',
    linkText: 'Shop Collections',
    linkHref: '/products',
  },
}

export const defaultSiteDataState: SiteDataState = {
  products: defaultProducts,
  categories: defaultCategories,
  homeConfig: defaultHomeConfig,
  productPageConfig: defaultProductPageConfig,
  navItems: getNavbarPageOptions(defaultCategories),
}

// An empty state used as the initial client-side state so we never render
// mock/seed data before the real data is loaded from the database.
export const emptySiteDataState: SiteDataState = {
  products: [],
  categories: [],
  homeConfig: {
    hero: {
      enabled: false,
      title: '',
      subtitle: '',
      ctaText: '',
      ctaHref: '',
      slides: [],
    },
    featured: {
      enabled: false,
      title: '',
      productIds: [],
    },
    bannerOne: {
      enabled: false,
      title: '',
      subtitle: '',
      ctaText: '',
      ctaHref: '',
      background: '',
      image: '',
    },
    bestSellers: {
      enabled: false,
      title: '',
      productIds: [],
    },
    trust: {
      enabled: false,
      eyebrow: '',
      title: '',
      subtitle: '',
    },
    categories: {
      enabled: false,
      title: '',
    },
    bannerTwo: {
      enabled: false,
      title: '',
      subtitle: '',
      ctaText: '',
      ctaHref: '',
      background: '',
      image: '',
    },
    trending: {
      enabled: false,
      title: '',
      productIds: [],
    },
  },
  productPageConfig: {
    detailBanner: {
      enabled: false,
      title: '',
      text: '',
      image: '',
      linkText: '',
      linkHref: '',
    },
  },
  navItems: [],
}

export function normalizeNavItems(items?: NavItem[], categories: Category[] = defaultCategories): NavItem[] {
  const options = getNavbarPageOptions(categories)

  if (!Array.isArray(items)) {
    return options
  }

  const optionsById = new Map(options.map((item) => [item.id, item]))
  const seen = new Set<string>()
  const nextItems: NavItem[] = []

  for (const item of items) {
    if (!item || typeof item.id !== 'string' || seen.has(item.id)) {
      continue
    }

    const option = optionsById.get(item.id)
    if (!option) {
      continue
    }

    seen.add(item.id)
    nextItems.push(option)
  }

  return nextItems.length > 0 ? nextItems : options
}

export function normalizeHomeConfig(value?: Partial<HomePageConfig>): HomePageConfig {
  return {
    hero: {
      ...defaultHomeConfig.hero,
      ...(value?.hero ?? {}),
      slides: Array.isArray(value?.hero?.slides)
        ? value.hero.slides.filter(Boolean)
        : defaultHomeConfig.hero.slides,
    },
    featured: {
      ...defaultHomeConfig.featured,
      ...(value?.featured ?? {}),
      productIds: Array.isArray(value?.featured?.productIds)
        ? value.featured.productIds.filter(Boolean)
        : defaultHomeConfig.featured.productIds,
    },
    bannerOne: {
      ...defaultHomeConfig.bannerOne,
      ...(value?.bannerOne ?? {}),
    },
    bestSellers: {
      ...defaultHomeConfig.bestSellers,
      ...(value?.bestSellers ?? {}),
      productIds: Array.isArray(value?.bestSellers?.productIds)
        ? value.bestSellers.productIds.filter(Boolean)
        : defaultHomeConfig.bestSellers.productIds,
    },
    trust: {
      ...defaultHomeConfig.trust,
      ...(value?.trust ?? {}),
    },
    categories: {
      ...defaultHomeConfig.categories,
      ...(value?.categories ?? {}),
    },
    bannerTwo: {
      ...defaultHomeConfig.bannerTwo,
      ...(value?.bannerTwo ?? {}),
    },
    trending: {
      ...defaultHomeConfig.trending,
      ...(value?.trending ?? {}),
      productIds: Array.isArray(value?.trending?.productIds)
        ? value.trending.productIds.filter(Boolean)
        : defaultHomeConfig.trending.productIds,
    },
  }
}

export function normalizeProductPageConfig(
  value?: Partial<ProductPageConfig>
): ProductPageConfig {
  return {
    detailBanner: {
      ...defaultProductPageConfig.detailBanner,
      ...(value?.detailBanner ?? {}),
    },
  }
}
