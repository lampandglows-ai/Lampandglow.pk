import { useEffect, useState } from 'react'
import announcementService from '../utils/announcementService.js'

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false)
  const [announcement, setAnnouncement] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const [active, enabled] = await Promise.all([
          announcementService.getActiveAnnouncement(),
          announcementService.getAnnouncementBarEnabled(),
        ])
        if (!mounted) return
        if (!enabled) {
          setVisible(false)
          return
        }
        setAnnouncement(active)
        setVisible(active !== null)
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

  if (!visible || !announcement) return null
  const bg = announcement.bgColor || '#1a0f00'
  const tc = announcement.textColor || '#ffffff'
  const scrollSpeed = announcement.scrollSpeed || 20

  return (
    <div
      className="w-full z-[60]"
      style={{ backgroundColor: bg, color: tc }}
    >
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
              className="inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 text-xs sm:text-sm md:text-base shrink-0"
              dangerouslySetInnerHTML={{ __html: announcement.message }}
            />
          ))}
        </div>
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
