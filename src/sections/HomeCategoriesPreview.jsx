import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HomeCategoriesPreview({ categories, onViewAll, onPickCategory }) {
  const [showArrows, setShowArrows] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowArrows(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="w-full py-10 sm:py-14 bg-transparent">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#FFDA03]">
            Explore Our Wooden Lamp Collections
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-yellow-100/80">
           Discover unique handcrafted designs and find the perfect piece to light up your home.
          </p>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="relative">
          {/* Left Arrow Hint */}
          {showArrows && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 sm:hidden animate-pulse">
              <ChevronLeft className="w-8 h-8 text-[#FFDA03] drop-shadow-lg" />
            </div>
          )}

          {/* Right Arrow Hint */}
          {showArrows && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 sm:hidden animate-pulse">
              <ChevronRight className="w-8 h-8 text-[#FFDA03] drop-shadow-lg" />
            </div>
          )}

          <div className="flex gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible sm:gap-4 lg:gap-5">
          {categories.slice(0, 5).map((category) => (
            <button
              key={category.id}
              onClick={() => onPickCategory(category.id)}
              className="flex-shrink-0 w-[50vw] sm:w-auto group relative overflow-hidden rounded-2xl bg-stone-200 shadow-lg ring-1 ring-[#FFDA03]/30 text-left
                         transition-all duration-300 ease-out
                         hover:-translate-y-1.5 hover:shadow-2xl hover:ring-[#FFDA03]/70
                         active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
            >
              {/* Image — portrait ratio on mobile, slightly less tall on desktop */}
              <div className="relative aspect-[3/5] sm:aspect-[5/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 h-full w-full object-cover
                             transition-transform duration-500 ease-out
                             group-hover:scale-110 motion-reduce:transform-none"
                />

                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/0" />

                {/* Extra shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4C2600]/60 via-transparent to-transparent
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Text content */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-sm sm:text-base font-bold text-white drop-shadow leading-tight">
                    {category.title}
                  </h3>
                  {/* Description hidden by default, slides up on hover */}
                  <p className="mt-1 text-[10px] sm:text-[11px] text-white/85 max-w-[26ch] leading-snug
                                 max-h-0 overflow-hidden opacity-0
                                 group-hover:max-h-10 group-hover:opacity-100
                                 transition-all duration-300 ease-out">
                    {category.description}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#FFDA03]
                                  group-hover:gap-2.5 transition-all duration-200">
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
            className="inline-flex text-xs font-semibold text-[#FFDA03] hover:text-yellow-300 transition-colors"
          >
            View all collections →
          </button>
        </div>
      </div>
    </section>
  )
}