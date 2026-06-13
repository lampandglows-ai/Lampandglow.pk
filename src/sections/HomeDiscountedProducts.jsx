import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { getDiscountInfo } from '../utils/discountHelpers.js'
import { Percent } from 'lucide-react'

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

  if (discounted.length === 0) return null

  return (
    <section className="bg-transparent">
      <div className="w-full px-0 py-10 sm:py-14">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#FFDA03]">
                <span className="inline-flex items-center gap-2">
                  <Percent className="w-6 h-6 text-red-500" />
                  Glow More, Spend Less
                </span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-yellow-100/85">
                Enjoy exclusive discounts on our most-loved wooden creations.
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
          <div className="flex gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible">
            {discounted.map((product) => {
              const { hasDiscount, originalPrice, discountedPrice, discountPercent } = getDiscountInfo(product)

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex-shrink-0 w-screen sm:w-auto group block overflow-hidden rounded-3xl bg-white ring-1 ring-red-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-red-300 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                    <span className="absolute left-0 top-0 z-10 bg-red-600 px-2 py-1 text-xs font-semibold text-white">
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
                      <span className="font-semibold text-red-600">Rs.{formatPricePKR(discountedPrice)}</span>
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
