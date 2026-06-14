import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HomeCategoriesPreview({ categories, onViewAll, onPickCategory }) {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [categories])

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
      setTimeout(checkScroll, 300)
    }
  }

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

        {/* Horizontal scroll with desktop arrows */}
        <div className="relative">
          {/* Desktop Left Arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`hidden md:flex absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollLeft
                ? 'bg-[#FFDA03] hover:bg-yellow-300 text-[#4C2600] shadow-lg'
                : 'bg-[#FFDA03]/30 text-yellow-100/60 cursor-not-allowed'
            }`}
            title="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Desktop Right Arrow */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-all duration-200 ${
              canScrollRight
                ? 'bg-[#FFDA03] hover:bg-yellow-300 text-[#4C2600] shadow-lg'
                : 'bg-[#FFDA03]/30 text-yellow-100/60 cursor-not-allowed'
            }`}
            title="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            onScroll={checkScroll}
          >
            {categories.slice(0, 5).map((category) => (
              <button
                key={category.id}
                onClick={() => onPickCategory(category.id)}
                className="flex-shrink-0 w-[50vw] sm:w-[33vw] md:w-[30vw] lg:w-[calc((100%_-_5rem)/5)] group relative overflow-hidden rounded-2xl bg-stone-200 shadow-lg ring-1 ring-[#FFDA03]/30 text-left transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:ring-[#FFDA03]/70 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
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
                    <h3 className="text-sm sm:text-base font-bold text-white drop-shadow leading-tight">
                      {category.title}
                    </h3>
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