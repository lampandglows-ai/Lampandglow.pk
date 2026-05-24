export default function HomeCategoriesPreview({ categories, onViewAll, onPickCategory, theme = 'light' }) {
  return (
    <section className={theme === 'dark' ? 'w-full px-0 py-10 sm:py-14 bg-transparent' : 'w-full px-0 py-10 sm:py-14 bg-[#4C2600]/90'}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className={theme === 'dark' ? 'text-2xl sm:text-3xl font-semibold tracking-tight text-stone-100' : 'text-2xl sm:text-3xl font-semibold tracking-tight text-[#FFDA03]'}>
            Featured Collections
          </h2>
          <p className={theme === 'dark' ? 'mt-2 text-xs sm:text-sm text-stone-300' : 'mt-2 text-xs sm:text-sm text-yellow-100/80'}>
            Explore our carefully curated lighting collections, designed for every room and style.
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.slice(0, 3).map((category) => (
            <button
              key={category.id}
              onClick={() => onPickCategory(category.id)}
              className="group relative overflow-hidden rounded-2xl bg-stone-200 shadow-lg ring-1 ring-[#FFDA03]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-[#FFDA03]/60 motion-reduce:transform-none motion-reduce:transition-none text-left"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/0" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-base sm:text-lg font-semibold text-white drop-shadow">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-[11px] sm:text-xs text-white/90 max-w-[28ch]">
                    {category.description}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#FFDA03]">
                    Explore Collection
                    <span className="text-[#FFDA03]">›</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onViewAll}
            className={theme === 'dark' ? 'inline-flex text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors' : 'inline-flex text-xs font-semibold text-[#FFDA03] hover:text-yellow-300 transition-colors'}
          >
            View all
          </button>
        </div>
      </div>
    </section>
  )
}
