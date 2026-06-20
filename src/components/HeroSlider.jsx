import { useState, useEffect, useMemo } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function HeroSlider({ slides, onPrimaryAction }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)')
    const onChange = (e) => setIsMobile(e.matches)
    setIsMobile(mql.matches)
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    } else {
      // Fallback for older browsers
      mql.addListener(onChange)
      return () => mql.removeListener(onChange)
    }
  }, [])

  const visibleSlides = useMemo(() => {
    if (isMobile) {
      return (slides || []).filter((s) => s.imageMobile)
    }
    return slides || []
  }, [slides, isMobile])

  if (!visibleSlides || visibleSlides.length === 0) return null

  const hasMultiple = visibleSlides.length > 1

  const settings = {
    dots: hasMultiple,
    arrows: hasMultiple,
    infinite: hasMultiple,
    autoplay: hasMultiple,
    autoplaySpeed: 4500,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    swipe: true,
    touchMove: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
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

  // Custom arrow components
  function NextArrow({ onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="absolute right-3 sm:right-4 lg:right-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all duration-200 shadow-lg"
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    )
  }

  function PrevArrow({ onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="absolute left-3 sm:left-4 lg:left-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all duration-200 shadow-lg"
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    )
  }

  // Aspect ratios
  // Desktop: 3780:1400 -> 37.037%
  // Mobile: 4:4 (1:1 square) -> 100%
  const paddingBottom = isMobile ? '100%' : '37.037%'

  return (
    <>
      <style>{`
        .hero-slider .slick-dots li button:before {
          color: rgba(255,255,255,0.55);
          font-size: 7px;
        }
        .hero-slider .slick-dots li.slick-active button:before {
          color: #FFD400;
          opacity: 1;
        }
        .hero-slider .slick-dots li button {
          width: 20px;
          height: 20px;
        }
        .hero-slider .slick-slide > div {
          line-height: 0;
        }
        .hero-slider .slick-dots {
          bottom: 0;
          z-index: 10;
        }
        @media (max-width: 768px) {
          .hero-slider .slick-dots {
            bottom: 6px;
          }
        }
      `}</style>

      <section className="hero-slider hero-gradient-bg px-2 xs:px-3 sm:px-5 lg:px-8 pt-2 sm:pt-3 lg:pt-4 pb-3 sm:pb-5 lg:pb-8">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl ring-1 ring-[#FFD400]/25">
          <Slider key={isMobile ? 'mobile' : 'desktop'} {...settings}>
            {visibleSlides.map((slide) => (
              <div key={slide.id}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom,
                    height: 0,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={isMobile ? slide.imageMobile : slide.image}
                    alt={slide.alt}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: slide.fitToScreen !== false ? 'cover' : 'contain',
                      backgroundColor: slide.fitToScreen === false ? '#5A2D0C' : undefined,
                    }}
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Gradient overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.30), transparent)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* CTA button */}
                  {slide.primaryLabel && slide.primaryAction && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 'clamp(10px, 3%, 28px)',
                        left: 'clamp(10px, 3%, 28px)',
                      }}
                    >
                      <button
                        onClick={() => onPrimaryAction(slide.primaryAction)}
                        className={[
                          'inline-flex items-center justify-center rounded-full font-semibold btn-primary',
                          'px-3 py-1.5 text-xs',
                          'sm:px-5 sm:py-2 sm:text-sm',
                          'lg:px-6 lg:py-2.5',
                          'hover:shadow-md hover:-translate-y-0.5',
                          'active:translate-y-0 active:scale-[0.98]',
                          'motion-reduce:transform-none motion-reduce:transition-none',
                        ].join(' ')}
                      >
                        {slide.primaryLabel}
                      </button>
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
