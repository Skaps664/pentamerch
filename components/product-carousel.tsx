'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from './product-card'

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  badge?: string
}

interface ProductCarouselProps {
  title: string
  products: Product[]
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)

      if (window.innerWidth < 1536) {
        setItemsPerView(3)
      } else {
        setItemsPerView(4)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const totalSlides = Math.ceil(products.length / itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const displayedProducts = isDesktop
    ? products.slice(
        currentIndex * itemsPerView,
        (currentIndex + 1) * itemsPerView
      )
    : products

  useEffect(() => {
    setCurrentIndex(0)
  }, [itemsPerView, products.length, isDesktop])

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h2>
          {isDesktop ? (
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Swipe</p>
          )}
        </div>

        {/* Carousel */}
        {isDesktop ? (
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        ) : (
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4 snap-x snap-mandatory touch-pan-x">
              {displayedProducts.map((product) => (
                <div key={product.id} className="snap-start min-w-[72%] sm:min-w-[42%]">
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Indicators */}
        {isDesktop ? (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-border w-2 hover:bg-muted-foreground'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
