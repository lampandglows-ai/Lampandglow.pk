import { useEffect, useState } from 'react'
import announcementService from '../utils/announcementService.js'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [active, enabled] = await Promise.all([
          announcementService.getActiveAnnouncements(),
          announcementService.getAnnouncementBarEnabled(),
        ])
        if (!mounted) return
        if (!enabled) {
          setVisible(false)
          return
        }
        setAnnouncements(active)
        setVisible(active.length > 0)
      } catch (e) {
        console.error('Error loading announcement bar:', e)
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

  if (!visible || announcements.length === 0) return null

  const announcement = announcements[currentIndex] || announcements[0]
  const bg = announcement.bgColor || '#1a0f00'
  const tc = announcement.textColor || '#ffffff'
  const isMarquee = announcement.displayStyle === 'marquee'
  const scrollSpeed = announcement.scrollSpeed || 20

  return (
    <div
      className="w-full z-[60]"
      style={{ backgroundColor: bg, color: tc }}
    >
      <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 py-2 text-xs sm:text-sm md:text-base min-h-[2.5rem]">
        {isMarquee ? (
          <div className="overflow-hidden w-full">
            <div
              className="whitespace-nowrap flex"
              style={{
                animation: `marquee-scroll ${scrollSpeed}s linear infinite`,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 shrink-0"
                  dangerouslySetInnerHTML={{ __html: announcement.message }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center gap-3 flex-wrap font-medium text-center"
            dangerouslySetInnerHTML={{ __html: announcement.message }}
          />
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
