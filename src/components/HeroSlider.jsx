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
                <div
                  className={[
                    'relative w-full',
                    'aspect-[2/1]',
                    'max-h-[240px]',
                    'sm:max-h-[400px]',
                    'lg:max-h-[572px]',
                  ].join(' ')}
                  style={{
                    height: slide.fullScreen ? '100dvh' : undefined,
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className={`absolute inset-0 h-full w-full ${
                      slide.fitToScreen !== false ? 'object-cover' : 'object-contain bg-[#4C2600]'
                    }`}
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                  {slide.primaryLabel && slide.primaryAction && (
                    <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 lg:bottom-7 lg:left-7">
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