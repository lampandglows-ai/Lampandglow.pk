import { useMemo, useState, useEffect } from 'react'
import { FaHeart, FaSearch, FaShoppingCart, FaUserAlt } from 'react-icons/fa'
import { Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logoPng from '../assets/logo.png'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Header({
  activeSection,
  cartItemsCount,
  handleNavigate,
  mobileNavOpen,
  navigateToWishlist,
  products,
  searchQuery,
  setMobileNavOpen,
  setSearchQuery,
  theme,
  toggleTheme,
}) {
  const navigate = useNavigate()
  const [logoError, setLogoError] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    if (!searchOpen) return
    const handlePointerDown = (event) => {
      if (!event.target.closest('[data-search-root="true"]')) {
        setSearchOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [searchOpen])

  useEffect(() => {
    if (!mobileNavOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileNavOpen])

  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!Array.isArray(products)) return []

    const base = q
      ? products.filter((p) => {
        const name = String(p.name ?? '').toLowerCase()
        const category = String(p.category ?? '').toLowerCase()
        return name.includes(q) || category.includes(q)
      })
      : products

    return base.slice(0, 6)
  }, [products, searchQuery])

  function handlePickSuggestion(product) {
    if (!product) return
    setSearchQuery(product.name ?? '')
    setSearchOpen(false)
    navigate(`/product/${product.id}`)
  }

  return (
    <header
      className={classNames(
        'fixed top-0 left-0 right-0 z-50 border-b',
        theme === 'dark' ? 'bg-[#1a0f00] border-white/10' : 'bg-white border-stone-200',
      )}
    >
      <div className="bg-amber-600 text-white text-xs sm:text-sm font-semibold lg-marquee">
        <div className="lg-marquee__inner py-2">
          <div className="lg-marquee__track">
            <span className="lg-marquee__item">Enjoy Free Shipping on orders over 10,000</span>
            <span className="lg-marquee__item">Enjoy Free Shipping on orders over 10,000</span>
            <span className="lg-marquee__item">Enjoy Free Shipping on orders over 10,000</span>
            <span className="lg-marquee__item">Enjoy Free Shipping on orders over 10,000</span>
          </div>
          <div className="lg-marquee__track" aria-hidden="true">
            <span className="lg-marquee__item">Enjoy Free Shipping on orders over 10,000</span>
            <span className="lg-marquee__item">Enjoy Free Shipping on orders over 10,000</span>
            <span className="lg-marquee__item">Enjoy Free Shipping on orders over 10,000</span>
            <span className="lg-marquee__item">Enjoy Free Shipping on orders over 10,000</span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
        <button onClick={() => handleNavigate('home')} className="flex items-center gap-2 flex-shrink-0">
          {logoError ? (
            <div className="h-[68px] w-[68px] p-3 sm:h-20 sm:w-20">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-2xl">LG</span>
              </div>
            </div>
          ) : (
            <div className="h-[68px] w-[68px] p-3 sm:h-20 sm:w-20">
              <img
                src={logoPng}
                alt="Lamp & Glow"
                className="h-full w-full object-contain"
                onError={() => setLogoError(true)}
              />
            </div>
          )}
        </button>

        <nav
          className={classNames(
            'hidden lg:flex items-center gap-7 text-xs font-semibold tracking-[0.12em]',
            theme === 'dark' ? 'text-stone-200' : 'text-stone-700',
          )}
        >
          <button
            onClick={() => handleNavigate('categories')}
            className="transition-all duration-200 hover:text-amber-700 hover:-translate-y-0.5 motion-reduce:transform-none"
          >
            COLLECTION
          </button>
          <button
            onClick={() => handleNavigate('products')}
            className="transition-all duration-200 hover:text-amber-700 hover:-translate-y-0.5 motion-reduce:transform-none"
          >
            PRODUCTS
          </button>
          <button
            onClick={() => handleNavigate('blogs')}
            className="transition-all duration-200 hover:text-amber-700 hover:-translate-y-0.5 motion-reduce:transform-none"
          >
            BLOG
          </button>
          <button
            onClick={() => handleNavigate('reels')}
            className="transition-all duration-200 hover:text-amber-700 hover:-translate-y-0.5 motion-reduce:transform-none"
          >
            REELS
          </button>
        </nav>

        <div className="hidden md:flex flex-1 relative" data-search-root="true">
          <div className="w-full flex items-center gap-3 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 shadow-sm">
            <FaSearch className="text-stone-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => {
                window.setTimeout(() => setSearchOpen(false), 120)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNavigate('products')
                  setSearchOpen(false)
                }
              }}
              type="text"
              placeholder="Search entire store here..."
              className={classNames(
                'w-full bg-transparent text-sm placeholder:text-stone-400 focus:outline-none',
                theme === 'dark' ? 'text-stone-100' : 'text-stone-800',
              )}
            />
          </div>

          {searchOpen ? (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-stone-200 bg-white shadow-lg overflow-hidden z-30">
              {searchSuggestions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-stone-600">No matching products.</div>
              ) : (
                <ul className="py-2">
                  {searchSuggestions.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handlePickSuggestion(p)}
                        className="w-full px-4 py-2.5 text-left hover:bg-stone-50"
                      >
                        <div className="text-sm font-semibold text-stone-900">{p.name}</div>
                        <div className="mt-0.5 text-[11px] text-stone-500">{p.category}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={classNames(
              'hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border',
              theme === 'dark'
                ? 'border-white/15 bg-white/5 text-stone-100 hover:bg-white/10'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50',
            )}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => handleNavigate('profile')}
            className={classNames(
              'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-transform duration-200 hover:scale-105 active:scale-[0.98] motion-reduce:transform-none',
              theme === 'dark'
                ? 'border-white/15 bg-white/5 text-stone-100 hover:text-amber-300 hover:bg-white/10'
                : 'border-stone-200 bg-white text-stone-700 hover:text-amber-700 hover:bg-stone-50',
            )}
            aria-label="Profile"
          >
            <FaUserAlt className="h-4 w-4" />
          </button>
          <button
            onClick={navigateToWishlist}
            className={classNames(
              'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-transform duration-200 hover:scale-105 active:scale-[0.98] motion-reduce:transform-none',
              theme === 'dark'
                ? 'border-white/15 bg-white/5 text-stone-100 hover:text-amber-300 hover:bg-white/10'
                : 'border-stone-200 bg-white text-stone-700 hover:text-amber-700 hover:bg-stone-50',
            )}
            aria-label="Wishlist"
          >
            <FaHeart className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleNavigate('cart')}
            className={classNames(
              'relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-transform duration-200 hover:scale-105 active:scale-[0.98] motion-reduce:transform-none',
              theme === 'dark'
                ? 'border-white/15 bg-white/5 text-stone-100 hover:text-amber-300 hover:bg-white/10'
                : 'border-stone-200 bg-white text-stone-700 hover:text-amber-700 hover:bg-stone-50',
            )}
            aria-label="Cart"
          >
            <FaShoppingCart className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white">
              {cartItemsCount}
            </span>
          </button>

          <button
            onClick={() => setMobileNavOpen((prev) => !prev)}
            className={classNames(
              'lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border',
              theme === 'dark'
                ? 'border-white/15 bg-white/5 text-stone-100 hover:bg-white/10'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50',
            )}
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-5 w-5"
            >
              {mobileNavOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="md:hidden border-t border-stone-200 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="relative" data-search-root="true">
            <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-stone-50 px-4 py-2">
              <FaSearch className="text-stone-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => {
                  window.setTimeout(() => setSearchOpen(false), 120)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNavigate('products')
                    setSearchOpen(false)
                  }
                }}
                type="text"
                placeholder="Search entire store here..."
                className="w-full bg-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
              />
            </div>

            {searchOpen ? (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-stone-200 bg-white shadow-lg overflow-hidden z-30">
                {searchSuggestions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-stone-600">No matching products.</div>
                ) : (
                  <ul className="py-2">
                    {searchSuggestions.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handlePickSuggestion(p)}
                          className="w-full px-4 py-2.5 text-left hover:bg-stone-50"
                        >
                          <div className="text-sm font-semibold text-stone-900">{p.name}</div>
                          <div className="mt-0.5 text-[11px] text-stone-500">{p.category}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden overflow-x-hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-black/25"
          />

          <nav className="absolute top-0 right-0 h-[100dvh] w-[85vw] max-w-[360px] bg-white shadow-xl border-l border-stone-200 flex flex-col">
            <div className="h-20 px-4 flex items-center justify-end border-b border-stone-200 flex-shrink-0">
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3 pb-8 flex flex-col gap-1">
              <button
                onClick={() => handleNavigate('categories')}
                className={classNames(
                  'w-full text-right rounded-xl px-4 py-3 text-sm font-medium',
                  activeSection === 'categories'
                    ? 'bg-amber-50 text-amber-800'
                    : 'text-stone-700 hover:bg-stone-50',
                )}
              >
                Collection
              </button>
              <button
                onClick={() => handleNavigate('products')}
                className={classNames(
                  'w-full text-right rounded-xl px-4 py-3 text-sm font-medium',
                  activeSection === 'products'
                    ? 'bg-amber-50 text-amber-800'
                    : 'text-stone-700 hover:bg-stone-50',
                )}
              >
                Products
              </button>
              <button
                onClick={() => handleNavigate('blogs')}
                className={classNames(
                  'w-full text-right rounded-xl px-4 py-3 text-sm font-medium',
                  activeSection === 'blogs' ? 'bg-amber-50 text-amber-800' : 'text-stone-700 hover:bg-stone-50',
                )}
              >
                Blog
              </button>
              <button
                onClick={() => handleNavigate('reels')}
                className={classNames(
                  'w-full text-right rounded-xl px-4 py-3 text-sm font-medium',
                  activeSection === 'reels' ? 'bg-amber-50 text-amber-800' : 'text-stone-700 hover:bg-stone-50',
                )}
              >
                Reels
              </button>
              <button
                onClick={() => handleNavigate('cart')}
                className={classNames(
                  'w-full text-right rounded-xl px-4 py-3 text-sm font-medium',
                  activeSection === 'cart' ? 'bg-amber-50 text-amber-800' : 'text-stone-700 hover:bg-stone-50',
                )}
              >
                Cart
              </button>
              <button
                onClick={() => handleNavigate('profile')}
                className={classNames(
                  'w-full text-right rounded-xl px-4 py-3 text-sm font-medium',
                  activeSection === 'profile' ? 'bg-amber-50 text-amber-800' : 'text-stone-700 hover:bg-stone-50',
                )}
              >
                Profile
              </button>
              <button
                onClick={navigateToWishlist}
                className="w-full text-right rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Wishlist
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
