import { useRef, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getDiscountInfo } from '../utils/discountHelpers.js'

export default function HomeBestSellersSlider({ products = [] }) {
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

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [uniqueProducts])

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
      setTimeout(checkScroll, 300)
    }
  }

  if (uniqueProducts.length === 0) {
    return null
  }

  return (
    <section className="bg-transparent">
      <div className="w-full px-0 py-10 sm:py-14">
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#FFDA03]">
            Illuminate Your Home with Timeless Craftsmanship
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-yellow-100/85">
          Explore our most-loved wooden lamps, crafted to light up your moments.
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
                ? 'bg-[#FFDA03] hover:bg-yellow-300 text-[#4C2600] shadow-lg'
                : 'bg-[#FFDA03]/30 text-yellow-100/60 cursor-not-allowed'
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
                ? 'bg-[#FFDA03] hover:bg-yellow-300 text-[#4C2600] shadow-lg'
                : 'bg-[#FFDA03]/30 text-yellow-100/60 cursor-not-allowed'
            } opacity-0 group-hover:opacity-100 md:opacity-100`}
            title="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Products Container */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
              onScroll={checkScroll}
            >
              {uniqueProducts.map((product) => {
                const { hasDiscount, originalPrice, discountedPrice } = getDiscountInfo(product)

                return (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex-shrink-0 w-[46vw] sm:w-[33vw] md:w-[30vw] lg:w-[calc((100%_-_5rem)/5)] group block overflow-hidden rounded-2xl sm:rounded-3xl bg-yellow-50 ring-1 ring-[#FFDA03]/45 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-[#FFDA03]"
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