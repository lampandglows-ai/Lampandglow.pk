import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Truck } from 'lucide-react'
import announcementService from '../utils/announcementService.js'

export default function AnnouncementBar() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [debugInfo, setDebugInfo] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [active, enabled] = await Promise.all([
          announcementService.getActiveAnnouncements(),
          announcementService.getAnnouncementBarEnabled(),
        ])
        if (!mounted) return
        console.log('AnnouncementBar debug:', { activeCount: active.length, enabled, dismissed })
        setDebugInfo({ activeCount: active.length, enabled, error: null })
        if (!enabled) {
          setVisible(false)
          return
        }
        setAnnouncements(active)
        setVisible(active.length > 0 && !dismissed)
      } catch (e) {
        console.error('Error loading announcement bar:', e)
        if (!mounted) return
        setDebugInfo({ activeCount: 0, enabled: null, error: e.message || String(e) })
      }
    }
    load()
    const interval = setInterval(load, 30000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [dismissed])

  useEffect(() => {
    if (announcements.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % announcements.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [announcements.length])

  const handleClose = () => {
    setVisible(false)
    setDismissed(true)
  }

  const handleClick = (announcement) => {
    const hasCta = !!announcement.buttonUrl?.trim()
    const isFreeShipping = announcement.message?.toLowerCase().includes('free shipping') && announcement.freeShippingLink !== false
    if (hasCta) {
      const url = announcement.buttonUrl.trim()
      if (url.startsWith('/')) {
        navigate(url)
      } else {
        window.open(url, '_blank')
      }
    } else if (isFreeShipping) {
      navigate('/about')
    }
  }

  if ((!visible || announcements.length === 0) && !debugInfo?.error) {
    // Temporarily render a thin debug strip so we can diagnose empty-state issues
    if (debugInfo && debugInfo.activeCount === 0) {
      return (
        <div className="w-full bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 text-center">
          Debug: 0 active announcements (bar enabled: {String(debugInfo.enabled)})
        </div>
      )
    }
    return null
  }

  if (debugInfo?.error) {
    return (
      <div className="w-full bg-red-100 text-red-800 text-[10px] px-2 py-0.5 text-center">
        Debug: {debugInfo.error}
      </div>
    )
  }

  const announcement = announcements[currentIndex] || announcements[0]
  const bg = announcement.bgColor || '#1a0f00'
  const tc = announcement.textColor || '#ffffff'
  const isMarquee = announcement.displayStyle === 'marquee'
  const hasCta = !!announcement.buttonText?.trim() && !!announcement.buttonUrl?.trim()
  const isFreeShipping = announcement.message?.toLowerCase().includes('free shipping') && announcement.freeShippingLink !== false
  const clickable = hasCta || isFreeShipping

  return (
    <div
      className="relative w-full z-50"
      style={{ backgroundColor: bg, color: tc }}
    >
      <div className="flex items-center justify-center px-8 py-2 text-sm">
        {isMarquee ? (
          <div className="overflow-hidden w-full">
            <div
              className="whitespace-nowrap flex"
              style={{
                animation: 'marquee-scroll 20s linear infinite',
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="inline-block px-8 shrink-0">
                  {announcement.message}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {isFreeShipping && <Truck className="w-4 h-4" />}
            <span className="font-medium">{announcement.message}</span>
            {(hasCta || isFreeShipping) && (
              <button
                onClick={() => handleClick(announcement)}
                className="px-3 py-1 rounded text-xs font-semibold transition hover:opacity-90"
                style={{
                  backgroundColor: tc,
                  color: bg,
                }}
              >
                {isFreeShipping && !hasCta ? 'View Policy' : announcement.buttonText}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition"
        aria-label="Close announcement"
      >
        <X className="w-4 h-4" />
      </button>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
