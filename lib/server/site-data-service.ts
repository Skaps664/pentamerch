import 'server-only'

import { randomUUID } from 'node:crypto'
import type { Category, Product } from '@/lib/data'
import {
  defaultSiteDataState,
  normalizeHomeConfig,
  normalizeNavItems,
  normalizeProductPageConfig,
  type HomePageConfig,
  type NavItem,
  type ProductPageConfig,
  type SiteDataState,
} from '@/lib/site-config'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

type DbCategoryRow = Category

type DbProductRow = {
  id: string
  name: string
  price: number
  original_price: number | null
  description: string
  category: string
  image: string
  rating: number
  reviews: number
  in_stock: boolean
  is_featured: boolean
  is_bestseller: boolean
  images: string[] | null
  specifications: Record<string, string> | null
  key_features: string[] | null
  shipping_info: string[] | null
  return_info: string[] | null
}

type DbSiteConfigRow = {
  key: string
  value: unknown
}

function toDbProduct(payload: Product): DbProductRow {
  return {
    id: payload.id,
    name: payload.name,
    price: payload.price,
    original_price: payload.originalPrice ?? null,
    description: payload.description,
    category: payload.category,
    image: payload.image,
    rating: payload.rating,
    reviews: payload.reviews,
    in_stock: payload.inStock,
    is_featured: payload.isFeatured,
    is_bestseller: payload.isBestseller,
    images: payload.images ?? [],
    specifications: payload.specifications ?? {},
    key_features: payload.keyFeatures ?? [],
    shipping_info: payload.shippingInfo ?? [],
    return_info: payload.returnInfo ?? [],
  }
}

function fromDbProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    description: row.description,
    category: row.category,
    image: row.image,
    rating: row.rating,
    reviews: row.reviews,
    inStock: row.in_stock,
    isFeatured: row.is_featured,
    isBestseller: row.is_bestseller,
    images: row.images ?? [],
    specifications: row.specifications ?? {},
    keyFeatures: row.key_features ?? [],
    shippingInfo: row.shipping_info ?? [],
    returnInfo: row.return_info ?? [],
  }
}

async function ensureSeeded() {
  const supabase = getSupabaseAdminClient()

  const { count: categoryCount } = await supabase
    .from('categories')
    .select('id', { count: 'exact', head: true })

  if (!categoryCount || categoryCount === 0) {
    await supabase.from('categories').insert(defaultSiteDataState.categories)
  }

  const { count: productCount } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })

  if (!productCount || productCount === 0) {
    await supabase.from('products').insert(defaultSiteDataState.products.map(toDbProduct))
  }

  await supabase.from('site_config').upsert(
    [
      { key: 'homeConfig', value: defaultSiteDataState.homeConfig },
      { key: 'productPageConfig', value: defaultSiteDataState.productPageConfig },
      { key: 'navItems', value: defaultSiteDataState.navItems },
    ],
    { onConflict: 'key' }
  )
}

export async function getSiteData(): Promise<SiteDataState> {
  await ensureSeeded()
  const supabase = getSupabaseAdminClient()

  const [{ data: categoriesData }, { data: productsData }, { data: configRows }] = await Promise.all([
    supabase.from('categories').select('*').order('name', { ascending: true }),
    supabase.from('products').select('*').order('id', { ascending: true }),
    supabase.from('site_config').select('key,value'),
  ])

  const configByKey = new Map<string, unknown>()
  for (const row of (configRows ?? []) as DbSiteConfigRow[]) {
    configByKey.set(row.key, row.value)
  }

  const categories = ((categoriesData ?? []) as DbCategoryRow[]).map((item) => ({ ...item }))

  return {
    categories,
    products: ((productsData ?? []) as DbProductRow[]).map(fromDbProduct),
    homeConfig: normalizeHomeConfig(configByKey.get('homeConfig') as Partial<HomePageConfig>),
    productPageConfig: normalizeProductPageConfig(
      configByKey.get('productPageConfig') as Partial<ProductPageConfig>
    ),
    navItems: normalizeNavItems(configByKey.get('navItems') as NavItem[], categories),
  }
}

export async function createCategory(payload: Omit<Category, 'id'> & { id?: string }) {
  const supabase = getSupabaseAdminClient()
  const id = payload.id?.trim() || payload.slug.trim() || randomUUID()

  const { data, error } = await supabase
    .from('categories')
    .insert({
      id,
      name: payload.name,
      slug: payload.slug,
      image: payload.image,
      description: payload.description,
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Category
}

export async function updateCategory(id: string, payload: Partial<Category>) {
  const supabase = getSupabaseAdminClient()

  const { data, error } = await supabase
    .from('categories')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Category
}

export async function deleteCategory(id: string) {
  const supabase = getSupabaseAdminClient()

  const { data: category } = await supabase
    .from('categories')
    .select('slug')
    .eq('id', id)
    .single()

  const categorySlug = (category?.slug as string | undefined) ?? id
  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .in('category', [id, categorySlug])

  if (count && count > 0) {
    throw new Error('This category has products. Reassign or delete those products first.')
  }

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) {
    throw new Error(error.message)
  }
}

export async function createProduct(payload: Omit<Product, 'id'> & { id?: string }) {
  const supabase = getSupabaseAdminClient()
  const id = payload.id?.trim() || randomUUID()

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...toDbProduct({ ...payload, id }),
      id,
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return fromDbProduct(data as DbProductRow)
}

export async function updateProduct(id: string, payload: Partial<Product>) {
  const supabase = getSupabaseAdminClient()

  const patch: Partial<DbProductRow> = {}
  if (payload.name !== undefined) patch.name = payload.name
  if (payload.price !== undefined) patch.price = payload.price
  if (payload.originalPrice !== undefined) patch.original_price = payload.originalPrice
  if (payload.description !== undefined) patch.description = payload.description
  if (payload.category !== undefined) patch.category = payload.category
  if (payload.image !== undefined) patch.image = payload.image
  if (payload.rating !== undefined) patch.rating = payload.rating
  if (payload.reviews !== undefined) patch.reviews = payload.reviews
  if (payload.inStock !== undefined) patch.in_stock = payload.inStock
  if (payload.isFeatured !== undefined) patch.is_featured = payload.isFeatured
  if (payload.isBestseller !== undefined) patch.is_bestseller = payload.isBestseller
  if (payload.images !== undefined) patch.images = payload.images
  if (payload.specifications !== undefined) patch.specifications = payload.specifications
  if (payload.keyFeatures !== undefined) patch.key_features = payload.keyFeatures
  if (payload.shippingInfo !== undefined) patch.shipping_info = payload.shippingInfo
  if (payload.returnInfo !== undefined) patch.return_info = payload.returnInfo

  const { data, error } = await supabase
    .from('products')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return fromDbProduct(data as DbProductRow)
}

export async function deleteProduct(id: string) {
  const supabase = getSupabaseAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) {
    throw new Error(error.message)
  }

  const siteData = await getSiteData()
  const nextHomeConfig: HomePageConfig = {
    ...siteData.homeConfig,
    featured: {
      ...siteData.homeConfig.featured,
      productIds: siteData.homeConfig.featured.productIds.filter((item) => item !== id),
    },
    bestSellers: {
      ...siteData.homeConfig.bestSellers,
      productIds: siteData.homeConfig.bestSellers.productIds.filter((item) => item !== id),
    },
    trending: {
      ...siteData.homeConfig.trending,
      productIds: siteData.homeConfig.trending.productIds.filter((item) => item !== id),
    },
  }

  await saveHomeConfig(nextHomeConfig)
}

export async function saveHomeConfig(config: HomePageConfig) {
  const supabase = getSupabaseAdminClient()
  const value = normalizeHomeConfig(config)
  const { error } = await supabase.from('site_config').upsert(
    {
      key: 'homeConfig',
      value,
    },
    { onConflict: 'key' }
  )

  if (error) {
    throw new Error(error.message)
  }

  return value
}

export async function saveProductPageConfig(config: ProductPageConfig) {
  const supabase = getSupabaseAdminClient()
  const value = normalizeProductPageConfig(config)
  const { error } = await supabase.from('site_config').upsert(
    {
      key: 'productPageConfig',
      value,
    },
    { onConflict: 'key' }
  )

  if (error) {
    throw new Error(error.message)
  }

  return value
}

export async function saveNavItems(items: NavItem[]) {
  const supabase = getSupabaseAdminClient()
  const { data: categoriesData } = await supabase.from('categories').select('*').order('name', { ascending: true })
  const categories = ((categoriesData ?? []) as DbCategoryRow[]).map((item) => ({ ...item }))
  const value = normalizeNavItems(items, categories)
  const { error } = await supabase.from('site_config').upsert(
    {
      key: 'navItems',
      value,
    },
    { onConflict: 'key' }
  )

  if (error) {
    throw new Error(error.message)
  }

  return value
}
