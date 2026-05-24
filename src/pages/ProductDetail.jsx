import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import classNames from '../utils/classNames.js'
import { getDiscountInfo } from '../utils/discountHelpers.js'

/* ────────── helper: accordion chevron icon ────────── */
function ChevronDown({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={classNames(
        'h-4 w-4 shrink-0 transition-transform duration-300',
        open ? 'rotate-180' : '',
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

/* ────────── helper: accordion section ────────── */
function Accordion({ icon, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-stone-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 py-4 text-left text-sm font-semibold text-stone-800 transition-colors hover:text-stone-900"
      >
        <span className="flex items-center gap-2.5">
          {icon}
          {title}
        </span>
        <ChevronDown open={open} />
      </button>
      <div
        className={classNames(
          'overflow-hidden transition-all duration-300',
          open ? 'max-h-[600px] pb-5 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="text-[13px] leading-relaxed text-stone-600">{children}</div>
      </div>
    </div>
  )
}

export default function ProductDetail({ products, onAddToCart, reviews }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const productId = id
  const product = products.find((p) => String(p.id) === String(productId))
  const [selectedBulbOption, setSelectedBulbOption] = useState('')
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [isCompareOpen, setIsCompareOpen] = useState(false)
  const [compareVisibleIndices, setCompareVisibleIndices] = useState([]) // indices of visible images in compare modal
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const productReviews = reviews.filter((r) => r.productId === productId)
  const avgRating =
    productReviews.length === 0
      ? null
      : productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length

  /* ── not found ── */
  if (!product) {
    return (
      <section className="w-full px-0 py-10 sm:py-14">
        <div className="px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800"
          >
            <span aria-hidden>←</span>
            Back
          </button>
          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-700">
            Product not found.
          </div>
        </div>
      </section>
    )
  }

  /* ── derived data ── */
  const stock = typeof product.stock === 'number' ? product.stock : 0
  const inStock = stock > 0
  const bulbOptions = Array.isArray(product.bulbOptions) ? product.bulbOptions : []
  const sku = product.sku || `LG-${String(product.id).padStart(4, '0')}`
  const baseColors = Array.isArray(product?.productDetails?.baseColors) ? product.productDetails.baseColors : []

  // Initialize compare visible indices when modal opens
  useEffect(() => {
    if (isCompareOpen) {
      setCompareVisibleIndices(baseColors.map((_, i) => i))
    }
  }, [isCompareOpen, baseColors])

  const safeColorIndex = Math.min(Math.max(selectedColorIndex, 0), Math.max(baseColors.length - 1, 0))
  const selectedColor = baseColors[safeColorIndex] || ''

  const getSwatchHex = (value) => {
    const key = String(value || '').toLowerCase()
    if (key.includes('espresso')) return '#3b2a22'
    if (key.includes('walnut')) return '#6b4f2d'
    if (key.includes('brown')) return '#5c3b2e'
    if (key.includes('black')) return '#111827'
    if (key.includes('white')) return '#f8fafc'
    if (key.includes('natural')) return '#c8a97b'
    if (key.includes('beige')) return '#e7d8c5'
    if (key.includes('cream')) return '#f3ead7'
    return '#d6d3d1'
  }

  useEffect(() => {
    if (!isCompareOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsCompareOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isCompareOpen])

  const images = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images
    }
    return [product.image, product.image, product.image]
  }, [product.image, product.images])

  const selectedImage = images[Math.min(activeImageIndex, images.length - 1)]

  // ── Price Calculation ──
  const discountInfo = getDiscountInfo(product)
  const basePrice = discountInfo.discountedPrice
  const baseOriginalPrice = discountInfo.originalPrice

  // Option 1: Bulb Add-on (+500 if "With Bulb" is explicitly selected)
  // Fix: Ensure we don't match "Without Bulb" which contains "with" substring.
  const selectedBulb = selectedBulbOption || (bulbOptions[0] ?? '')
  const isWithBulb = selectedBulb && String(selectedBulb).toLowerCase().includes('with') && !String(selectedBulb).toLowerCase().includes('without')
  const bulbAddon = isWithBulb ? 500 : 0

  // Option 2: Color Add-on (Specific for 'Black'/'Blue' premium color as requested)
  // User requested: "only when we click on the blue color it increase the price 250"
  // Data has "Black", so we check for Black or Blue.
  const colorAddon = (selectedColor && (selectedColor.toLowerCase().includes('black') || selectedColor.toLowerCase().includes('blue'))) ? 250 : 0

  const effectivePrice = basePrice + bulbAddon + colorAddon
  const effectiveOriginalPrice = baseOriginalPrice + bulbAddon + colorAddon

  const hasDiscount = discountInfo.hasDiscount
  const discountPercent = hasDiscount
    ? Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)
    : 0

  const formatPKR = (amount) =>
    `Rs.${Number(amount).toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`

  const productType = product.productType || (product.category === 'Lamps' ? 'Floor lamp' : 'Wood decor')

  const renderStars = (rating) => {
    const value = Math.round(rating)
    return (
      <div className="flex items-center gap-0.5 text-amber-500" aria-label={`${value} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <svg
            key={idx}
            viewBox="0 0 24 24"
            className={classNames('h-4 w-4', idx < value ? 'fill-current' : 'fill-transparent')}
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M12 17.27l-5.18 3.04 1.4-5.81-4.52-3.92 5.95-.5L12 4.5l2.35 5.58 5.95.5-4.52 3.92 1.4 5.81L12 17.27z"
            />
          </svg>
        ))}
      </div>
    )
  }

  const addQuantityToCart = () => {
    if (!inStock) return
    const count = Math.max(1, Math.min(quantity, Math.max(stock, 1)))
    const payload = { product, bulbOption: selectedBulb || null, unitPrice: effectivePrice }
    for (let i = 0; i < count; i += 1) {
      onAddToCart(payload)
    }
  }

  /* ── related products (exclude current) ── */
  const relatedProducts = products.filter((p) => p.id !== productId).slice(0, 6)

  /* ── product details for description ── */
  const pd = product.productDetails || {}

  return (
    <section className="w-full bg-white">
      {/* ═══════════════ BREADCRUMBS ═══════════════ */}
      <div className="border-b border-stone-100">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-1.5 py-4 text-[12px] text-stone-500">
            <button type="button" onClick={() => navigate('/')} className="hover:text-stone-800 transition-colors">
              Home
            </button>
            <span aria-hidden className="text-stone-300">/</span>
            <span className="hover:text-stone-800 transition-colors cursor-pointer">{product.category}</span>
            <span aria-hidden className="text-stone-300">/</span>
            <span className="text-stone-800 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* ═══════════════ MAIN PRODUCT AREA ═══════════════ */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* ─── LEFT: Image Gallery ─── */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative overflow-hidden bg-stone-50 group">
              {hasDiscount && (
                <span className="absolute left-0 top-0 z-10 bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white tracking-wide uppercase">
                  Sale
                </span>
              )}
              <div className="aspect-[3/4] sm:aspect-[4/5]">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
            </div>

            {/* Horizontal Thumbnails */}
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {images.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={classNames(
                    'relative shrink-0 w-16 aspect-square overflow-hidden border-2 transition-all duration-200',
                    idx === activeImageIndex
                      ? 'border-stone-900 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80 hover:border-stone-300',
                  )}
                >
                  <img
                    src={src}
                    alt={`${product.name} view ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ─── RIGHT: Product Info ─── */}
          <div className="lg:sticky lg:top-24">
            {/* Title + Wishlist */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 leading-tight">
                {product.name}
              </h1>
              <button
                type="button"
                onClick={() => navigate('/wishlist')}
                className="mt-1 shrink-0 text-stone-400 hover:text-red-500 transition-colors"
                aria-label="Add to wishlist"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 21s-7-4.35-9.5-8.5C.5 9.5 2.5 6.5 6 6.5c2 0 3.5 1.2 4 2 0.5-0.8 2-2 4-2 3.5 0 5.5 3 3.5 6-2.5 4.15-9.5 8.5-9.5 8.5z" />
                </svg>
              </button>
            </div>

            {/* Reviews */}
            <div className="mt-2 flex items-center gap-2.5">
              {avgRating ? renderStars(avgRating) : renderStars(0)}
              <span className="text-xs text-stone-500">
                {productReviews.length} review{productReviews.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Short Description */}
            <p className="mt-4 text-[13px] text-stone-600 leading-relaxed">
              {product.description?.split('\n')[0] || `The ${product.name} is an elegant tribute to creativity and craftsmanship, offering a versatile design with endless combinations.`}
            </p>

            {/* Price */}
            <div className="mt-5 flex items-end gap-3">
              {hasDiscount ? (
                <>
                  <p className="text-base text-stone-400 line-through">{formatPKR(effectiveOriginalPrice)}</p>
                  <p className="text-2xl font-bold text-red-600">{formatPKR(effectivePrice)}</p>
                  <span className="inline-flex items-center bg-red-100 text-red-700 px-2 py-0.5 text-[11px] font-semibold rounded-sm">
                    Save {discountPercent}%
                  </span>
                </>
              ) : (
                <p className="text-2xl font-bold text-stone-900">{formatPKR(effectivePrice)}</p>
              )}
            </div>

            {/* Tax note */}
            <p className="mt-1.5 text-[11px] text-stone-400">Tax included.</p>

            {/* Stock indicator */}
            {inStock && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-red-600">
                  Hurry! Only {stock} left in stock
                </p>
                <div className="mt-1.5 h-1 w-full max-w-xs bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, (stock / 20) * 100))}%` }}
                  />
                </div>
              </div>
            )}

            {/* Metadata: SKU, Availability, Type */}
            <div className="mt-5 border-t border-stone-200 pt-5 space-y-2 text-[13px] text-stone-700">
              <div className="flex gap-2">
                <span className="w-28 text-stone-400 uppercase tracking-wide text-[11px]">SKU:</span>
                <span className="font-medium">{sku}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-28 text-stone-400 uppercase tracking-wide text-[11px]">Availability:</span>
                <span className={inStock ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="w-28 text-stone-400 uppercase tracking-wide text-[11px]">Product Type:</span>
                <span className="font-medium">{productType}</span>
              </div>
            </div>

            {/* ── Color Selector ── */}
            {baseColors.length > 0 && (
              <div className="mt-5 border-t border-stone-200 pt-5">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-stone-800">
                    Color: <span className="font-normal text-stone-500">{selectedColor}</span>
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  {baseColors.map((color, idx) => {
                    const active = idx === safeColorIndex
                    // Pattern image for swatch (mocking pattern by using product image)
                    const patternImg = images[Math.min(idx, Math.max(images.length - 1, 0))]

                    return (
                      <button
                        key={`${color}-${idx}`}
                        type="button"
                        onClick={() => {
                          setSelectedColorIndex(idx)
                          setActiveImageIndex(Math.min(idx, Math.max(images.length - 1, 0)))
                        }}
                        className={classNames(
                          'rounded-full p-0.5 transition-all duration-200 hover:scale-110',
                          active ? 'ring-2 ring-stone-900 ring-offset-2 ring-offset-white' : 'ring-1 ring-stone-200 ring-offset-1 ring-offset-white hover:ring-stone-400',
                        )}
                        aria-label={`Select color ${color}`}
                      >
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-stone-200 relative">
                          {/* Use image pattern if available, else standard color */}
                          <img src={patternImg} alt={color} className="h-full w-full object-cover" />
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Compare Color Button with Multi-color Wheel Icon */}
                <button
                  type="button"
                  onClick={() => setIsCompareOpen(true)}
                  className="mt-4 flex items-center gap-2 text-[13px] font-medium text-stone-700 hover:text-stone-900 hover:underline transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                    <circle cx="12" cy="12" r="10" stroke="url(#color-wheel-gradient)" strokeWidth="3" />
                    <defs>
                      <linearGradient id="color-wheel-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#f87171" />
                        <stop offset="20%" stopColor="#fbbf24" />
                        <stop offset="40%" stopColor="#34d399" />
                        <stop offset="60%" stopColor="#60a5fa" />
                        <stop offset="80%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  Compare Color
                </button>
              </div>
            )}

            {/* ── Bulb Options ── */}
            {bulbOptions.length > 0 && (
              <div className="mt-5 border-t border-stone-200 pt-5">
                <p className="text-[13px] font-semibold text-stone-800">
                  Bulb: <span className="font-normal text-stone-500">{selectedBulbOption || bulbOptions[0]}</span>
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {bulbOptions.map((opt) => {
                    const active = selectedBulbOption ? selectedBulbOption === opt : opt === bulbOptions[0]
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedBulbOption(opt)}
                        className={classNames(
                          'px-4 py-2.5 border text-[13px] transition-all duration-200',
                          active
                            ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                            : 'border-stone-300 bg-white text-stone-700 hover:border-stone-500',
                        )}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Quantity + Add to Cart row ── */}
            <div className="mt-6 border-t border-stone-200 pt-5">
              <p className="text-[13px] text-stone-600">
                Subtotal: <span className="font-bold text-stone-900">{formatPKR(effectivePrice * Math.max(1, quantity))}</span>
              </p>

              <p className="mt-4 text-[13px] font-semibold text-stone-800">Quantity:</p>

              <div className="mt-2.5 flex items-center gap-3">
                {/* Quantity picker */}
                <div className="flex items-center border border-stone-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="h-12 w-12 grid place-items-center text-stone-600 text-lg transition-colors hover:bg-stone-50"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <div className="h-12 w-14 grid place-items-center text-sm font-semibold text-stone-900 border-x border-stone-300">
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(Math.max(stock, 99), prev + 1))}
                    className="h-12 w-12 grid place-items-center text-stone-600 text-lg transition-colors hover:bg-stone-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={addQuantityToCart}
                  className={classNames(
                    'h-12 flex-1 bg-stone-900 text-white text-[13px] font-semibold tracking-wide uppercase transition-all duration-300 hover:bg-amber-700 active:scale-[0.99]',
                    !inStock && 'opacity-50 cursor-not-allowed',
                  )}
                  disabled={!inStock}
                >
                  Add To Cart
                </button>
              </div>

              {/* Buy It Now */}
              <button
                type="button"
                onClick={() => {
                  addQuantityToCart()
                  if (!inStock) return
                  navigate('/checkout')
                }}
                className={classNames(
                  'mt-3 h-12 w-full border-2 border-stone-900 bg-white text-[13px] font-semibold tracking-wide uppercase text-stone-900 transition-all duration-300 hover:bg-stone-900 hover:text-white active:scale-[0.99]',
                  !inStock && 'opacity-50 cursor-not-allowed',
                )}
                disabled={!inStock}
              >
                Buy It Now
              </button>

              {/* Share row */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-[12px] text-stone-500 uppercase tracking-wide font-semibold">Share</span>
                <div className="flex items-center gap-2">
                  {/* Facebook */}
                  <button type="button" className="h-8 w-8 grid place-items-center text-stone-400 hover:text-blue-600 transition-colors" aria-label="Share on Facebook">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  </button>
                  {/* Twitter / X */}
                  <button type="button" className="h-8 w-8 grid place-items-center text-stone-400 hover:text-stone-900 transition-colors" aria-label="Share on Twitter">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </button>
                  {/* Pinterest */}
                  <button type="button" className="h-8 w-8 grid place-items-center text-stone-400 hover:text-red-600 transition-colors" aria-label="Share on Pinterest">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 0a12 12 0 0 0-4.37 23.17c-.02-.94-.004-2.07.24-3.09l1.73-7.33s-.43-.86-.43-2.13c0-2 1.16-3.5 2.6-3.5 1.23 0 1.82.92 1.82 2.02 0 1.23-.78 3.07-1.18 4.78-.34 1.42.71 2.58 2.1 2.58 2.52 0 4.21-3.24 4.21-7.07 0-2.92-1.97-5.1-5.55-5.1a6.4 6.4 0 0 0-6.63 6.45c0 1.17.35 2 .89 2.63.25.3.28.41.19.75l-.27 1.07c-.09.35-.36.47-.66.34-1.84-.75-2.7-2.77-2.7-5.04 0-3.75 3.16-8.24 9.42-8.24 5.04 0 8.34 3.64 8.34 7.55 0 5.17-2.88 9.04-7.12 9.04-1.42 0-2.76-.77-3.22-1.64l-.92 3.58c-.3 1.1-.89 2.2-1.43 3.07A12 12 0 1 0 12 0z" /></svg>
                  </button>
                  {/* Email */}
                  <button type="button" className="h-8 w-8 grid place-items-center text-stone-400 hover:text-stone-700 transition-colors" aria-label="Share via email">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Viewers badge ── */}
            <div className="mt-5 flex items-center gap-2 text-[12px] text-stone-500">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>{Math.floor(Math.random() * 20) + 10} customers are viewing this product</span>
            </div>

            {/* ═══ Accordion: Free Shipping / Free Returns / Our Promise ═══ */}
            <div className="mt-6 border-t border-stone-200">
              <Accordion
                defaultOpen={false}
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-stone-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="6" width="15" height="12" rx="1" /><path d="M16 10h4l3 4v4h-7V10z" /><circle cx="5.5" cy="18" r="2" /><circle cx="19.5" cy="18" r="2" />
                  </svg>
                }
                title="Free Shipping"
              >
                <p>Free standard shipping on orders over 10,000 PKR</p>
                <p className="mt-2">All in-stock products will be delivered within <strong>3 to 5 days</strong>. Custom designs will take 8 to 12 days to complete and ship.</p>
              </Accordion>

              <Accordion
                defaultOpen={false}
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-stone-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 14l-4-4 4-4" /><path d="M5 10h11a4 4 0 0 1 0 8h-1" />
                  </svg>
                }
                title="Free Returns"
              >
                <p>At Lamp&amp;Glow, we stand by the quality of our handcrafted wooden lamps and want you to be completely satisfied with your purchase.</p>
                <p className="mt-2">You may return most new, unopened items within <strong>7 days</strong> of delivery for a full refund. If the return is due to our error, we will cover the return shipping costs.</p>
                <h4 className="mt-3 font-semibold text-stone-700">How to Initiate a Return</h4>
                <ol className="mt-1 list-decimal pl-5 space-y-1">
                  <li>Log in to your account.</li>
                  <li>Navigate to the "Complete Orders" section under My Account.</li>
                  <li>Click the "Return Item(s)" button and follow the instructions.</li>
                  <li>You will receive an email notification once your return has been processed.</li>
                </ol>
              </Accordion>

              <Accordion
                defaultOpen={false}
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-stone-600" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
                  </svg>
                }
                title="Our Promise"
              >
                <p>Every product is handcrafted with premium-quality wood and materials. We ensure:</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Built and shipped within 3-5 business days.</li>
                  <li>Quality check before every dispatch.</li>
                  <li>Dedicated customer support via WhatsApp and email.</li>
                </ul>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ COMPARE COLOR MODAL (Pixel Match) ═══════════════ */}
      {isCompareOpen && baseColors.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCompareOpen(false)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-4xl bg-white shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Compare Color"
          >
            {/* Close Button (Black Square Top-Right) */}
            <button
              type="button"
              onClick={() => setIsCompareOpen(false)}
              className="absolute right-0 top-0 z-10 flex h-10 w-10 items-center justify-center bg-black text-white hover:bg-stone-800 transition-colors"
              aria-label="Close compare"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 13L13 1M1 1l12 12" />
              </svg>
            </button>

            <div className="p-8 sm:p-12">
              {/* Header Title */}
              <h3 className="mb-6 text-base font-bold text-stone-900">Compare Color</h3>

              {/* Swatches Row */}
              <div className="mb-10 flex items-center gap-4">
                {baseColors.map((color, idx) => {
                  const active = idx === safeColorIndex
                  const patternImg = images[Math.min(idx, Math.max(images.length - 1, 0))]

                  return (
                    <button
                      key={`compare-swatch-${color}-${idx}`}
                      type="button"
                      onClick={() => {
                         // Toggle visibility
                         setCompareVisibleIndices(prev => 
                           prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                         )
                      }}
                      className={classNames(
                        'rounded-full p-[3px] transition-all duration-200',
                        compareVisibleIndices.includes(idx) ? 'ring-1 ring-black opacity-100' : 'ring-1 ring-stone-200 opacity-40 grayscale hover:opacity-70',
                      )}
                      aria-label={`Toggle visibility for ${color}`}
                    >
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-stone-200 relative">
                         <img src={patternImg} alt={color} className="h-full w-full object-cover" />
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Images Grid (Portrait) - Only show visible */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {baseColors
                  .map((color, idx) => ({ color, idx })) // retain original index for image access
                  .filter(({ idx }) => compareVisibleIndices.includes(idx))
                  .map(({ color, idx }) => {
                  const imageSrc = images[Math.min(idx, Math.max(images.length - 1, 0))] || selectedImage
                  return (
                    <div 
                      key={`compare-card-${color}-${idx}`} 
                      className="group cursor-pointer flex flex-col items-center animate-fadeIn"
                      onClick={() => { setSelectedColorIndex(idx); setIsCompareOpen(false); }}
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden bg-stone-50 mb-4 transition-opacity group-hover:opacity-90">
                        <img src={imageSrc} alt={color} className="h-full w-full object-cover object-center" />
                      </div>
                      <p className="text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">{color}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ TABS: Description / Shipping & Return / Reviews ═══════════════ */}
      <div className="border-t border-stone-200 bg-stone-50/60">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          {/* Tab headers */}
          <div className="flex items-center gap-0 border-b border-stone-200">
            {['description', 'shipping', 'reviews'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={classNames(
                  'relative px-6 py-4 text-[13px] font-semibold tracking-wide uppercase transition-colors duration-200',
                  activeTab === tab
                    ? 'text-stone-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-stone-900'
                    : 'text-stone-400 hover:text-stone-600',
                )}
              >
                {tab === 'description' ? 'Description' : tab === 'shipping' ? 'Shipping & Return' : `Reviews (${productReviews.length})`}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-8 sm:py-10">
            {activeTab === 'description' ? (
              <div className="max-w-3xl text-sm text-stone-700 leading-7 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900">{product.name}</h3>
                  <p className="mt-1 text-stone-500 italic">{product.description?.split('\n')[1] || 'A grounded silhouette with elevated simplicity.'}</p>
                </div>

                <p>
                  {product.description || `The ${product.name} is an elegant tribute to creativity and craftsmanship, offering a versatile design with endless combinations. Handcrafted from solid wood, this lightweight yet durable piece is perfect for adding a stylish and functional element to your living space.`}
                </p>

                {/* Product Details table */}
                {Object.keys(pd).length > 0 && (
                  <div>
                    <h4 className="text-base font-bold text-stone-900 mt-2">Product Details</h4>
                    <div className="mt-3 space-y-0">
                      {Object.entries(pd).map(([key, value]) => {
                        if (Array.isArray(value)) {
                          return (
                            <div key={key} className="flex border-b border-stone-100 py-2.5">
                              <span className="w-48 text-stone-500 capitalize text-[13px]">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="text-[13px] font-medium text-stone-800">{value.join(', ')}</span>
                            </div>
                          )
                        }
                        return (
                          <div key={key} className="flex border-b border-stone-100 py-2.5">
                            <span className="w-48 text-stone-500 capitalize text-[13px]">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-[13px] font-medium text-stone-800">{value}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-base font-bold text-stone-900">Why You'll Love It</h4>
                  <ul className="mt-3 space-y-2">
                    <li className="flex gap-2">
                      <span className="text-amber-600 mt-0.5">✦</span>
                      <span><strong>Sculptural Simplicity</strong> – Smooth, rounded wood base in rich tones that ground your space</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 mt-0.5">✦</span>
                      <span><strong>Soft Diffused Light</strong> – Wide shade offers an elegant glow, ideal for evening ambience</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 mt-0.5">✦</span>
                      <span><strong>Handcrafted Quality</strong> – Each piece is individually made with care and attention to detail</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-600 mt-0.5">✦</span>
                      <span><strong>Versatile Placement</strong> – Perfect for living rooms, bedrooms, reading corners, and offices</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-base font-bold text-stone-900">Care Instructions</h4>
                  <ul className="mt-3 list-disc pl-5 space-y-1.5 text-stone-600">
                    <li>Wipe wood with a dry or lightly damp cloth</li>
                    <li>Dust shade gently with a soft brush or lint-free cloth</li>
                    <li>Avoid exposure to moisture or direct sunlight</li>
                  </ul>
                </div>

                <p className="text-[12px] text-stone-400 italic mt-4">
                  Note: Each base is handcrafted and may display subtle variations in wood grain and tone — part of its natural charm.
                </p>
              </div>
            ) : activeTab === 'shipping' ? (
              <div className="max-w-3xl text-sm text-stone-700 leading-7 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Returns Policy</h3>
                  <p className="mt-2">
                    You may return most new, unopened items within <strong>7 days</strong> of delivery for a full refund.
                    We'll also pay the return shipping costs if the return is a result of our error (you received an incorrect or defective item, etc.).
                  </p>
                  <p className="mt-2">
                    You should expect to receive your refund within four weeks of giving your package to the return shipper.
                    This time period includes the transit time for us to receive your return from the shipper (5 to 10 business days),
                    the time it takes us to process your return once we receive it (3 to 5 business days),
                    and the time it takes your bank to process our refund request (5 to 10 business days).
                  </p>
                  <p className="mt-2">
                    If you need to return an item, simply login to your account, view the order using the "Complete Orders" link under the My Account menu and click the Return Item(s) button. We'll notify you via e-mail of your refund once we've received and processed the returned item.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Shipping</h3>
                  <p className="mt-2">
                    We can ship to virtually any address in Pakistan. Free standard shipping on orders over 10,000 PKR. Orders are typically dispatched within 1-2 business days.
                  </p>
                  <p className="mt-2">
                    When you place an order, we will estimate shipping and delivery dates for you based on the availability of your items and the shipping options you choose.
                  </p>
                  <p className="mt-2">
                    All in-stock products will be delivered within <strong>3 to 5 days</strong>. Custom designs will take 8 to 12 days to complete and ship.
                  </p>
                </div>
              </div>
            ) : (
              /* ── Reviews Tab ── */
              <div className="max-w-3xl space-y-8">
                {/* Review Summary */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-stone-900">{avgRating ? avgRating.toFixed(1) : '0.0'}</p>
                    <div className="mt-1">{renderStars(avgRating || 0)}</div>
                    <p className="mt-1 text-xs text-stone-500">Based on {productReviews.length} review{productReviews.length === 1 ? '' : 's'}</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = productReviews.filter((r) => Math.round(r.rating) === star).length
                      const pct = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-4 text-stone-500 text-right">{star}</span>
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-amber-500 fill-current"><path d="M12 17.27l-5.18 3.04 1.4-5.81-4.52-3.92 5.95-.5L12 4.5l2.35 5.58 5.95.5-4.52 3.92 1.4 5.81z" /></svg>
                          <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-6 text-stone-400">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Review List */}
                {productReviews.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-stone-400 text-sm">No reviews yet for this product.</p>
                    <p className="text-stone-400 text-xs mt-1">Be the first to write a review!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {productReviews.map((review) => (
                      <div key={review.id} className="py-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-stone-200 grid place-items-center text-sm font-bold text-stone-600">
                              {review.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-stone-900">{review.name}</p>
                              <p className="text-[11px] text-stone-400">{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <p className="mt-3 text-[13px] text-stone-600 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════ TRUST BADGES ═══════════════ */}
      <div className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-stone-700" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M3 3h7l2 3h9v13H3z" /><path d="M3 8h18" />
              </svg>
              <p className="text-[12px] font-bold text-stone-800 uppercase tracking-wide">Dedicated Support</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-stone-700" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M9 14l-4-4 4-4" /><path d="M5 10h11a4 4 0 0 1 0 8h-1" />
              </svg>
              <p className="text-[12px] font-bold text-stone-800 uppercase tracking-wide">7 Days Free Returns</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-stone-700" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
              </svg>
              <p className="text-[12px] font-bold text-stone-800 uppercase tracking-wide">Safe Payment</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-stone-700" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p className="text-[12px] font-bold text-stone-800 uppercase tracking-wide">Online Discounts</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ RELATED PRODUCTS ═══════════════ */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Related Products</h2>
            <p className="mt-1 text-sm text-stone-500">You may also like</p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((rp) => {
                const rpInfo = getDiscountInfo(rp)

                return (
                  <Link
                    key={rp.id}
                    to={`/product/${rp.id}`}
                    className="group block overflow-hidden bg-white border border-stone-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-stone-300"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                      {rpInfo.hasDiscount && (
                        <span className="absolute left-0 top-0 z-10 bg-red-600 px-2 py-1 text-[10px] font-bold text-white tracking-wide">
                          -{rpInfo.discountPercent}%
                        </span>
                      )}
                      <img
                        src={rp.image}
                        alt={rp.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-[13px] font-semibold text-stone-900 leading-snug line-clamp-2">
                        {rp.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                        {rpInfo.hasDiscount ? (
                          <>
                            <span className="text-stone-400 line-through text-[12px]">
                              Rs.{rpInfo.originalPrice.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="font-bold text-red-600 text-[13px]">
                              Rs.{rpInfo.discountedPrice.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-stone-900 text-[13px]">
                            Rs.{rp.price.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ RECENTLY VIEWED (mock with other products) ═══════════════ */}
      {relatedProducts.length > 2 && (
        <div className="border-t border-stone-200 bg-stone-50/40">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Recently Viewed Products</h2>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 5).map((rp) => {
                const rpInfo = getDiscountInfo(rp)
                return (
                  <Link key={`rv-${rp.id}`} to={`/product/${rp.id}`} className="group block overflow-hidden bg-white border border-stone-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="aspect-square overflow-hidden bg-stone-100">
                      <img src={rp.image} alt={rp.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-[12px] font-semibold text-stone-900 leading-snug line-clamp-2">{rp.name}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-[12px]">
                        {rpInfo.hasDiscount && <span className="text-stone-400 line-through">Rs.{rpInfo.originalPrice.toLocaleString('en-PK')}</span>}
                        <span className={rpInfo.hasDiscount ? 'font-bold text-red-600' : 'font-bold text-stone-900'}>Rs.{rpInfo.discountedPrice.toLocaleString('en-PK')}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
