import { useNavigate } from 'react-router-dom'

export default function WishlistPage() {
  const navigate = useNavigate()

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800"
      >
        <span aria-hidden>←</span>
        Back
      </button>
      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-700">
        Wishlist is coming soon.
      </div>
    </section>
  )
}
