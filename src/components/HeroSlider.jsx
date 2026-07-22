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
    arrows: false,
    infinite: hasMultiple,
    autoplay: hasMultiple,
    autoplaySpeed: 4500,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    swipe: true,
    touchMove: true,
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

  // Aspect ratios
  // Desktop: taller banner so the hero reads as a large, full-height section
  // Mobile: 4:4 (1:1 square) -> 100%
  const paddingBottom = isMobile ? '100%' : '54%'

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

      <section className="hero-slider hero-gradient-bg pb-3 sm:pb-5 lg:pb-8">
        <div className="relative overflow-hidden shadow-2xl">
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
                      background: 'rgba(0,0,0,0.18)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Centered text overlay */}
                  {(slide.badge || slide.title || slide.subtitle || (slide.primaryLabel && slide.primaryAction)) && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '0 16px',
                      }}
                    >
                      {slide.badge && (
                        <span className="text-white/90 text-[10px] sm:text-xs md:text-sm tracking-[0.3em] uppercase mb-2 sm:mb-3">
                          {slide.badge}
                        </span>
                      )}
                      {slide.title && (
                        <h2 className="font-serif text-white text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-2 sm:mb-4">
                          {slide.title}
                        </h2>
                      )}
                      {slide.subtitle && (
                        <p className="text-[#FFD400] text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.primaryLabel && slide.primaryAction && (
                        <button
                          onClick={() => onPrimaryAction(slide.primaryAction)}
                          className={[
                            'inline-flex items-center justify-center border border-white text-white font-medium tracking-wide',
                            'px-6 py-2.5 text-xs sm:px-8 sm:py-3 sm:text-sm',
                            'transition-colors duration-200 hover:bg-white hover:text-stone-900',
                            'motion-reduce:transition-none',
                          ].join(' ')}
                        >
                          {slide.primaryLabel}
                        </button>
                      )}
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
