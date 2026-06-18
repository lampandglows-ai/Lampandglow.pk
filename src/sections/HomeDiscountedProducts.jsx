import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Percent } from 'lucide-react'
import { getDiscountInfo } from '../utils/discountHelpers.js'
import { slugify } from '../utils/slugify.js'
import { useHorizontalSlider } from '../hooks/useHorizontalSlider.js'

const formatPricePKR = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return ''
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function HomeDiscountedProducts({ products, onViewAll }) {
  const discounted = useMemo(() => {
    if (!products || products.length === 0) return []
    return products
      .filter((p) => {
        const info = getDiscountInfo(p)
        return (p.isDiscounted === true || info.hasDiscount) && p.status === 'active'
      })
      .slice(0, 5)
  }, [products])

  const { scrollContainerRef, canScrollLeft, canScrollRight, checkScroll, scroll } =
    useHorizontalSlider(discounted.length)

  if (discounted.length === 0) return null

  return (
    <section className="bg-transparent">
      <div className="w-full px-0 py-10 sm:py-14">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
                <span className="inline-flex items-center gap-2">
                  <Percent className="w-6 h-6 text-red-500" />
                  Glow More, Spend Less
                </span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-500">
                Enjoy exclusive discounts on our most-loved wooden creations.
              </p>
            </div>
            <button
              onClick={onViewAll}
              className="hidden sm:inline-flex text-xs font-medium text-[#FFD400] hover:text-[#5A2D0C]"
            >
              View all products
            </button>
          </div>
        </div>

        <div className="relative group min-w-0">
          {/* Left Arrow — desktop only */}
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`hidden sm:flex absolute left-2 sm:left-6 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollLeft
                  ? 'bg-[#F5F1EA]0 hover:bg-[#FFD400] text-white shadow-lg'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow — desktop only */}
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`hidden sm:flex absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollRight
                  ? 'bg-[#F5F1EA]0 hover:bg-[#FFD400] text-white shadow-lg'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="px-4 sm:px-6 lg:px-8">
            <div
              ref={scrollContainerRef}
              className="flex w-full min-w-0 gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              onScroll={checkScroll}
            >
              {discounted.map((product) => {
                const { hasDiscount, originalPrice, discountedPrice, discountPercent } = getDiscountInfo(product)

                return (
                  <Link
                    key={product.id}
                    to={`/products/${slugify(product.name)}`}
                    className="flex-shrink-0 w-[75vw] sm:w-[45vw] md:w-[32vw] lg:w-[calc((100%_-_5rem)/5)] group block overflow-hidden rounded-3xl bg-white ring-1 ring-red-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-red-300 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                      <span className="absolute left-0 top-0 z-10 bg-[#E53935] px-2 py-1 text-xs font-semibold text-white">
                        Sale
                      </span>
                      {hasDiscount ? (
                        <span className="absolute left-0 top-7 z-10 bg-red-800 px-2 py-1 text-xs font-semibold text-white">
                          -{discountPercent}%
                        </span>
                      ) : null}
                      <img
                        src={product.image || (product.images && product.images[0])}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                      />
                    </div>

                    <div className="px-4 pt-4 pb-3">
                      <h3 className="text-sm font-semibold text-stone-900 leading-snug">{product.name}</h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                        {hasDiscount ? (
                          <span className="text-stone-600 line-through">
                            Rs.{formatPricePKR(originalPrice)}
                          </span>
                        ) : null}
                        <span className="font-semibold text-[#E53935]">Rs.{formatPricePKR(discountedPrice)}</span>
                      </div>
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