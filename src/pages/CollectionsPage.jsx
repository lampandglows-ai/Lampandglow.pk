import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import useCategories from '../hooks/useCategories.js'
import { slugify } from '../utils/slugify.js'

export default function CollectionsPage() {
  const navigate = useNavigate()
  const { categories, loading } = useCategories()

  return (
    <section className="w-full min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <div className="mt-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Collections</h1>
          <p className="mt-3 text-sm text-stone-500 max-w-xl mx-auto">
            Explore our curated collections of handcrafted wooden lamps and decor pieces.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => (
              <article
                key={category.id}
                onClick={() => navigate(`/collections/${slugify(category.id)}`)}
                className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-amber-200 transition-all duration-300 ease-out"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
                <div className="p-4 flex flex-col gap-1">
                  <h2 className="text-sm sm:text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors duration-200">
                    {category.title}
                  </h2>
                  <p className="text-xs text-stone-500 line-clamp-2">{category.description}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 group-hover:gap-2 transition-all duration-200">
                    View collection
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
