import { useEffect, useMemo, useState, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import BlogsList from './pages/BlogsList.jsx'
import BlogDetail from './pages/BlogDetail.jsx'
import WishlistPage from './pages/WishlistPage.jsx'
import ReelsPage from './pages/ReelsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

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
import ShippingPolicyPage from './pages/ShippingPolicyPage.jsx'
import PublicPage from './pages/PublicPage.jsx'
import WebsitePopup from './components/WebsitePopup.jsx'
import AnnouncementBar from './components/AnnouncementBar.jsx'

import HomeSection from './sections/HomeSection.jsx'
import CategoriesSection from './sections/CategoriesSection.jsx'
import ProductsSection from './sections/ProductsSection.jsx'
import CartSection from './sections/CartSection.jsx'
import ProfileSection from './sections/ProfileSection.jsx'
import ReviewsSection from './sections/ReviewsSection.jsx'

import useProducts from './hooks/useProducts.js'
import useCategories from './hooks/useCategories.js'
import ordersService from './utils/ordersService.js'
import heroBannersService from './utils/heroBannersService.js'
import { TESTIMONIALS } from './data/testimonials.js'

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
  const { user, isLoggedIn, logout } = useAuth()
  const { products, loading: productsLoading } = useProducts()
  const { categories: dynamicCategories, loading: categoriesLoading } = useCategories()
  
  const [activeSection, setActiveSection] = useState('home')
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem('lg-theme')
    return saved === 'dark' ? 'dark' : 'light'
  })
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productId: products[0]?.id || 1,
      name: 'Hassan',
      rating: 5,
      comment: 'Perfect bedside light, warm and not too bright.',
      createdAt: new Date('2025-10-15').toISOString(),
    },
    {
      id: 2,
      productId: products[1]?.id || 2,
      name: 'Maria',
      rating: 4,
      comment: 'Love the rustic look of the coffee table.',
      createdAt: new Date('2025-09-21').toISOString(),
    },
  ])
  const [reviewForm, setReviewForm] = useState({
    productId: products[0]?.id ?? 1,
    name: '',
    rating: 5,
    comment: '',
  })
  const [reviewSortBy, setReviewSortBy] = useState('recent')

  // Load user orders when user logs in
  useEffect(() => {
    if (user?.uid) {
      loadUserOrders()
    }
  }, [user?.uid])

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
      if (!map[r.productId]) {
        map[r.productId] = { total: 0, count: 0 }
      }
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
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    }
    return result
  }, [reviews, reviewSortBy])

  useEffect(() => {
    if (location.pathname === '/' && activeSection === 'blogs') {
      setActiveSection('home')
    }

    if (location.pathname === '/' && activeSection === 'reels') {
      setActiveSection('home')
    }

    if (
      (location.pathname === '/blogs' || location.pathname.startsWith('/blog/')) &&
      activeSection !== 'blogs'
    ) {
      setActiveSection('blogs')
    }

    if (location.pathname === '/reels' && activeSection !== 'reels') {
      setActiveSection('reels')
    }
  }, [activeSection, location.pathname])

  useEffect(() => {
    window.localStorage.setItem('lg-theme', theme)
  }, [theme])

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
      prev
        .map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function handleRemoveFromCart(itemId) {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handlePlaceOrder = async (payload) => {
    try {
      if (!user?.uid) {
        navigate('/login')
        return null
      }

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

  function handleSubmitReview(e) {
    e.preventDefault()
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return

    const newReview = {
      id: reviews.length + 1,
      productId: reviewForm.productId,
      name: reviewForm.name.trim(),
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
      createdAt: new Date().toISOString(),
    }

    setReviews((prev) => [newReview, ...prev])
    setReviewForm((prev) => ({
      ...prev,
      name: '',
      comment: '',
    }))
  }

  function handleNavigate(section) {
    if (section === 'blogs') {
      navigate('/blogs')
      setActiveSection('blogs')
      setMobileNavOpen(false)
      return
    }

    if (section === 'reels') {
      navigate('/reels')
      setActiveSection('reels')
      setMobileNavOpen(false)
      return
    }

    if (section === 'profile') {
      navigate('/profile')
      setActiveSection('profile')
      setMobileNavOpen(false)
      return
    }

    if (location.pathname !== '/') {
      navigate('/')
    }
    setActiveSection(section)
    setMobileNavOpen(false)
  }

  const [heroSlides, setHeroSlides] = useState([])
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(120)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const updateHeight = () => {
      setHeaderHeight(header.offsetHeight)
    }
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
    if (action.type === 'section') {
      handleNavigate(action.value)
    } else if (action.type === 'url') {
      window.open(action.value, '_blank')
    }
  }

  function navigateToWishlist() {
    navigate('/wishlist')
    setMobileNavOpen(false)
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  const isAdminRoute = location.pathname.startsWith('/admin')
  const isDarkContentPage = ['/', '/blogs', '/blog', '/reels'].some(path => location.pathname === path || location.pathname.startsWith(path + '/'))
  const isPublicPageRoute = !location.pathname.startsWith('/admin') && !['/', '/blogs', '/blog', '/reels', '/about', '/contact', '/login', '/signin', '/signup', '/profile', '/wishlist', '/orders', '/checkout', '/product', '/shipping-policy'].some(path => location.pathname === path || location.pathname.startsWith(path + '/'))

  return (
    <div
      className={
        theme === 'dark'
          ? 'min-h-screen bg-[#1a0f00] text-stone-100 flex flex-col'
          : 'min-h-screen bg-[#fff7e6] text-stone-900 flex flex-col'
      }
    >
      {/* Announcement Bar - hidden on admin routes */}
      {!isAdminRoute && <AnnouncementBar />}

      {/* Header - hidden on admin routes */}
      {!isAdminRoute && (
        <Header ref={headerRef}
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
        />
      )}

      {/* Main content */}
      <main className={`flex-1 ${!isAdminRoute ? '' : ''} ${isDarkContentPage ? 'bg-[#4C2600]' : ''}`} style={{ paddingTop: !isAdminRoute ? `${headerHeight}px` : undefined }}>
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
                      handleNavigate('products')
                    }}
                    onViewAllProducts={() => handleNavigate('products')}
                  />
                )}

                {activeSection === 'categories' && (
                  <CategoriesSection
                    categories={dynamicCategories}
                    onGoToProducts={() => handleNavigate('products')}
                    onCategorySelect={(categoryId) => {
                      setSelectedCategory(categoryId)
                      handleNavigate('products')
                    }}
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
                  <ProfileSection
                    orders={orders}
                    profile={user}
                    handleProfileChange={() => {}}
                    onLogout={handleLogout}
                  />
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
          <Route path="/blogs" element={<BlogsList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/about" element={<AboutPage theme={theme} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/profile"
            element={
              isLoggedIn() ? (
                <ProfileSection
                  orders={orders}
                  profile={user}
                  handleProfileChange={() => {}}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/signin" replace />
              )
            }
          />
          <Route path="/contact" element={<ContactPage theme={theme} />} />
          <Route path="/shipping-policy" element={<ShippingPolicyPage theme={theme} />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/orders" element={<OrdersPage orders={orders} />} />
          <Route
            path="/checkout"
            element={(
              <CheckoutPage
                cart={cart}
                cartTotal={cartTotal}
                onPlaceOrder={handlePlaceOrder}
                theme={theme}
              />
            )}
          />
          <Route
            path="/product/:id"
            element={(
              <ProductDetail products={products} onAddToCart={handleAddToCart} reviews={reviews} />
            )}
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedAdminRoute>
                <AdminProductsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedAdminRoute>
                <AdminOrdersPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedAdminRoute>
                <AdminCustomersPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <ProtectedAdminRoute>
                <AdminCouponsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedAdminRoute>
                <AdminPaymentHistoryPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedAdminRoute>
                <AdminCategoriesPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/social-links"
            element={
              <ProtectedAdminRoute>
                <AdminSocialLinksPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/onboarding"
            element={
              <ProtectedAdminRoute>
                <AdminOnboardingPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/website-popups"
            element={
              <ProtectedAdminRoute>
                <AdminWebsitePopupsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedAdminRoute>
                <AdminAnnouncementsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/hero-banners"
            element={
              <ProtectedAdminRoute>
                <AdminHeroBannersPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/shipping-policy"
            element={
              <ProtectedAdminRoute>
                <AdminShippingPolicyPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/pages"
            element={
              <ProtectedAdminRoute>
                <AdminPagesPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/reels"
            element={
              <ProtectedAdminRoute>
                <AdminReelsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <ProtectedAdminRoute>
                <AdminBlogsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/footer"
            element={
              <ProtectedAdminRoute>
                <AdminFooterPage />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

          {/* Public Pages Route */}
          <Route path="/:slug" element={<PublicPage />} />
        </Routes>
      </main>

      {/* Website Popup - hidden on admin routes */}
      {!isAdminRoute && <WebsitePopup />}

      {/* Footer - hidden on admin routes */}
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
