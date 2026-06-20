import { useRef, useState, useEffect, useCallback } from 'react'

export function useHorizontalSlider(itemsLength = 0) {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 1)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }, [])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return undefined

    // Delay initial check to allow DOM to render
    const timer = setTimeout(() => {
      checkScroll()
    }, 150)

    const resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(el)
    window.addEventListener('resize', checkScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkScroll)
      resizeObserver.disconnect()
    }
  }, [checkScroll, itemsLength])

  const scroll = useCallback((direction) => {
    const el = scrollContainerRef.current
    if (!el) return

    // Fixed scroll amount for reliable behavior
    const scrollAmount = 320

    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })

    // Recheck scroll state after animation
    setTimeout(() => checkScroll(), 500)
  }, [checkScroll])

  return { scrollContainerRef, canScrollLeft, canScrollRight, checkScroll, scroll }
}
