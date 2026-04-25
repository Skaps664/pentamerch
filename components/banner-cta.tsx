'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface BannerCardProps {
  title: string
  subtitle?: string
  ctaText: string
  ctaHref: string
  image?: string
  background?: string
  imagePosition?: 'left' | 'right'
}

export function BannerCard({
  title,
  subtitle,
  ctaText,
  ctaHref,
  image,
  background = 'bg-gradient-to-r from-primary/80 to-primary/60',
  imagePosition = 'left',
}: BannerCardProps) {
  const contentCol = (
    <div className="flex flex-col justify-center space-y-4">
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {title}
        </h3>
        {subtitle && (
          <p className="text-base md:text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      <Link href={ctaHref} className="w-fit">
        <button className="inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 active:scale-95 hover:gap-3">
          {ctaText}
          <ArrowRight className="w-5 h-5" />
        </button>
      </Link>
    </div>
  )

  const imageCol = image ? (
    <div className="relative h-48 md:h-56 rounded-lg overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>
  ) : (
    <div className={`h-48 md:h-56 rounded-lg ${background}`} />
  )

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-border rounded-lg p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300`}>
          {imagePosition === 'left' ? (
            <>
              {imageCol}
              {contentCol}
            </>
          ) : (
            <>
              {contentCol}
              {imageCol}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
