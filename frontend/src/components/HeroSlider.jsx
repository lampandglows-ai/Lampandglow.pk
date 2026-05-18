import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

function SliderArrow({ className, style, onClick, direction, edgeOffset }) {
  const isNext = direction === 'next'

  return (
    <button
      type="button"
      aria-label={isNext ? 'Next slide' : 'Previous slide'}
      onClick={onClick}
      className={className}
      style={{
        ...style,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
        [isNext ? 'right' : 'left']: edgeOffset,
        // Remove any default slick styles that might interfere
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        height: 'auto',
      }}
    >
      <span className="sr-only">
        {isNext ? 'Next' : 'Previous'}
      </span>

      <span
        aria-hidden
        className="inline-flex items-center justify-center text-white drop-shadow"
      >
        {isNext ? (
          <ChevronRight className="h-8 w-8" />
        ) : (
          <ChevronLeft className="h-8 w-8" />
        )}
      </span>
    </button>
  )
}

export default function HeroSlider({ slides, onPrimaryAction }) {
  const baseEdgeOffsetPx = 24
  const [scrollbarWidthPx, setScrollbarWidthPx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateScrollbarWidth = () => {
      const width = window.innerWidth - document.documentElement.clientWidth
      setScrollbarWidthPx(width > 0 ? width : 0)
    }

    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    updateScrollbarWidth()
    updateIsMobile()
    window.addEventListener('resize', updateScrollbarWidth)
    window.addEventListener('resize', updateIsMobile)
    return () => window.removeEventListener('resize', updateScrollbarWidth)
  }, [])

  // For prev button: fixed offset from left
  const prevEdgeOffset = `${baseEdgeOffsetPx}px`
  
  // For next button: fixed offset from right, plus scrollbar width adjustment
  // This ensures consistent spacing regardless of scrollbar presence
  const nextEdgeOffset = `${baseEdgeOffsetPx + scrollbarWidthPx}px`

  const settings = {
    dots: true,
    arrows: !isMobile,
    prevArrow: isMobile ? undefined : <SliderArrow direction="prev" edgeOffset={prevEdgeOffset} />,
    nextArrow: isMobile ? undefined : <SliderArrow direction="next" edgeOffset={nextEdgeOffset} />,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4500,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
  }

  return (
    <section className="relative overflow-hidden bg-stone-900">
      {/* Added wrapper div to ensure consistent layout */}
      <div className="relative">
        <Slider {...settings}>
          {slides.map((slide) => (
            <div key={slide.id}>
              <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />

                <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                  <div className="max-w-xl">
                    {slide.badge && (
                      <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                        {slide.badge}
                      </p>
                    )}

                    <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
                      {slide.title}
                    </h1>

                    {slide.subtitle && (
                      <p className="mt-4 text-sm sm:text-base text-white/85 leading-relaxed">
                        {slide.subtitle}
                      </p>
                    )}

                    <div className="mt-7 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => onPrimaryAction(slide.primaryAction)}
                        className="inline-flex items-center justify-center rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-amber-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
                      >
                        {slide.primaryLabel}
                      </button>

                      {slide.secondaryLabel && slide.secondaryAction && (
                        <button
                          onClick={() => onPrimaryAction(slide.secondaryAction)}
                          className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/15 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
                        >
                          {slide.secondaryLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}