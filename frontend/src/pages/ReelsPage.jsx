import { useState } from 'react'
import { FaHeart, FaRegHeart, FaShare } from 'react-icons/fa'

export default function ReelsPage({ reels }) {
  const [liked, setLiked] = useState(() => new Set())

  function toggleLike(id) {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="w-full px-0 py-10 sm:py-14">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
              Reels
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl">
              Short videos featuring warm-light setups, styling ideas, and product highlights.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {reels.map((reel) => {
          const isLiked = liked.has(reel.id)
          return (
            <article
              key={reel.id}
              className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden"
            >
              <div className="relative bg-black">
                <div className="aspect-[9/16]">
                  <video
                    className="h-full w-full object-cover"
                    src={reel.videoUrl}
                    poster={reel.poster}
                    controls
                    playsInline
                    preload="metadata"
                  />
                </div>

                <div className="absolute left-3 right-3 bottom-3">
                  <div className="rounded-xl bg-black/55 backdrop-blur px-3 py-2 text-white">
                    <p className="text-sm font-semibold leading-tight">{reel.title}</p>
                    <p className="mt-0.5 text-[11px] text-white/85">{reel.caption}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 flex items-center justify-between">
                <button
                  onClick={() => toggleLike(reel.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50"
                >
                  {isLiked ? (
                    <FaHeart className="text-rose-600" />
                  ) : (
                    <FaRegHeart className="text-stone-700" />
                  )}
                  {isLiked ? 'Liked' : 'Like'}
                </button>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50"
                >
                  <FaShare className="text-stone-700" />
                  Share
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
