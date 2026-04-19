'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import {
  Heart,
  ShoppingCart,
  Truck,
  RotateCcw,
  Shield,
  CheckCircle2,
  PackageCheck,
  Clock3,
  ArrowRight,
} from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { ProductCard } from '@/components/product-card'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSiteData } from '@/lib/site-data-context'

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const { products, productPageConfig } = useSiteData()
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const product = products.find((p) => p.id === productId)
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const galleryImages = useMemo(() => {
    const merged = [product.image, ...(product.images ?? [])].filter(Boolean)
    return Array.from(new Set(merged))
  }, [product])

  useEffect(() => {
    setSelectedImage(galleryImages[0] ?? product.image)
  }, [galleryImages, product.image])

  const specs = Object.entries(product.specifications ?? {})
  const keyFeatures =
    (product.keyFeatures ?? []).length > 0
      ? (product.keyFeatures ?? [])
      : specs.length > 0
      ? specs.slice(0, 5).map(([key, value]) => `${key}: ${value}`)
      : [
          'Built for daily performance and long-term reliability.',
          'Quality-checked to meet PentaMerch UK standards.',
          'Suitable for home, office, and personal use.',
          'Backed by responsive customer support.',
        ]

  const shippingInfo =
    (product.shippingInfo ?? []).length > 0
      ? (product.shippingInfo ?? [])
      : [
          'Dispatch from UK partner facilities on working days.',
          'Standard delivery within 2-5 working days in the UK.',
          'Order updates and tracking details sent by email.',
        ]

  const returnInfo =
    (product.returnInfo ?? []).length > 0
      ? (product.returnInfo ?? [])
      : [
          '30-day return policy for unused items in original condition.',
          'Secure checkout and transaction monitoring.',
          'UK customer support team available for post-purchase assistance.',
        ]

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-6 space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-border bg-muted h-[340px] sm:h-[420px] lg:h-[520px] max-w-[560px] mx-auto">
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
            </div>

            {galleryImages.length > 1 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {galleryImages.map((image) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`relative aspect-square overflow-hidden rounded-lg border transition-colors ${
                      selectedImage === image ? 'border-primary' : 'border-border hover:border-foreground/30'
                    }`}
                  >
                    <Image src={image} alt={product.name} fill className="object-cover" sizes="120px" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {product.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">Category: {product.category}</p>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-accent fill-accent'
                        : 'text-muted fill-muted'
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-semibold text-foreground">
                {product.rating}
              </span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-3 mb-2">
                  <p className="text-4xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
                  {product.originalPrice ? (
                    <p className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</p>
                  ) : null}
                </div>

                {discountPercent > 0 ? (
                  <p className="text-sm font-medium text-green-700">Save {discountPercent}% compared with list price</p>
                ) : null}

                <p className="text-sm mt-1 text-muted-foreground">
                  Stock status: <span className="font-medium text-foreground">{product.inStock ? 'In stock' : 'Out of stock'}</span>
                </p>
              </div>

              <div className="rounded-lg bg-muted/60 border border-border p-4 mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {keyFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-700 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-x border-border bg-transparent"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-3 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  isAdded
                    ? 'bg-green-500 text-white'
                    : product.inStock
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isAdded ? 'Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-border">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">UK Tracked Delivery</h4>
                    <p className="text-xs text-muted-foreground">1-3 working days on most orders</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Easy Returns</h4>
                    <p className="text-xs text-muted-foreground">30-day return window</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Secure Checkout</h4>
                    <p className="text-xs text-muted-foreground">Encrypted payment processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8 space-y-6">
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">Product Description</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Specifications</h2>
              {specs.length > 0 ? (
                <div className="space-y-2">
                  {specs.map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-4 border-b border-border/70 pb-2 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-foreground">{key}</p>
                      <p className="text-sm text-muted-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Detailed specifications will appear here when configured in admin.</p>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <section className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-lg font-semibold text-foreground mb-3">Shipping Information</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {shippingInfo.map((line, index) => (
                  <li key={`${line}-${index}`} className="flex items-start gap-2">
                    {index === 0 ? (
                      <PackageCheck className="w-4 h-4 mt-0.5 text-primary" />
                    ) : index === 1 ? (
                      <Truck className="w-4 h-4 mt-0.5 text-primary" />
                    ) : (
                      <Clock3 className="w-4 h-4 mt-0.5 text-primary" />
                    )}
                    {line}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-lg font-semibold text-foreground mb-3">Returns & Buyer Protection</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {returnInfo.map((line, index) => (
                  <li key={`${line}-${index}`} className="flex items-start gap-2">
                    {index === 0 ? (
                      <RotateCcw className="w-4 h-4 mt-0.5 text-primary" />
                    ) : index === 1 ? (
                      <Shield className="w-4 h-4 mt-0.5 text-primary" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                    )}
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        {productPageConfig.detailBanner.enabled ? (
          <section className="mb-14">
            <div className="relative overflow-hidden rounded-xl border border-border min-h-[220px] md:min-h-[260px]">
              {productPageConfig.detailBanner.image ? (
                <Image
                  src={productPageConfig.detailBanner.image}
                  alt={productPageConfig.detailBanner.title || 'Promotional banner'}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700" />
              )}

              <div className="absolute inset-0 bg-black/45" />

              <div className="relative z-10 p-6 md:p-10 max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {productPageConfig.detailBanner.title || 'Explore more from this collection'}
                </h2>
                <p className="text-white/90 text-sm md:text-base mb-6">
                  {productPageConfig.detailBanner.text || 'Discover more options selected for UK shoppers.'}
                </p>
                <Link
                  href={productPageConfig.detailBanner.linkHref || '/products'}
                  className="inline-flex items-center gap-2 rounded-md bg-white text-slate-900 px-5 py-2.5 text-sm font-semibold hover:bg-slate-100"
                >
                  {productPageConfig.detailBanner.linkText || 'Shop More'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <ProductCard
                  key={related.id}
                  {...related}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
