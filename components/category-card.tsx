import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  name: string
  slug: string
  image: string
  itemCount: number
}

export function CategoryCard({ name, slug, image, itemCount }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${slug}`}>
      <div className="group relative overflow-hidden rounded-lg aspect-square sm:aspect-auto sm:h-56 md:h-72 cursor-pointer">
        {/* Background Image */}
        <Image
          src={image}
          alt={name}
          fill
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2">
            {name}
          </h3>
          <p className="text-white/80 text-sm mb-4">{itemCount} products</p>
          <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all duration-300">
            <span className="font-semibold">Shop Now</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}
