import { Link } from 'react-router-dom'
import { ShoppingCart, Heart } from 'lucide-react'
import { getDiscountInfo } from '../utils/discountHelpers.js'
import { slugify } from '../utils/slugify.js'

const formatPricePKR = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return ''
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist }) {
  const { hasDiscount, originalPrice, discountedPrice, discountPercent } = getDiscountInfo(product)
  const inWishlist = isInWishlist ? isInWishlist(product.id) : false

  return (
    <Link
      to={`/products/${slugify(product.name)}`}
      className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-[#FFD400]/30/70 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        {product.isNewArrival && (
          <span className="absolute left-0 top-0 z-10 bg-[#5A2D0C] px-2 py-1 text-xs font-semibold text-white">
            New Arrival
          </span>
        )}
        {hasDiscount ? (
          <span
            className={`absolute left-0 z-10 bg-[#E53935] px-2 py-1 text-xs font-semibold text-white ${
              product.isNewArrival ? 'top-7' : 'top-0'
            }`}
          >
            -{discountPercent}%
          </span>
        ) : null}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
          loading="lazy"
        />

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onAddToCart && onAddToCart(product)
          }}
          className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2 bg-stone-900/90 text-white text-xs sm:text-sm font-semibold py-2.5 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-[#5A2D0C] motion-reduce:transition-none"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>

      <div className="px-4 pt-4 pb-3">
        <h3 className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2 min-h-10">{product.name}</h3>

        <div className="mt-2 flex min-h-7 items-center justify-between gap-2 text-sm">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {hasDiscount ? (
              <span className="text-stone-600 line-through">
                Rs.{formatPricePKR(originalPrice)}
              </span>
            ) : null}
            <span className="font-semibold text-orange-700">Rs.{formatPricePKR(discountedPrice)}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleWishlist && onToggleWishlist(product)
            }}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className="flex-shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${inWishlist ? 'text-red-500' : 'text-stone-400 hover:text-red-400'}`}
              fill={inWishlist ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>
    </Link>
  )
}
