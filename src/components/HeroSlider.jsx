import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function HeroSlider({ slides, onPrimaryAction }) {
  if (!slides || slides.length === 0) return null

  const hasMultiple = slides.length > 1

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

  return (
    <>
      <style>{`
        .hero-slider .slick-dots li button:before {
          color: rgba(255,255,255,0.55);
          font-size: 7px;
        }
        .hero-slider .slick-dots li.slick-active button:before {
          color: #FFDA03;
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
      `}</style>

      <section className="hero-slider bg-[#4C2600] px-2 xs:px-3 sm:px-5 lg:px-8 pt-2 sm:pt-3 lg:pt-4 pb-3 sm:pb-5 lg:pb-8">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl ring-1 ring-[#FFDA03]/25">
          <Slider {...settings}>
            {slides.map((slide) => (
              <div key={slide.id}>
                {/* 
                  padding-bottom: 50% = strictly enforces 2:1 ratio (width / 2)
                  This is immune to browser zoom because it's always
                  calculated as a percentage of the element's own width.
                */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '50%', /* 2:1 ratio — 3780/1890 = 2, so 1/2 = 50% */
                    height: 0,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: slide.fitToScreen !== false ? 'cover' : 'contain',
                      backgroundColor: slide.fitToScreen === false ? '#4C2600' : undefined,
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
                          'inline-flex items-center justify-center rounded-full font-semibold',
                          'bg-[#FFDA03] text-[#4C2600]',
                          'transition-all duration-200',
                          'hover:bg-yellow-300 hover:shadow-md hover:-translate-y-0.5',
                          'active:translate-y-0 active:scale-[0.98]',
                          'motion-reduce:transform-none motion-reduce:transition-none',
                          'px-3 py-1.5 text-xs',
                          'sm:px-5 sm:py-2 sm:text-sm',
                          'lg:px-6 lg:py-2.5',
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