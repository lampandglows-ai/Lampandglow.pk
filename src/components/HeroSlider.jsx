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
      <style>{`
        .hero-slider .slick-dots li button:before {
          color: rgba(255,255,255,0.6);
          font-size: 8px;
        }
        .hero-slider .slick-dots li.slick-active button:before {
          color: #FFDA03;
          opacity: 1;
        }
        /* Force slick inner divs to never affect layout height */
        .hero-slider .slick-slide > div,
        .hero-slider .slick-slide > div > div {
          line-height: 0;
          height: 100%;
        }
        .hero-slider .slick-list,
        .hero-slider .slick-track {
          height: 100%;
        }
      `}</style>

      <section className="hero-slider bg-[#4C2600] px-3 sm:px-5 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-[#FFDA03]/25">
          <Slider {...settings}>
            {slides.map((slide) => (
              <div key={slide.id}>
                {/* Container locked to exact 3780/1890 (2:1) ratio — never changes */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '50%', /* 1890/3780 = 50% — locks 2:1 ratio perfectly */
                    backgroundColor: '#4C2600',
                  }}
                >
                  {/* Image sits inside, object-contain so it never stretches regardless of upload size */}
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />

                  {/* Primary button — bottom left only */}
                  {slide.primaryLabel && slide.primaryAction && (
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                      <button
                        onClick={() => onPrimaryAction(slide.primaryAction)}
                        className="inline-flex items-center justify-center rounded-full bg-[#FFDA03] px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-semibold text-[#4C2600] transition-all duration-200 hover:bg-yellow-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none"
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