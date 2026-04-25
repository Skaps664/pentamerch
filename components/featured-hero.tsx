'use client'

import { useState } from 'react'

interface SimpleHeroProps {
  slides?: string[]
}

export function SimpleHero({ slides = [] }: SimpleHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <section className="bg-white">
      {/* Hero Banner */}
      <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-none md:rounded-lg mx-auto md:max-w-7xl md:mx-auto md:mt-4 md:px-4">
        {/* Background Image */}
        {slides && slides.length > 0 ? (
          <>
            {slides.map((slide, index) => (
              <div
                key={slide}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  backgroundImage: `url(${slide})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
            {/* Slide Indicators */}
            {slides.length > 1 && (
              <div className="absolute z-20 bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-primary/20" />
        )}
      </div>
    </section>
  )
}
