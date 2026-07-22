import Slider from 'react-slick'
import { Instagram } from 'lucide-react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

function GridTile({ item, index }) {
  return (
    <a
      href={item.url || '#'}
      target={item.url ? '_blank' : undefined}
      rel={item.url ? 'noopener noreferrer' : undefined}
      className="group relative block aspect-square overflow-hidden"
    >
      <img
        src={item.image}
        alt={item.alt || `Instagram post ${index + 1}`}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 flex flex-col items-center justify-center gap-2 transition-colors duration-300 group-hover:bg-black/50">
        <Instagram className="w-8 h-8 text-white opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0" strokeWidth={1.75} />
        <span className="text-white text-sm font-semibold tracking-wide opacity-0 -translate-y-1 transition-all duration-300 delay-75 group-hover:opacity-100 group-hover:translate-y-0">
          Shop It
        </span>
      </div>
    </a>
  )
}

export default function HomeInstagramGrid({ images }) {
  if (!images || images.length === 0) return null

  const useSlider = images.length > 12

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2200,
    speed: 700,
    slidesToShow: 5,
    slidesToScroll: 1,
    pauseOnHover: true,
    swipe: true,
    touchMove: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  }

  return (
    <section className="bg-white py-14 sm:py-16">
      <h2 className="text-center font-serif text-3xl sm:text-4xl text-stone-900 mb-10">
        Instagram
      </h2>

      {!useSlider ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {images.map((item, i) => (
            <GridTile key={item.id} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div className="instagram-grid-slider">
          <style>{`
            .instagram-grid-slider .slick-list,
            .instagram-grid-slider .slick-track {
              display: flex !important;
            }
            .instagram-grid-slider .slick-slide {
              height: auto;
            }
            .instagram-grid-slider .slick-slide > div {
              height: 100%;
              line-height: 0;
            }
          `}</style>
          <Slider {...settings}>
            {images.map((item, i) => (
              <div key={item.id}>
                <GridTile item={item} index={i} />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </section>
  )
}
