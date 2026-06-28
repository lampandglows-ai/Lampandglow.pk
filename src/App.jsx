import { useEffect, useMemo, useState, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import BlogsList from './pages/BlogsList.jsx'
import BlogDetail from './pages/BlogDetail.jsx'
import ReelsPage from './pages/ReelsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ContactUsPage from './pages/ContactUsPage.jsx'
import CollectionsPage from './pages/CollectionsPage.jsx'
import CollectionDetailPage from './pages/CollectionDetailPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import CartPage from './pages/CartPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminProductsPage from './pages/AdminProductsPage.jsx'
import AdminOrdersPage from './pages/AdminOrdersPage.jsx'
import AdminCustomersPage from './pages/AdminCustomersPage.jsx'
import AdminCouponsPage from './pages/AdminCouponsPage.jsx'
import AdminPaymentHistoryPage from './pages/AdminPaymentHistoryPage.jsx'
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx'
import AdminSocialLinksPage from './pages/AdminSocialLinksPage.jsx'
import AdminOnboardingPage from './pages/AdminOnboardingPage.jsx'
import AdminWebsitePopupsPage from './pages/AdminWebsitePopupsPage.jsx'
import AdminAnnouncementsPage from './pages/AdminAnnouncementsPage.jsx'
import AdminHeroBannersPage from './pages/AdminHeroBannersPage.jsx'
import AdminShippingPolicyPage from './pages/AdminShippingPolicyPage.jsx'
import AdminPagesPage from './pages/AdminPagesPage.jsx'
import AdminReelsPage from './pages/AdminReelsPage.jsx'
import AdminBlogsPage from './pages/AdminBlogsPage.jsx'
import AdminFooterPage from './pages/AdminFooterPage.jsx'
import AdminContactSubmissionsPage from './pages/AdminContactSubmissionsPage.jsx'
import AdminContactPage from './pages/AdminContactPage.jsx'
import AdminNewsletterPage from './pages/AdminNewsletterPage.jsx'
import AdminBankDetailsPage from './pages/AdminBankDetailsPage.jsx'
import AdminAboutPage from './pages/AdminAboutPage.jsx'
import AdminReviewsPage from './pages/AdminReviewsPage.jsx'
import ShippingPolicyPage from './pages/ShippingPolicyPage.jsx'
import PublicPage from './pages/PublicPage.jsx'
import WebsitePopup from './components/WebsitePopup.jsx'
import AnnouncementBar from './components/AnnouncementBar.jsx'

import HomeSection from './sections/HomeSection.jsx'
import ProductsSection from './sections/ProductsSection.jsx'
import CartSection from './sections/CartSection.jsx'
import ProfileSection from './sections/ProfileSection.jsx'
import ReviewsSection from './sections/ReviewsSection.jsx'

import useProducts from './hooks/useProducts.js'
import useCategories from './hooks/useCategories.js'
import ordersService from './utils/ordersService.js'
import heroBannersService from './utils/heroBannersService.js'
import wishlistService from './utils/wishlistService.js'
import reviewsService from './utils/reviewsService.js'
import { TESTIMONIALS } from './data/testimonials.js'
import { slugify } from './utils/slugify.js'
import AdminShippingPage from './pages/AdminShippingPage.jsx'

// ─── Spinning Circle Loader ───────────────────────────────────────────────────
function SpinnerLoader() {
  return (
    <>
      <style>{`
        @keyframes lg-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes lg-fade-out {
          from { opacity: 1; }
          to   { opacity: 0; pointer-events: none; }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: '#ffffff',
            animation: 'lg-spin 0.75s linear infinite',
          }}
        />
      </div>
    </>
  )
}

// Protected Admin Route Component
function ProtectedAdminRoute({ children }) {
  const { isAdminLoggedIn } = useAdminAuth()
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoggedIn, logout, updateProfile } = useAuth()
  const { products, loading: productsLoading } = useProducts()
  const { categories: dynamicCategories, loading: categoriesLoading } = useCategories()

  const [activeSection, setActiveSection] = useState('home')
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem('lg-theme')
    return saved === 'dark' ? 'dark' : 'light'
  })
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({
    productId: products[0]?.id ?? 1,
    name: '',
    rating: 5,
    comment: '',
  })
  const [reviewSortBy, setReviewSortBy] = useState('recent')

  useEffect(() => { loadReviews() }, [])

  useEffect(() => {
    if (user?.uid) {
      loadUserOrders()
      loadWishlist()
    }
  }, [user?.uid])

  const loadReviews = async () => {
    try {
      setReviewsLoading(true)
      const allReviews = await reviewsService.getAllReviews()
      setReviews(allReviews)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

  const loadWishlist = async () => {
    if (!user?.uid) return
    try {
      setWishlistLoading(true)
      const items = await wishlistService.getWishlist(user.uid)
      setWishlist(items)
    } catch (error) {
      console.error('Error loading wishlist:', error)
    } finally {
      setWishlistLoading(false)
    }
  }

  const loadUserOrders = async () => {
    try {
      setOrdersLoading(true)
      const userOrders = await ordersService.getUserOrders(user.uid)
      setOrders(userOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const cartItemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  )

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * (item.unitPrice ?? item.product.price), 0),
    [cart],
  )

  const filteredProducts = useMemo(() => {
    const base = selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory)
    const q = searchQuery.trim().toLowerCase()
    if (!q) return base
    return base.filter((p) => {
      const name = p.name.toLowerCase()
      const category = p.category?.toLowerCase() || ''
      return name.includes(q) || category.includes(q)
    })
  }, [searchQuery, selectedCategory, products])

  const productAverageRating = useMemo(() => {
    const map = {}
    reviews.forEach((r) => {
      if (!map[r.productId]) map[r.productId] = { total: 0, count: 0 }
      map[r.productId].total += r.rating
      map[r.productId].count += 1
    })
    const averages = {}
    Object.keys(map).forEach((id) => {
      averages[id] = map[id].total / map[id].count
    })
    return averages
  }, [reviews])

  const sortedReviews = useMemo(() => {
    const result = [...reviews]
    if (reviewSortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return result
  }, [reviews, reviewSortBy])

  useEffect(() => {
    if (location.pathname === '/' && activeSection === 'blogs') setActiveSection('home')
    if (location.pathname === '/' && activeSection === 'reels') setActiveSection('home')
    if ((location.pathname === '/blogs' || location.pathname.startsWith('/blog/')) && activeSection !== 'blogs') setActiveSection('blogs')
    if (location.pathname === '/reels' && activeSection !== 'reels') setActiveSection('reels')
  }, [activeSection, location.pathname])

  useEffect(() => {
    if (location.pathname === '/' && activeSection === 'categories') setActiveSection('home')
  }, [location.pathname, activeSection])

  useEffect(() => {
    window.localStorage.setItem('lg-theme', theme)
  }, [theme])

  function handleToggleWishlist(product) {
    setWishlist((prev) => {
      const next = prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
      if (user?.uid) {
        wishlistService.saveWishlist(user.uid, next).catch((err) =>
          console.error('Failed to sync wishlist:', err),
        )
      }
      return next
    })
  }

  function isInWishlist(productId) {
    return wishlist.some((p) => p.id === productId)
  }

  function handleAddToCart(payload) {
    const item = payload.product ? payload : { product: payload }
    const bulbKey = item.bulbOption ? String(item.bulbOption).replace(/\s+/g, '_') : 'default'
    const id = `${item.product.id}-${bulbKey}`
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id)
      if (existing) {
        return prev.map((c) => (c.id === id ? { ...c, quantity: c.quantity + 1 } : c))
      }
      return [...prev, { id, product: item.product, quantity: 1, bulbOption: item.bulbOption || null, unitPrice: item.unitPrice ?? item.product.price }]
    })
  }

  function handleUpdateCartQuantity(itemId, quantity) {
    setCart((prev) =>
      prev.map((item) => item.id === itemId ? { ...item, quantity } : item).filter((item) => item.quantity > 0),
    )
  }

  function handleRemoveFromCart(itemId) {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handlePlaceOrder = async (payload) => {
    try {
      if (!user?.uid) { navigate('/login'); return null }
      const order = await ordersService.createOrder(user.uid, {
        fullName: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        addressLine1: payload.addressLine1,
        addressLine2: payload.addressLine2,
        city: payload.city,
        state: payload.state,
        postalCode: payload.postalCode,
        note: payload.note,
        items: payload.items,
        subtotal: payload.subtotal,
        shipping: payload.shipping,
        total: payload.total,
        status: 'pending',
        paymentMethod: payload.paymentMethod || 'cash_on_delivery',
      })
      setOrders((prev) => [order, ...prev])
      setCart([])
      return order.id
    } catch (error) {
      console.error('Error placing order:', error)
      return null
    }
  }

  const handleSubmitReview = async (newReview) => {
    if (!newReview || !newReview.comment || !user) return false
    const hasAlreadyReviewed = reviews.some(
      (r) => r.productId === newReview.productId && r.userId === user.uid
    )
    if (hasAlreadyReviewed) { alert('You have already reviewed this product.'); return false }
    try {
      const savedReview = await reviewsService.addReview(newReview)
      setReviews((prev) => [savedReview, ...prev])
      return true
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
      return false
    }
  }

  function handleNavigate(section) {
    if (section === 'blogs') { navigate('/blogs'); setActiveSection('blogs'); setMobileNavOpen(false); return }
    if (section === 'reels') { navigate('/reels'); setActiveSection('reels'); setMobileNavOpen(false); return }
    if (section === 'profile') { navigate('/profile'); setActiveSection('profile'); setMobileNavOpen(false); return }
    if (section === 'cart') { navigate('/cart'); setActiveSection('cart'); setMobileNavOpen(false); return }
    if (section === 'categories') { navigate('/collections'); setMobileNavOpen(false); return }
    if (location.pathname !== '/') navigate('/')
    setActiveSection(section)
    setMobileNavOpen(false)
  }

  const [heroSlides, setHeroSlides] = useState([])
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(120)

  useEffect(() => {
    if (!productsLoading && !categoriesLoading) {
      const timer = setTimeout(() => setLoading(false), 300)
      return () => clearTimeout(timer)
    }
  }, [productsLoading, categoriesLoading])

  useEffect(() => {
    setLoading(true)
    const minLoadTimer = setTimeout(() => {
      if (!productsLoading && !categoriesLoading) {
        const completeTimer = setTimeout(() => setLoading(false), 300)
        return () => clearTimeout(completeTimer)
      }
    }, 800)
    return () => clearTimeout(minLoadTimer)
  }, [location.pathname, productsLoading, categoriesLoading])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const updateHeight = () => setHeaderHeight(header.offsetHeight)
    updateHeight()
    const ro = new ResizeObserver(updateHeight)
    ro.observe(header)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const banners = await heroBannersService.getActiveBanners()
        const mapped = banners.map((b) => ({
          id: b.id,
          image: b.image,
          imageMobile: b.imageMobile || '',
          alt: b.alt || b.title,
          badge: b.badge || '',
          title: b.title || '',
          subtitle: b.subtitle || '',
          primaryLabel: b.primaryLabel || '',
          primaryAction: b.primaryAction || null,
          secondaryLabel: b.secondaryLabel || '',
          secondaryAction: b.secondaryAction || null,
          fitToScreen: b.fitToScreen !== false,
          fullScreen: b.fullScreen === true,
        }))
        setHeroSlides(mapped)
      } catch (e) {
        console.error('Error loading hero banners:', e)
      }
    }
    loadBanners()
  }, [])

  function handleHeroAction(action) {
    if (!action) return
    if (action.type === 'section') handleNavigate(action.value)
    else if (action.type === 'url') window.open(action.value, '_blank')
  }

  function navigateToWishlist() { navigate('/profile'); setMobileNavOpen(false) }
  function toggleTheme() { setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')) }
  function handleLogout() { logout(); navigate('/') }

  const handleProfileChange = async (key, value) => {
    try {
      await updateProfile({ [key]: value })
    } catch (err) {
      console.error('Failed to update profile:', err)
    }
  }

  const isAdminRoute = location.pathname.startsWith('/admin')

  if (loading) return <SpinnerLoader />

  return (
    <div
      className={
        theme === 'dark'
          ? 'min-h-screen bg-[#1F1F1F] text-stone-100 flex flex-col'
          : activeSection === 'home'
            ? 'min-h-screen hero-gradient-bg text-[#222222] flex flex-col'
            : 'min-h-screen bg-[#FAFAF8] text-[#222222] flex flex-col'
      }
    >
      {!isAdminRoute && <AnnouncementBar />}

      {!isAdminRoute && (
        <Header
          ref={headerRef}
          activeSection={activeSection}
          cartItemsCount={cartItemsCount}
          handleNavigate={handleNavigate}
          mobileNavOpen={mobileNavOpen}
          navigateToWishlist={navigateToWishlist}
          products={products}
          searchQuery={searchQuery}
          setMobileNavOpen={setMobileNavOpen}
          setSearchQuery={setSearchQuery}
          theme={theme}
          toggleTheme={toggleTheme}
          wishlistItemsCount={wishlist.length}
        />
      )}

      <main
        className="flex-1"
        style={{ paddingTop: !isAdminRoute ? `${headerHeight}px` : undefined }}
      >
        <Routes>
          <Route
            path="/"
            element={(
              <>
                {activeSection === 'home' && (
                  <HomeSection
                    theme={theme}
                    heroSlides={heroSlides}
                    onHeroAction={handleHeroAction}
                    products={products}
                    categories={dynamicCategories}
                    testimonials={TESTIMONIALS}
                    onViewAllCategories={() => handleNavigate('categories')}
                    onPickCategory={(categoryId) => {
                      setSelectedCategory(categoryId)
                      navigate(`/collections/${slugify(categoryId)}`)
                    }}
                    onViewAllProducts={() => handleNavigate('products')}
                  />
                )}
                {activeSection === 'products' && (
                  <ProductsSection
                    categories={dynamicCategories}
                    filteredProducts={filteredProducts}
                    productAverageRating={productAverageRating}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    handleAddToCart={handleAddToCart}
                    handleNavigate={handleNavigate}
                    setReviewForm={setReviewForm}
                    handleToggleWishlist={handleToggleWishlist}
                    isInWishlist={isInWishlist}
                  />
                )}
                {activeSection === 'cart' && (
                  <CartSection
                    cart={cart}
                    cartItemsCount={cartItemsCount}
                    cartTotal={cartTotal}
                    handleNavigate={handleNavigate}
                    handleRemoveFromCart={handleRemoveFromCart}
                    handleUpdateCartQuantity={handleUpdateCartQuantity}
                    onCheckout={() => navigate('/checkout')}
                  />
                )}
                {activeSection === 'profile' && isLoggedIn() && (
                  <div className="w-full bg-stone-50 min-h-screen p-4 lg:p-6">
                    <ProfileSection
                      orders={orders}
                      wishlist={wishlist}
                      profile={user}
                      handleProfileChange={handleProfileChange}
                      onLogout={handleLogout}
                    />
                  </div>
                )}
                {activeSection === 'reviews' && (
                  <ReviewsSection
                    products={products}
                    reviewForm={reviewForm}
                    reviewSortBy={reviewSortBy}
                    setReviewForm={setReviewForm}
                    setReviewSortBy={setReviewSortBy}
                    sortedReviews={sortedReviews}
                    handleSubmitReview={handleSubmitReview}
                  />
                )}
              </>
            )}
          />

          <Route path="/blogs" element={<BlogsList theme={theme} />} />
          <Route path="/blog/:slug" element={<BlogDetail theme={theme} />} />
          <Route path="/reels" element={<ReelsPage theme={theme} />} />
          <Route path="/reels/:reelId" element={<ReelsPage theme={theme} />} />
          <Route path="/about" element={<AboutPage theme={theme} />} />
          <Route path="/about-us" element={<AboutPage theme={theme} />} />
          <Route path="/login" element={<LoginPage theme={theme} />} />
          <Route path="/signin" element={<LoginPage theme={theme} />} />
          <Route path="/signup" element={<SignupPage theme={theme} />} />

          <Route
            path="/profile"
            element={
              isLoggedIn() ? (
                <div className="w-full bg-stone-50 min-h-screen p-4 lg:p-6">
                  <ProfileSection
                    orders={orders}
                    wishlist={wishlist}
                    profile={user}
                    handleProfileChange={handleProfileChange}
                    onLogout={handleLogout}
                  />
                </div>
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />

          <Route path="/contact" element={<ContactPage theme={theme} />} />
          <Route path="/contact-us" element={<ContactUsPage theme={theme} />} />
          <Route path="/collections" element={<CollectionsPage theme={theme} />} />
          <Route
            path="/collections/:slug"
            element={
              <CollectionDetailPage
                handleToggleWishlist={handleToggleWishlist}
                isInWishlist={isInWishlist}
              />
            }
          />
          <Route path="/shipping-policy" element={<ShippingPolicyPage theme={theme} />} />

          <Route
            path="/products"
            element={
              <ProductsPage
                theme={theme}
                categories={dynamicCategories}
                filteredProducts={filteredProducts}
                productAverageRating={productAverageRating}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                handleAddToCart={handleAddToCart}
                setReviewForm={setReviewForm}
                handleToggleWishlist={handleToggleWishlist}
                isInWishlist={isInWishlist}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                cartItemsCount={cartItemsCount}
                cartTotal={cartTotal}
                handleRemoveFromCart={handleRemoveFromCart}
                handleUpdateCartQuantity={handleUpdateCartQuantity}
                onCheckout={() => navigate('/checkout')}
                theme={theme}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                cartTotal={cartTotal}
                onPlaceOrder={handlePlaceOrder}
                theme={theme}
              />
            }
          />
          <Route
            path="/products/:slug"
            element={
              <ProductDetail
                products={products}
                productsLoading={productsLoading}
                onAddToCart={handleAddToCart}
                reviews={reviews}
                handleToggleWishlist={handleToggleWishlist}
                isInWishlist={isInWishlist}
                theme={theme}
                user={user}
                isLoggedIn={isLoggedIn()}
                handleSubmitReview={handleSubmitReview}
              />
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          <Route path="/admin/products" element={<ProtectedAdminRoute><AdminProductsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrdersPage /></ProtectedAdminRoute>} />
          <Route path="/admin/customers" element={<ProtectedAdminRoute><AdminCustomersPage /></ProtectedAdminRoute>} />
          <Route path="/admin/coupons" element={<ProtectedAdminRoute><AdminCouponsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/payments" element={<ProtectedAdminRoute><AdminPaymentHistoryPage /></ProtectedAdminRoute>} />
          <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminCategoriesPage /></ProtectedAdminRoute>} />
          <Route path="/admin/social-links" element={<ProtectedAdminRoute><AdminSocialLinksPage /></ProtectedAdminRoute>} />
          <Route path="/admin/onboarding" element={<ProtectedAdminRoute><AdminOnboardingPage /></ProtectedAdminRoute>} />
          <Route path="/admin/website-popups" element={<ProtectedAdminRoute><AdminWebsitePopupsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/announcements" element={<ProtectedAdminRoute><AdminAnnouncementsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/hero-banners" element={<ProtectedAdminRoute><AdminHeroBannersPage /></ProtectedAdminRoute>} />
          <Route path="/admin/shipping-policy" element={<ProtectedAdminRoute><AdminShippingPolicyPage /></ProtectedAdminRoute>} />
          <Route path="/admin/shipping-fees" element={<ProtectedAdminRoute><AdminShippingPage /></ProtectedAdminRoute>} />
          <Route path="/admin/pages" element={<ProtectedAdminRoute><AdminPagesPage /></ProtectedAdminRoute>} />
          <Route path="/admin/reels" element={<ProtectedAdminRoute><AdminReelsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/blogs" element={<ProtectedAdminRoute><AdminBlogsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/footer" element={<ProtectedAdminRoute><AdminFooterPage /></ProtectedAdminRoute>} />
          <Route path="/admin/contact-submissions" element={<ProtectedAdminRoute><AdminContactSubmissionsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/contact-page" element={<ProtectedAdminRoute><AdminContactPage /></ProtectedAdminRoute>} />
          <Route path="/admin/newsletter" element={<ProtectedAdminRoute><AdminNewsletterPage /></ProtectedAdminRoute>} />
          <Route path="/admin/about" element={<ProtectedAdminRoute><AdminAboutPage /></ProtectedAdminRoute>} />
          <Route path="/admin/bank-details" element={<ProtectedAdminRoute><AdminBankDetailsPage /></ProtectedAdminRoute>} />
          <Route path="/admin/reviews" element={<ProtectedAdminRoute><AdminReviewsPage /></ProtectedAdminRoute>} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

          {/* Public Pages Route */}
          <Route path="/:slug" element={<PublicPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <WebsitePopup />}
      {!isAdminRoute && <Footer theme={theme} />}
    </div>
  )
}

function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AdminAuthProvider>
  )
}

export default App