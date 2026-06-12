import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { getDiscountInfo } from '../utils/discountHelpers.js'

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

export default function HomeFeaturedProducts({ products, onViewAll }) {
  // Randomly shuffle and pick 4 products
  const randomProducts = useMemo(() => {
    if (!products || products.length === 0) return []
    const shuffled = shuffleArray(products)
    return shuffled.slice(0, 5)
  }, [products])

  return (
    <section className="bg-transparent">
      <div className="w-full px-0 py-10 sm:py-14">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#FFDA03]">
                Featured Glow Pieces
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-yellow-100/80">
                Unique wooden lamps curated to start your perfect home collection.
              </p>
            </div>
            <button
              onClick={onViewAll}
              className="hidden sm:inline-flex text-xs font-medium text-[#FFDA03] hover:text-yellow-300"
            >
              View all products
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {randomProducts.map((product) => {
              const { hasDiscount, originalPrice, discountedPrice, discountPercent } = getDiscountInfo(product)

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group block overflow-hidden rounded-3xl bg-yellow-50 ring-1 ring-[#FFDA03]/30 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-[#FFDA03]/60 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    {hasDiscount ? (
                      <span className="absolute left-0 top-0 z-10 bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                        -{discountPercent}%
                      </span>
                    ) : null}
                    <img
                      src={product.image}
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
                      <span className="font-semibold text-orange-700">Rs.{formatPricePKR(discountedPrice)}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
