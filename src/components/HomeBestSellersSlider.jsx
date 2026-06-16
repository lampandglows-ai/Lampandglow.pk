import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getDiscountInfo } from '../utils/discountHelpers.js'
import { slugify } from '../utils/slugify.js'
import { useHorizontalSlider } from '../hooks/useHorizontalSlider.js'

export default function HomeBestSellersSlider({ products = [] }) {

  const formatPrice = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return ''
    return new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Remove duplicates, exclude new arrivals and discounted products, get first 12
  const uniqueProducts = useMemo(() => {
    const seen = new Set()
    return products.filter((p) => {
      if (seen.has(p.id)) return false
      seen.add(p.id)
      const info = getDiscountInfo(p)
      return (
        p.status === 'active' &&
        p.isNewArrival !== true &&
        p.isDiscounted !== true &&
        !info.hasDiscount
      )
    }).slice(0, 12)
  }, [products])

  const { scrollContainerRef, canScrollLeft, canScrollRight, checkScroll, scroll } =
    useHorizontalSlider(uniqueProducts.length)

  if (uniqueProducts.length === 0) {
    return null
  }

  return (
    <section className="bg-transparent">
      <div className="w-full px-0 py-10 sm:py-14">
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
            Illuminate Your Home with Timeless Craftsmanship
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-500">
          Explore our most-loved wooden lamps, crafted to light up your moments.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative group min-w-0">
          {/* Left Arrow — desktop only */}
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`hidden sm:flex absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollLeft
                ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow — desktop only */}
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`hidden sm:flex absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollRight
                ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Products Container */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div
              ref={scrollContainerRef}
              className="flex w-full min-w-0 gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              onScroll={checkScroll}
            >
              {uniqueProducts.map((product) => {
                const { hasDiscount, originalPrice, discountedPrice } = getDiscountInfo(product)

                return (
                  <Link
                    key={product.id}
                    to={`/products/${slugify(product.name)}`}
                    className="flex-shrink-0 w-[75vw] sm:w-[45vw] md:w-[32vw] lg:w-[calc((100%_-_5rem)/5)] group block overflow-hidden rounded-2xl sm:rounded-3xl bg-white ring-1 ring-stone-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-amber-200/70"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                      {product.isNewArrival && (
                        <span className="absolute left-0 top-0 z-10 bg-amber-500 px-2 py-1 text-xs font-semibold text-white">
                          New
                        </span>
                      )}
                      <img
                        src={product.image || (product.images && product.images[0])}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
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