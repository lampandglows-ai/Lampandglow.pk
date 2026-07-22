import { Link } from 'react-router-dom'
import { useMemo, useRef } from 'react'
import Slider from 'react-slick'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { getDiscountInfo } from '../utils/discountHelpers.js'
import { slugify } from '../utils/slugify.js'

const formatPricePKR = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return ''
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function HomeFeaturedProducts({ products, onViewAll, onAddToCart }) {
  const sliderRef = useRef(null)

  // Randomly shuffle and pick a wider pool so the auto-scroll loop has variety
  const randomProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    const shuffled = shuffleArray(products)
    return shuffled.slice(0, 12)
  }, [products])

  const canLoop = randomProducts.length > 4

  const settings = {
    dots: false,
    arrows: false,
    infinite: canLoop,
    autoplay: canLoop,
    autoplaySpeed: 2200,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    pauseOnHover: true,
    swipe: true,
    touchMove: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  }

  if (randomProducts.length === 0) return null

  return (
    <section className="bg-transparent">
      <style>{`
        .featured-glow-slider .slick-list {
          margin: 0 -0.5rem;
        }
        @media (min-width: 640px) {
          .featured-glow-slider .slick-list {
            margin: 0 -0.625rem;
          }
        }
        .featured-glow-slider .slick-slide > div {
          padding: 0 0.5rem;
        }
        @media (min-width: 640px) {
          .featured-glow-slider .slick-slide > div {
            padding: 0 0.625rem;
          }
        }
      `}</style>

      <div className="w-full px-0 py-10 sm:py-14">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center relative mb-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
                Light Up Your Space
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-500">
                Unique wooden lamps curated to start your perfect home collection.
              </p>
            </div>
            <button
              onClick={onViewAll}
              className="hidden sm:inline-flex absolute right-0 text-xs font-medium text-[#ffa200] hover:text-[#5A2D0C]"
            >
              View all products
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Left Arrow — desktop only */}
          <button
            type="button"
            onClick={() => sliderRef.current?.slickPrev()}
            aria-label="Previous products"
            className="hidden sm:flex absolute left-2 sm:left-3 top-[38%] -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md ring-1 ring-stone-200 text-stone-700 hover:text-[#FFD400] hover:shadow-lg transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow — desktop only */}
          <button
            type="button"
            onClick={() => sliderRef.current?.slickNext()}
            aria-label="Next products"
            className="hidden sm:flex absolute right-2 sm:right-3 top-[38%] -translate-y-1/2 z-20 p-2 rounded-full bg-white shadow-md ring-1 ring-stone-200 text-stone-700 hover:text-[#FFD400] hover:shadow-lg transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="featured-glow-slider px-4 sm:px-6 lg:px-8">
            <Slider ref={sliderRef} {...settings}>
              {randomProducts.map((product) => {
              const { hasDiscount, originalPrice, discountedPrice, discountPercent } = getDiscountInfo(product)

              return (
                <div key={product.id}>
                  <Link
                    to={`/products/${slugify(product.name)}`}
                    className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-[#FFD400]/30/70 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                      {hasDiscount ? (
                        <span className="absolute left-0 top-0 z-10 bg-[#E53935] px-2 py-1 text-xs font-semibold text-white">
                          -{discountPercent}%
                        </span>
                      ) : null}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
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
                      <h3 className="text-sm font-semibold text-stone-900 leading-snug">{product.name}</h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                        {hasDiscount ? (
                          <span className="text-stone-600 line-through">
                            Rs.{formatPricePKR(originalPrice)}
                          </span>
                        ) : null}
                        <span className="font-semibold text-orange-700">Rs.{formatPricePKR(discountedPrice)}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </Slider>
          </div>
        </div>
      </div>
    </section>
  )
}
