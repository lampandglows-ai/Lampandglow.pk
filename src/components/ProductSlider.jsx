import { useMemo } from 'react'
import { Link } from 'react-router-dom'

export default function ProductSlider({ products, theme = 'light' }) {
  const formatPrice = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return ''
    return new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

  // Remove duplicate products by ID
  const uniqueProducts = useMemo(() => {
    const seen = new Set()
    return products.filter((p) => {
      if (seen.has(p.id)) return false
      seen.add(p.id)
      return true
    })
  }, [products])

  const displayProducts = uniqueProducts.slice(0, 8)

  return (
    <section
      className={
        theme === 'dark'
          ? 'bg-transparent border-y border-white/10'
          : 'bg-white border-y border-stone-200/80'
      }
    >
      <div className="w-full px-0 py-10 sm:py-14">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2
                className={
                  theme === 'dark'
                    ? 'text-xl sm:text-2xl font-semibold tracking-tight text-stone-100'
                    : 'text-xl sm:text-2xl font-semibold tracking-tight text-stone-900'
                }
              >
                Explore our best sellers
              </h2>
              <p className={theme === 'dark' ? 'mt-1 text-xs sm:text-sm text-stone-300' : 'mt-1 text-xs sm:text-sm text-stone-600'}>
                Handpicked decor to start your Lamp &amp; Glow collection.
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayProducts.map((product) => {
              const compareAtPrice = product.compareAtPrice
              const discountPercent = getDiscountPercent(product.price, compareAtPrice)
              const originalPrice =
                typeof compareAtPrice === 'number' ? Math.max(product.price, compareAtPrice) : product.price
              const discountedPrice =
                typeof compareAtPrice === 'number' ? Math.min(product.price, compareAtPrice) : product.price

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group block overflow-hidden rounded-3xl bg-stone-50 ring-1 ring-stone-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-amber-200/70 motion-reduce:transform-none motion-reduce:transition-none"
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
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                    />
                  </div>

                  <div className="px-4 pt-4 pb-3">
                    <h3 className="text-sm font-semibold text-stone-900 leading-snug">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                      {discountPercent !== null ? (
                        <span className="text-stone-700 line-through">
                          Rs.{formatPrice(originalPrice)}
                        </span>
                      ) : null}
                      <span className="font-semibold text-red-600">
                        Rs.{formatPrice(discountedPrice)}
                      </span>
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
