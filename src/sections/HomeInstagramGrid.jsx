import { useEffect, useRef, useState } from 'react'
import { Instagram } from 'lucide-react'

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

// Columns visible at once per breakpoint — matches the fixed 2-row layout below.
function useColumnsPerView() {
  const [cols, setCols] = useState(5)
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      if (w < 640) setCols(2)
      else if (w < 1024) setCols(3)
      else setCols(5)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return cols
}

export default function HomeInstagramGrid({ images }) {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const columnsPerView = useColumnsPerView()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!images || images.length === 0) return null

  const useScroller = images.length > 10

  // Fixed 2 rows: pair images into columns of 2 (top/bottom).
  const columns = []
  for (let i = 0; i < images.length; i += 2) {
    columns.push(images.slice(i, i + 2))
  }
  const columnWidthStyle =
    containerWidth > 0 ? `${containerWidth / columnsPerView}px` : `${100 / columnsPerView}%`
  const scrollDuration = Math.max(18, columns.length * 3.5)

  return (
    <section className="bg-white py-14 sm:py-16">
      <h2 className="text-center font-serif text-3xl sm:text-4xl text-stone-900 mb-10">
        Instagram
      </h2>

      {!useScroller ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {images.map((item, i) => (
            <GridTile key={item.id} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div ref={containerRef} className="instagram-scroller overflow-hidden">
          <style>{`
            .instagram-scroller-track {
              animation: instagramScroll ${scrollDuration}s linear infinite;
            }
            .instagram-scroller:hover .instagram-scroller-track {
              animation-play-state: paused;
            }
            @keyframes instagramScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
          <div className="instagram-scroller-track flex w-max">
            {/* First set */}
            <div className="flex shrink-0">
              {columns.map((col, ci) => (
                <div
                  key={`a-${ci}`}
                  className="shrink-0 grid grid-rows-2"
                  style={{ width: columnWidthStyle }}
                >
                  {col.map((item, i) => (
                    <GridTile key={item.id} item={item} index={ci * 2 + i} />
                  ))}
                </div>
              ))}
            </div>
            {/* Duplicate set — seamless loop */}
            <div className="flex shrink-0" aria-hidden="true">
              {columns.map((col, ci) => (
                <div
                  key={`b-${ci}`}
                  className="shrink-0 grid grid-rows-2"
                  style={{ width: columnWidthStyle }}
                >
                  {col.map((item, i) => (
                    <GridTile key={`dup-${item.id}`} item={item} index={ci * 2 + i} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
