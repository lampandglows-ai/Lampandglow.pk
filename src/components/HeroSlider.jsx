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
        .hero-slider .slick-slide > div {
          line-height: 0;
        }
      `}</style>

      <section className="hero-slider bg-[#4C2600] px-3 sm:px-5 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8">
        {/*
          Capping max-w here shrinks the width.
          The 2:1 aspect-ratio then drives height proportionally — ratio is never broken.
          Adjust max-w-3xl / max-w-4xl / max-w-5xl to taste.
        */}
        <div className="mx-auto w-full max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-[#FFDA03]/25">
            <Slider {...settings}>
              {slides.map((slide) => (
                <div key={slide.id}>
                  <div
                    className="relative w-full"
                    style={{
                      aspectRatio: slide.fullScreen ? undefined : '3780 / 1890',
                      height: slide.fullScreen ? '100dvh' : undefined,
                    }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className={`absolute inset-0 h-full w-full ${
                        slide.fitToScreen !== false ? 'object-cover' : 'object-contain bg-[#4C2600]'
                      }`}
                    />

                    {/* Primary button — bottom left only */}
                    {slide.primaryLabel && slide.primaryAction && (
                      <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
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
        </div>
      </section>
    </>
  )
}