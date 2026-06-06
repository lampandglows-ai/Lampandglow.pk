import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Truck } from 'lucide-react'
import announcementService from '../utils/announcementService.js'

export default function AnnouncementBar() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
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
        setDebugInfo({ activeCount: active.length, enabled, error: null })
        if (!enabled) {
          setVisible(false)
          return
        }
        setAnnouncements(active)
        setVisible(active.length > 0)
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
  }, [])

  useEffect(() => {
    if (announcements.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % announcements.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [announcements.length])

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

  if (!visible || announcements.length === 0) return null

  const announcement = announcements[currentIndex] || announcements[0]
  const bg = announcement.bgColor || '#1a0f00'
  const tc = announcement.textColor || '#ffffff'
  const isMarquee = announcement.displayStyle === 'marquee'
  const hasCta = !!announcement.buttonText?.trim() && !!announcement.buttonUrl?.trim()
  const isFreeShipping = announcement.message?.toLowerCase().includes('free shipping') && announcement.freeShippingLink !== false
  const clickable = hasCta || isFreeShipping

  return (
    <div
      className="sticky top-0 w-full z-[60]"
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

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
