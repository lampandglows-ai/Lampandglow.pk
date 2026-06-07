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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        height: 'auto',
      }}
    >
      <span className="sr-only">{isNext ? 'Next' : 'Previous'}</span>
      <span
        aria-hidden
        className="inline-flex items-center justify-center text-white drop-shadow"
      >
        {isNext ? (
          <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
        ) : (
          <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
        )}
      </span>
    </button>
  )
}

export default function HeroSlider({ slides, onPrimaryAction }) {
  const baseEdgeOffsetPx = 12
  const [scrollbarWidthPx, setScrollbarWidthPx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateScrollbarWidth = () => {
      const width = window.innerWidth - document.documentElement.clientWidth
      setScrollbarWidthPx(width > 0 ? width : 0)
    }

    const updateIsMobile = () => {
      // Only hide arrows on very small screens (< 360px) — show on all normal mobile
      setIsMobile(window.innerWidth < 360)
    }

    updateScrollbarWidth()
    updateIsMobile()

    window.addEventListener('resize', updateScrollbarWidth)
    window.addEventListener('resize', updateIsMobile)
    return () => {
      window.removeEventListener('resize', updateScrollbarWidth)
      window.removeEventListener('resize', updateIsMobile)
    }
  }, [])

  const prevEdgeOffset = `${baseEdgeOffsetPx}px`
  const nextEdgeOffset = `${baseEdgeOffsetPx + scrollbarWidthPx}px`

  if (!slides || slides.length === 0) return null

  const hasMultiple = slides.length > 1

  const settings = {
    dots: hasMultiple,
    arrows: hasMultiple && !isMobile,
    prevArrow: isMobile ? undefined : (
      <SliderArrow direction="prev" edgeOffset={prevEdgeOffset} />
    ),
    nextArrow: isMobile ? undefined : (
      <SliderArrow direction="next" edgeOffset={nextEdgeOffset} />
    ),
    infinite: hasMultiple,
    autoplay: hasMultiple,
    autoplaySpeed: 4500,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    swipe: true,
    touchMove: true,
    // Dots styling via global CSS override below
    appendDots: (dots) => (
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <ul style={{ margin: 0, padding: 0, pointerEvents: 'auto' }}>{dots}</ul>
      </div>
    ),
  }

  return (
    <>
      {/* Scoped dot styles */}
      <style>{`
        .hero-slider .slick-dots li button:before {
          color: rgba(255,255,255,0.6);
          font-size: 8px;
        }
        .hero-slider .slick-dots li.slick-active button:before {
          color: #FFDA03;
          opacity: 1;
        }
        .hero-slider .slick-slide > div {
          line-height: 0;
        }
      `}</style>

      {/* No top padding/margin — section starts flush */}
      <section className="hero-slider relative overflow-hidden bg-[#4C2600] pt-4 sm:pt-6 lg:pt-8">
        <div className="relative overflow-hidden shadow-2xl ring-1 ring-[#FFDA03]/25">
          <Slider {...settings}>
            {slides.map((slide) => (
              <div key={slide.id}>
                {/*
                  Use aspect-ratio so the image keeps its natural ratio on every screen.
                  16/9 is the default; override per-slide via slide.aspectRatio e.g. "4/3".
                  On very tall mobile screens we cap height so it doesn't dominate the viewport.
                */}
                <div
                  className="relative w-full"
                  style={{
                    aspectRatio: slide.fullScreen
                      ? undefined
                      : slide.aspectRatio || '16/9',
                    height: slide.fullScreen ? '100dvh' : undefined,
                    maxHeight: slide.fullScreen ? undefined : '700px',
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className={`absolute inset-0 h-full w-full ${
                      slide.fitToScreen !== false
                        ? 'object-cover'
                        : 'object-contain bg-[#4C2600]'
                    }`}
                  />

                  {(slide.title ||
                    slide.subtitle ||
                    slide.badge ||
                    slide.primaryLabel ||
                    slide.secondaryLabel) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4C2600]/80 via-black/35 to-black/10" />
                  )}

                  {(slide.title ||
                    slide.subtitle ||
                    slide.badge ||
                    slide.primaryLabel ||
                    slide.secondaryLabel) && (
                    <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                      <div className="max-w-xl">
                        {slide.badge && (
                          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                            {slide.badge}
                          </p>
                        )}

                        {slide.title && (
                          <h1
                            className={`text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white ${
                              slide.badge ? 'mt-3 sm:mt-4' : ''
                            }`}
                          >
                            {slide.title}
                          </h1>
                        )}

                        {slide.subtitle && (
                          <p
                            className={`text-sm sm:text-base text-white/85 leading-relaxed ${
                              slide.title || slide.badge ? 'mt-3 sm:mt-4' : ''
                            }`}
                          >
                            {slide.subtitle}
                          </p>
                        )}

                        {(slide.primaryLabel || slide.secondaryLabel) && (
                          <div
                            className={`flex flex-col sm:flex-row gap-2 sm:gap-3 ${
                              slide.title || slide.subtitle || slide.badge
                                ? 'mt-5 sm:mt-7'
                                : ''
                            }`}
                          >
                            {slide.primaryLabel && slide.primaryAction && (
                              <button
                                onClick={() => onPrimaryAction(slide.primaryAction)}
                                className="inline-flex items-center justify-center rounded-full bg-[#FFDA03] px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-semibold text-[#4C2600] transition-all duration-200 hover:bg-yellow-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
                              >
                                {slide.primaryLabel}
                              </button>
                            )}

                            {slide.secondaryLabel && slide.secondaryAction && (
                              <button
                                onClick={() => onPrimaryAction(slide.secondaryAction)}
                                className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/15 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
                              >
                                {slide.secondaryLabel}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  )
}