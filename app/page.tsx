import { HeroSection } from '@/components/hero-section'
import { ProductCarousel } from '@/components/product-carousel'
import { CategoryCard } from '@/components/category-card'
import { products, categories } from '@/lib/data'
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react'

export default function Home() {
  // Get featured products (first 8)
  const featuredProducts = products.slice(0, 8)

  // Get bestsellers (items with high ratings)
  const bestsellerProducts = products
    .filter((p) => p.rating >= 4.5)
    .slice(0, 8)

  // Get more products (items 8-15)
  const moreProducts = products.slice(8, 16)

  const heroSlides = [
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1600&h=900&fit=crop',
  ]

  const trustHighlights = [
    {
      title: 'Fast UK Delivery',
      description: 'Tracked shipping from our UK distribution partners.',
      kicker: 'Tracked & Reliable',
      icon: Truck,
    },
    {
      title: 'Secure Checkout',
      description: 'Trusted card processing and encrypted payments.',
      kicker: 'Encrypted Payments',
      icon: ShieldCheck,
    },
    {
      title: 'Easy Returns',
      description: 'Straightforward returns under UK consumer law.',
      kicker: 'Clear Return Windows',
      icon: RotateCcw,
    },
    {
      title: 'Friendly Support',
      description: 'Help from the PentaMerch customer care team.',
      kicker: 'Human Help, Fast',
      icon: Headphones,
    },
  ]

  return (
    <>
      {/* Main Hero */}
      <HeroSection
        title="Welcome to PentaMerch"
        subtitle="Premium products for modern UK shoppers across electronics, fashion, home, beauty and more."
        cta={{ text: 'Shop Now', href: '/products' }}
        slides={heroSlides}
        dark={true}
      />

      {/* Featured Products Carousel */}
      <ProductCarousel title="Featured Products" products={featuredProducts} />

      {/* Banner */}
      <HeroSection
        title="Mid-Season Essentials"
        subtitle="Refresh your cart with curated picks and limited-time savings across top categories."
        cta={{ text: 'Shop Collections', href: '/products' }}
        background="bg-gradient-to-r from-primary to-primary/80"
        dark={true}
      />

      {/* Bestseller Products */}
      <ProductCarousel
        title="Best Sellers"
        products={bestsellerProducts}
      />

      {/* Why UK Shoppers Select */}
      <section className="border-y border-border/60 py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
              <p className="text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                Shop With Confidence
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-1">
                Why UK Shoppers Select PentaMerch
              </h2>
            </div>
            <p className="hidden lg:block text-sm text-muted-foreground max-w-sm text-right">
              Clear policies, secure payments, and dependable delivery from a UK-first ecommerce experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {trustHighlights.map((item) => {
              const Icon = item.icon

              return (
                <article
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-sm hover:shadow-md hover:border-foreground/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-muted text-foreground flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.kicker}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                slug={category.slug}
                image={category.image}
                itemCount={products.filter((p) => p.category === category.slug)
                  .length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <HeroSection
        title="Limited Time Offer"
        subtitle="Get up to 40% off on selected items. Don't miss out!"
        cta={{ text: 'Shop Sale', href: '/products' }}
        background="bg-gradient-to-r from-accent to-accent/80"
        dark={true}
      />

      {/* More Products */}
      <ProductCarousel
        title="Trending Now"
        products={moreProducts}
      />
    </>
  )
}
