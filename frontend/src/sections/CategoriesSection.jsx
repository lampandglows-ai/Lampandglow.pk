export default function CategoriesSection({ categories, onGoToProducts, onCategorySelect }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">Categories</h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl">
            Every Lamp &amp; Glow piece is hand-finished and designed to work together. Choose a
            category to explore matching products.
          </p>
        </div>
        <button
          onClick={onGoToProducts}
          className="inline-flex text-xs font-medium text-amber-700 hover:text-amber-800"
        >
          Go to all products
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category) => (
          <article
            key={category.id}
            className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-base font-semibold text-stone-900">{category.title}</h2>
              <p className="text-xs text-stone-600">{category.description}</p>
              <button
                onClick={() => onCategorySelect(category.id)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800"
              >
                View {category.title}
                <span aria-hidden>→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
