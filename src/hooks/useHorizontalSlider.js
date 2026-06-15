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
    checkScroll()
    const el = scrollContainerRef.current
    if (!el) return undefined

    const resizeObserver = new ResizeObserver(checkScroll)
    resizeObserver.observe(el)
    window.addEventListener('resize', checkScroll)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll, itemsLength])

  const scroll = useCallback((direction) => {
    const el = scrollContainerRef.current
    if (!el) return

    const firstChild = el.firstElementChild
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || '0') || 20
    const scrollAmount = firstChild
      ? firstChild.getBoundingClientRect().width + gap
      : el.clientWidth * 0.8

    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }, [])

  return { scrollContainerRef, canScrollLeft, canScrollRight, checkScroll, scroll }
}
