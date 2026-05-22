import { Link } from 'react-router-dom'
import classNames from '../utils/classNames.js'

const formatPricePKR = (value) => {
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

export default function ProductsSection({
  categories,
  filteredProducts,
  productAverageRating,
  selectedCategory,
  setSelectedCategory,
  handleAddToCart,
  handleNavigate,
  setReviewForm,
}) {
  return (
    <section className="w-full px-0 py-10 sm:py-14">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
              Products
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl">
              Choose from our selection of wooden lamps, tables, and decor pieces. Add items to your
              cart to view a summary and checkout.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-600">Filter:</span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={classNames(
                'rounded-full border px-3 py-1',
                selectedCategory === 'All'
                  ? 'border-amber-500 bg-amber-50 text-amber-800'
                  : 'border-stone-200 bg-white text-stone-700',
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={classNames(
                  'rounded-full border px-3 py-1',
                  selectedCategory === category.id
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-stone-200 bg-white text-stone-700',
                )}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const avg = productAverageRating[product.id]
          const compareAtPrice = product.compareAtPrice
          const discountPercent = getDiscountPercent(product.price, compareAtPrice)
          const originalPrice =
            typeof compareAtPrice === 'number' ? Math.max(product.price, compareAtPrice) : product.price
          const discountedPrice =
            typeof compareAtPrice === 'number' ? Math.min(product.price, compareAtPrice) : product.price

          return (
            <article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-3xl bg-stone-50 ring-1 ring-stone-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-amber-200/70 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <Link to={`/product/${product.id}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                  {discountPercent !== null ? (
                    <span className="absolute left-0 top-0 z-10 bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                      -{discountPercent}%
                    </span>
                  ) : null}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                  />

                  {avg ? (
                    <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[11px] font-medium text-amber-100 backdrop-blur">
                      <span className="text-amber-300">★</span> {avg.toFixed(1)}
                    </div>
                  ) : null}
                </div>

                <div className="px-4 pt-4 pb-3">
                  <h2 className="text-sm font-semibold text-stone-900 leading-snug">
                    {product.name}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    {discountPercent !== null ? (
                      <span className="text-stone-700 line-through">
                        Rs.{formatPricePKR(originalPrice)}
                      </span>
                    ) : null}
                    <span className="font-semibold text-red-600">Rs.{formatPricePKR(discountedPrice)}</span>
                  </div>
                </div>
              </Link>

              <div className="relative z-20 mt-2 px-4 pb-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-amber-700 hover:shadow-sm active:scale-[0.98] motion-reduce:transform-none"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    setReviewForm((prev) => ({
                      ...prev,
                      productId: product.id,
                    }))
                    handleNavigate('reviews')
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-3 py-1.5 text-[11px] font-medium text-stone-700 transition-all duration-200 hover:bg-stone-50 hover:shadow-sm active:scale-[0.98] motion-reduce:transform-none"
                >
                  View Reviews
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
