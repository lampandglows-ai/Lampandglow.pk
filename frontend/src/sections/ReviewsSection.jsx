export default function ReviewsSection({
  products,
  reviewForm,
  reviewSortBy,
  setReviewForm,
  setReviewSortBy,
  sortedReviews,
  handleSubmitReview,
}) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="rounded-3xl border border-stone-200/70 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="relative px-5 sm:px-8 py-6 sm:py-8">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-white to-amber-50" />
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
                Reviews &amp; Ratings
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-xl">
                Share your experience with Lamp &amp; Glow products and explore what other customers are saying.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-600">Sort by:</span>
              <select
                value={reviewSortBy}
                onChange={(e) => setReviewSortBy(e.target.value)}
                className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="recent">Most recent</option>
                <option value="rating">Highest rating</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1.8fr] gap-6 items-start">
            <form
              onSubmit={handleSubmitReview}
              className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6 space-y-4 text-xs sm:text-sm shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-stone-900">Leave a Review</h2>
                <span className="hidden sm:inline-flex rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200">
                  We read every review
                </span>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1" htmlFor="productId">
                  Product
                </label>
                <select
                  id="productId"
                  value={reviewForm.productId}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      productId: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-[11px] font-medium text-stone-600 mb-1"
                    htmlFor="reviewerName"
                  >
                    Your name
                  </label>
                  <input
                    id="reviewerName"
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1" htmlFor="rating">
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        rating: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} star{value > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1" htmlFor="comment">
                  Your review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                className="mt-1 inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
              >
                Submit Review
              </button>
              <p className="text-[11px] text-stone-500">
                Reviews are stored locally in your browser for this demo.
              </p>
            </form>

            <div className="space-y-3">
              {sortedReviews.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-6 text-xs sm:text-sm text-stone-600">
                  <p>No reviews yet. Be the first to share your Lamp &amp; Glow experience.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {sortedReviews.map((review) => {
                    const product = products.find((p) => p.id === review.productId)
                    return (
                      <li
                        key={review.id}
                        className="group rounded-3xl border border-stone-200 bg-white p-5 text-xs sm:text-sm flex flex-col gap-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-amber-200/80 motion-reduce:transform-none motion-reduce:transition-none"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-stone-900 truncate">
                              {product?.name ?? 'Lamp & Glow product'}
                            </p>
                            <p className="mt-0.5 text-[11px] text-stone-500">by {review.name || 'Anonymous'}</p>
                          </div>
                          <div className="text-right text-[11px] text-stone-500 shrink-0">
                            <div className="text-amber-500">
                              {'★'.repeat(review.rating)}
                              <span className="text-stone-300">{'★'.repeat(5 - review.rating)}</span>
                            </div>
                            <p>
                              {new Date(review.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="h-0.5 w-full rounded-full bg-gradient-to-r from-amber-200/0 via-amber-200/70 to-amber-200/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <p className="text-xs sm:text-sm text-stone-700">{review.comment}</p>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
