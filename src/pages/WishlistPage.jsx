import { useNavigate } from 'react-router-dom'

export default function WishlistPage() {
  const navigate = useNavigate()

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#4C2600]">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 hover:text-amber-200"
      >
        <span aria-hidden>←</span>
        Back
      </button>
      <div className="mt-6 rounded-2xl border border-[#FFDA03]/20 bg-[#5c3418] p-6 text-sm text-white/80">
        Wishlist is coming soon.
      </div>
    </section>
  )
}
