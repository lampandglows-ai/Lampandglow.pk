import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useCategories from '../hooks/useCategories.js'
import { slugify } from '../utils/slugify.js'

export default function CollectionsPage() {
  const navigate = useNavigate()
  const { categories, loading } = useCategories()

  return (
    <section className="w-full min-h-screen bg-[#4C2600] bg-[radial-gradient(circle_at_top_left,rgba(255,218,3,0.18),transparent_34%),linear-gradient(180deg,#4C2600_0%,#2b1500_52%,#4C2600_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1 text-xs font-medium text-yellow-100/80 hover:text-[#FFDA03] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <div className="mt-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#FFDA03]">Collections</h1>
          <p className="mt-3 text-xs sm:text-sm text-yellow-100/80 max-w-xl mx-auto">
            Explore our curated collections of handcrafted wooden lamps and decor pieces.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#FFDA03] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => navigate(`/collections/${slugify(category.id)}`)}
                className="w-full group relative overflow-hidden rounded-2xl bg-stone-200 shadow-lg ring-1 ring-[#FFDA03]/30 text-left transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:ring-[#FFDA03]/70 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div className="relative aspect-[3/5] sm:aspect-[10/17] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transform-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4C2600]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h2 className="text-sm sm:text-base font-bold text-white drop-shadow leading-tight">
                      {category.title}
                    </h2>
                    <p className="mt-1 text-[10px] sm:text-[11px] text-white/85 max-w-[26ch] leading-snug max-h-0 overflow-hidden opacity-0 group-hover:max-h-10 group-hover:opacity-100 transition-all duration-300 ease-out">
                      {category.description}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#FFDA03] group-hover:gap-2.5 transition-all duration-200">
                      Explore
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">›</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
