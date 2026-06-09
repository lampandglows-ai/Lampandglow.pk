import { useState, useEffect } from 'react'
import { FaHeart, FaRegHeart, FaShare } from 'react-icons/fa'
import { Loader2, AlertCircle } from 'lucide-react'
import reelsService from '../utils/reelsService'

export default function ReelsPage() {
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [liked, setLiked] = useState(() => new Set())

  useEffect(() => {
    const loadReels = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await reelsService.getAllReels()
        const activeReels = data.filter((r) => r.isActive !== false)
        setReels(activeReels)
      } catch (err) {
        console.error('Error loading reels:', err)
        setError('Failed to load reels')
      } finally {
        setLoading(false)
      }
    }
    loadReels()
  }, [])

  function toggleLike(id) {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (loading) {
    return (
      <section className="w-full px-0 py-10 sm:py-14 bg-[#4C2600]">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin mx-auto text-[#FFDA03] mb-4" />
            <p className="text-white/70">Loading reels...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full px-0 py-10 sm:py-14 bg-[#4C2600]">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center max-w-md px-4">
            <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-white/70">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (reels.length === 0) {
    return (
      <section className="w-full px-0 py-10 sm:py-14 bg-[#4C2600]">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                Reels
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-white/70 max-w-2xl">
                Short videos featuring warm-light setups, styling ideas, and product highlights.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-white/60">No reels available yet. Check back soon!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full px-0 py-10 sm:py-14 bg-[#4C2600]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Reels
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-white/70 max-w-2xl">
              Short videos featuring warm-light setups, styling ideas, and product highlights.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-4 sm:px-6 lg:px-8">
        {reels.map((reel) => {
          const isLiked = liked.has(reel.id)
          return (
            <article
              key={reel.id}
              className="rounded-2xl border border-[#FFDA03]/20 bg-[#5c3418] shadow-sm overflow-hidden"
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
                  className="inline-flex items-center gap-2 rounded-full border border-[#FFDA03]/20 bg-[#5c3418] px-3 py-2 text-xs font-semibold text-white/90 hover:bg-[#5c3418]/80"
                >
                  {isLiked ? (
                    <FaHeart className="text-rose-600" />
                  ) : (
                    <FaRegHeart className="text-white/70" />
                  )}
                  {isLiked ? 'Liked' : 'Like'}
                </button>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#FFDA03]/20 bg-[#5c3418] px-3 py-2 text-xs font-semibold text-white/90 hover:bg-[#5c3418]/80"
                >
                  <FaShare className="text-white/70" />
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
