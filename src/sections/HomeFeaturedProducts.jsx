import { useMemo, useRef } from 'react'
import Slider from 'react-slick'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ProductCard from '../components/ProductCard.jsx'

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function HomeFeaturedProducts({ products, onViewAll, onAddToCart, onToggleWishlist, isInWishlist }) {
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
      { breakpoint: 640, settings: { slidesToShow: 1 } },
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
              {randomProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    isInWishlist={isInWishlist}
                  />
                </div>
              ))}
          </Slider>
          </div>
        </div>
      </div>
    </section>
  )
}
