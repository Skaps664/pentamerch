'use client'

import { HeroSection } from '@/components/hero-section'
import { ProductCarousel } from '@/components/product-carousel'
import { CategoryCard } from '@/components/category-card'
import { useSiteData } from '@/lib/site-data-context'
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react'

export default function Home() {
  const { products, categories, homeConfig } = useSiteData()

  const pickProducts = (ids: string[], fallback: typeof products) => {
    const selected = ids
      .map((id) => products.find((item) => item.id === id))
      .filter((item): item is (typeof products)[number] => Boolean(item))

    return selected.length > 0 ? selected : fallback
  }

  const featuredProducts = pickProducts(
    homeConfig.featured.productIds,
    products.slice(0, 8)
  )
  const bestsellerProducts = pickProducts(
    homeConfig.bestSellers.productIds,
    products.filter((item) => item.isBestseller).slice(0, 8)
  )
  const trendingProducts = pickProducts(
    homeConfig.trending.productIds,
    products.slice(8, 16)
  )

  const trustHighlights = [
    {
      title: 'Fast Delivery',
      description: 'Tracked shipping through trusted fulfilment partners.',
      kicker: 'Reliable Fulfilment',
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
      description: 'Straightforward return process with clear timelines.',
      kicker: 'Clear Return Policy',
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
      {homeConfig.hero.enabled ? (
        <HeroSection
          title={homeConfig.hero.title}
          subtitle={homeConfig.hero.subtitle}
          cta={{ text: homeConfig.hero.ctaText, href: homeConfig.hero.ctaHref }}
          slides={homeConfig.hero.slides}
          dark={true}
        />
      ) : null}

      {homeConfig.featured.enabled && featuredProducts.length > 0 ? (
        <ProductCarousel title={homeConfig.featured.title} products={featuredProducts} />
      ) : null}

      {homeConfig.bannerOne.enabled ? (
        <HeroSection
          title={homeConfig.bannerOne.title}
          subtitle={homeConfig.bannerOne.subtitle}
          cta={{ text: homeConfig.bannerOne.ctaText, href: homeConfig.bannerOne.ctaHref }}
          slides={homeConfig.bannerOne.image ? [homeConfig.bannerOne.image] : undefined}
          background={homeConfig.bannerOne.background}
          dark={true}
        />
      ) : null}

      {homeConfig.bestSellers.enabled && bestsellerProducts.length > 0 ? (
        <ProductCarousel
          title={homeConfig.bestSellers.title}
          products={bestsellerProducts}
        />
      ) : null}

      {homeConfig.trust.enabled ? (
        <section className="border-y border-border/60 py-12 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-6 md:mb-8">
              <div>
                <p className="text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                  {homeConfig.trust.eyebrow}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-1">
                  {homeConfig.trust.title}
                </h2>
              </div>
              <p className="hidden lg:block text-sm text-muted-foreground max-w-sm text-right">
                {homeConfig.trust.subtitle}
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
      ) : null}

      {homeConfig.categories.enabled ? (
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
              {homeConfig.categories.title}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.slug}
                  name={category.name}
                  slug={category.slug}
                  image={category.image}
                  itemCount={products.filter((p) => p.category === category.slug || p.category === category.id).length}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {homeConfig.bannerTwo.enabled ? (
        <HeroSection
          title={homeConfig.bannerTwo.title}
          subtitle={homeConfig.bannerTwo.subtitle}
          cta={{ text: homeConfig.bannerTwo.ctaText, href: homeConfig.bannerTwo.ctaHref }}
          slides={homeConfig.bannerTwo.image ? [homeConfig.bannerTwo.image] : undefined}
          background={homeConfig.bannerTwo.background}
          dark={true}
        />
      ) : null}

      {homeConfig.trending.enabled && trendingProducts.length > 0 ? (
        <ProductCarousel
          title={homeConfig.trending.title}
          products={trendingProducts}
        />
      ) : null}
    </>
  )
}
