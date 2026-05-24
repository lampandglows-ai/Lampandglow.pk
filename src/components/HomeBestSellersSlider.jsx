import { useRef, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HomeBestSellersSlider({ products = [], theme = 'light' }) {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const formatPrice = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return ''
    return new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getDiscountPercent = (price, compareAtPrice) => {
    if (typeof price !== 'number' || Number.isNaN(price)) return null
    if (typeof compareAtPrice !== 'number' || Number.isNaN(compareAtPrice)) return null

    const original = Math.max(price, compareAtPrice)
    const discounted = Math.min(price, compareAtPrice)
    if (original <= 0 || discounted <= 0 || original === discounted) return null
    if (original <= discounted) return null

    return Math.round(((original - discounted) / original) * 100)
  }

  // Remove duplicate products and get first 12
  const uniqueProducts = useMemo(() => {
    const seen = new Set()
    return products
      .filter((p) => {
        if (seen.has(p.id)) return false
        seen.add(p.id)
        return true
      })
      .slice(0, 12)
  }, [products])

  // Check scroll position on mount and when content changes
  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [uniqueProducts])

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })

      // Update button states after scroll
      setTimeout(checkScroll, 300)
    }
  }

  if (uniqueProducts.length === 0) {
    return null
  }

  return (
    <section
      className={
        theme === 'dark'
          ? 'bg-transparent border-b border-white/10'
          : 'bg-white border-b border-stone-200/80'
      }
    >
      <div className="w-full px-0 py-10 sm:py-14">
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <h2
            className={
              theme === 'dark'
                ? 'text-xl sm:text-2xl font-semibold tracking-tight text-stone-100'
                : 'text-xl sm:text-2xl font-semibold tracking-tight text-stone-900'
            }
          >
            Explore our best sellers
          </h2>
          <p
            className={
              theme === 'dark'
                ? 'mt-1 text-xs sm:text-sm text-stone-300'
                : 'mt-1 text-xs sm:text-sm text-stone-600'
            }
          >
            Handpicked decor to start your Lamp & Glow collection.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollLeft
                ? 'bg-white/90 hover:bg-white text-orange-500 hover:text-orange-600 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } opacity-0 group-hover:opacity-100 md:opacity-100`}
            title="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollRight
                ? 'bg-white/90 hover:bg-white text-orange-500 hover:text-orange-600 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } opacity-0 group-hover:opacity-100 md:opacity-100`}
            title="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Products Container */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scroll-smooth"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              onScroll={checkScroll}
            >
              {uniqueProducts.map((product) => {
                const compareAtPrice = product.compareAtPrice
                const discountPercent = getDiscountPercent(product.price, compareAtPrice)
                const originalPrice =
                  typeof compareAtPrice === 'number'
                    ? Math.max(product.price, compareAtPrice)
                    : product.price
                const discountedPrice =
                  typeof compareAtPrice === 'number'
                    ? Math.min(product.price, compareAtPrice)
                    : product.price

                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex-shrink-0 w-48 group block overflow-hidden rounded-2xl bg-stone-50 ring-1 ring-stone-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-amber-200/70"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                      {discountPercent !== null ? (
                        <span className="absolute left-0 top-0 z-10 bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                          -{discountPercent}%
                        </span>
                      ) : null}
                      <img
                        src={product.image || (product.images && product.images[0])}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                        {discountPercent !== null ? (
                          <span className="text-stone-500 line-through text-xs">
                            Rs.{formatPrice(originalPrice)}
                          </span>
                        ) : null}
                        <span className="font-bold text-orange-600">Rs.{formatPrice(discountedPrice)}</span>
                      </div>

                      {product.description && (
                        <p className="mt-1 text-xs text-stone-600 line-clamp-1">{product.description}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
