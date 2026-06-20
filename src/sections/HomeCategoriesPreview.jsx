import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useHorizontalSlider } from '../hooks/useHorizontalSlider.js'

export default function HomeCategoriesPreview({ categories, onViewAll, onPickCategory }) {
  const { scrollContainerRef, canScrollLeft, canScrollRight, checkScroll, scroll } =
    useHorizontalSlider(categories.length)

  return (
    <section className="w-full py-10 sm:py-14 bg-transparent">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
            Explore Our Wooden Lamp Collections
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-500">
           Discover unique handcrafted designs and find the perfect piece to light up your home.
          </p>
        </div>

        {/* Horizontal scroll with desktop arrows */}
        <div className="relative min-w-0">
          {/* Desktop Left Arrow */}
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`hidden sm:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollLeft
              ? 'bg-[#F5F1EA]0 hover:bg-[#FFD400] text-white shadow-lg'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Desktop Right Arrow */}
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`hidden sm:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollRight
              ? 'bg-[#F5F1EA]0 hover:bg-[#FFD400] text-white shadow-lg'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex w-full min-w-0 gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            onScroll={checkScroll}
          >
            {categories.slice(0, 5).map((category) => (
              <button
                key={category.id}
                onClick={() => onPickCategory(category.id)}
                className="flex-shrink-0 w-[75vw] sm:w-[45vw] md:w-[32vw] lg:w-[calc((100%_-_5rem)/5)] group relative overflow-hidden rounded-2xl bg-stone-200 shadow-lg ring-1 ring-[#FFD400]/30 text-left transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:ring-[#FFD400]/70 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div className="relative aspect-[3/5] sm:aspect-[10/17] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transform-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5A2D0C]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-sm sm:text-base font-bold text-white drop-shadow leading-tight">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-[10px] sm:text-[11px] text-white/85 max-w-[26ch] leading-snug max-h-0 overflow-hidden opacity-0 group-hover:max-h-10 group-hover:opacity-100 transition-all duration-300 ease-out">
                      {category.description}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#FFD400] group-hover:gap-2.5 transition-all duration-200">
                      Explore
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5">›</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
              onClick={onViewAll}
              className="inline-flex text-xs font-semibold text-[#ffa200] hover:text-[#5A2D0C] transition-colors"
          >
            View all collections →
          </button>
        </div>
      </div>
    </section>
  )
}