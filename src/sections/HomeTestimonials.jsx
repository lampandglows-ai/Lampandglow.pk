const AVATAR_COLORS = [
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-orange-100 text-orange-700',
]

const TILTS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-0', '-rotate-3']

function getInitials(name) {
  if (!name || !name.trim()) return '?'
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function getAvatarColor(name) {
  const seed = (name || '?').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[seed % AVATAR_COLORS.length]
}

function getRelativeTime(dateString) {
  const date = new Date(dateString)
  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'Just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`
  const diffWeek = Math.floor(diffDay / 7)
  if (diffWeek < 5) return `${diffWeek} week${diffWeek !== 1 ? 's' : ''} ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function isNew(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  return diffMs < 7 * 24 * 60 * 60 * 1000
}

export default function HomeTestimonials({ products, reviews }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#F5F1EA]">
      <div className="rounded-3xl border border-[#E5E5E5] bg-white shadow-sm overflow-hidden">
        <div className="relative px-5 sm:px-8 py-6 sm:py-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F1EA] via-white to-[#F5F1EA]" />
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
                Reviews & Ratings
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-xl">
                Share your experience with Lamp & Glow products and explore what other customers are saying.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-8 pb-8">
          {reviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-6 text-xs sm:text-sm text-stone-600">
              <p>No reviews yet. Be the first to share your Lamp & Glow experience.</p>
            </div>
          ) : (
            <ul className="py-2">
              {reviews.map((review, index) => {
                const product = products.find((p) => p.id === review.productId)
                const tilt = TILTS[index % TILTS.length]
                const initials = getInitials(review.name)
                const avatarColor = getAvatarColor(review.name)
                const showNew = isNew(review.createdAt)
                const reviewerCount = reviews.filter((r) => r.name === review.name).length

                return (
                  <li
                    key={review.id}
                    style={{ zIndex: index + 1 }}
                    className={`group relative ${index === 0 ? '' : '-mt-4'} ${tilt} rounded-3xl border border-stone-200 bg-white p-5 text-xs sm:text-sm shadow-sm transition-all duration-300 hover:rotate-0 hover:-translate-y-1 hover:shadow-lg hover:z-50 motion-reduce:transform-none motion-reduce:transition-none`}
                  >
                    {/* decorative report-style marker, like a verified-listing icon */}
                    <span className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full border border-stone-300 text-[10px] font-semibold text-stone-400">
                      !
                    </span>

                    <div className="flex items-start gap-3 pr-6">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor}`}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-blue-700 truncate">
                          {review.name || 'Anonymous'}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {reviewerCount} review{reviewerCount !== 1 ? 's' : ''} · 0 photos
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[#FFD400] text-sm leading-none">
                        {'★'.repeat(review.rating)}
                        <span className="text-stone-300">{'★'.repeat(5 - review.rating)}</span>
                      </span>
                      <span className="text-[11px] text-stone-500">{getRelativeTime(review.createdAt)}</span>
                      {showNew && (
                        <span className="inline-flex items-center rounded-md border border-stone-300 px-1.5 py-0.5 text-[10px] font-semibold text-stone-600">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs sm:text-sm text-stone-700">{review.comment}</p>

                    {product?.name && (
                      <div className="mt-3 pt-3 border-t border-stone-100">
                        <p className="text-[11px] font-semibold text-stone-700">Product</p>
                        <p className="text-[11px] text-stone-500">{product.name}</p>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}