'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface HeroSectionProps {
  title: string
  subtitle?: string
  cta?: {
    text: string
    href: string
  }
  background?: string
  dark?: boolean
  slides?: string[]
}

export function HeroSection({
  title,
  subtitle,
  cta,
  background = 'bg-gradient-to-r from-primary to-primary/80',
  dark = true,
  slides,
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!slides || slides.length < 2) {
      return
    }

    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4500)

    return () => window.clearInterval(interval)
  }, [slides])

  return (
    <section
      className={`relative overflow-hidden py-20 md:py-32 ${slides?.length ? '' : background}`}
    >
      {slides?.length ? (
        <>
          {slides.map((slide, index) => (
            <div
              key={slide}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1
            className={`text-4xl md:text-6xl font-bold mb-6 ${
              dark ? 'text-primary-foreground' : 'text-foreground'
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-lg md:text-xl mb-8 ${
                dark ? 'text-primary-foreground/90' : 'text-foreground/80'
              }`}
            >
              {subtitle}
            </p>
          )}
          {cta && (
            <Link href={cta.href}>
              <button
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:gap-3 ${
                  dark
                    ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                } active:scale-95`}
              >
                {cta.text}
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-20 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />

      {slides && slides.length > 1 ? (
        <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={`hero-dot-${index}`}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to hero slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
