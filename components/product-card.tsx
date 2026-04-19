'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  badge?: string
}

export function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  reviews,
  badge,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id,
      name,
      price,
      image,
      quantity: 1,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Link href={`/product/${id}`}>
      <div className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-border">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted aspect-square md:aspect-auto md:h-64 flex items-center justify-center">
          <Image
            src={image}
            alt={name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {badge && (
            <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
              {badge}
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-3 left-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 md:p-4 flex flex-col">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'text-accent fill-accent'
                      : 'text-muted fill-muted'
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>

          {/* Price */}
          <div className="mt-auto mb-3 md:mb-4">
            <p className="text-lg md:text-2xl font-bold text-primary">${price.toFixed(2)}</p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isAdded
                ? 'bg-green-500 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdded ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  )
}
