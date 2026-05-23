import { useEffect, useMemo, useState } from 'react'
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

import HomeSection from './sections/HomeSection.jsx'
import CategoriesSection from './sections/CategoriesSection.jsx'
import ProductsSection from './sections/ProductsSection.jsx'
import CartSection from './sections/CartSection.jsx'
import ProfileSection from './sections/ProfileSection.jsx'
import ReviewsSection from './sections/ReviewsSection.jsx'

import useProducts from './hooks/useProducts.js'
import ordersService from './utils/ordersService.js'
import { BLOGS } from './data/blogs.js'
import { CATEGORIES } from './data/categories.js'
import { REELS } from './data/reels.js'
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
        paymentMethod: 'cash_on_delivery',
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

  const heroSlides = useMemo(
    () => [
      {
        id: 'slide-1',
        image:
          'https://images.pexels.com/photos/8132705/pexels-photo-8132705.jpeg?auto=compress&cs=tinysrgb&w=1600',
        alt: 'Wooden lamp on bedside table',
        badge: 'New arrivals',
        title: 'Warm wooden decor that makes every room glow',
        subtitle:
          'Hand-finished lamps, tables, and decor made from sustainably sourced wood—designed for a soft, cozy ambience.',
        primaryLabel: 'Shop Products',
        primaryAction: { type: 'section', value: 'products' },
        secondaryLabel: 'Browse Categories',
        secondaryAction: { type: 'section', value: 'categories' },
      },
      {
        id: 'slide-2',
        image:
          'https://images.pexels.com/photos/1128114/pexels-photo-1128114.jpeg?auto=compress&cs=tinysrgb&w=1600',
        alt: 'Desk lamp warm glow',
        badge: 'Best sellers',
        title: 'The glow your desk deserves',
        subtitle:
          'Explore our most-loved wooden lamps—crafted to feel premium, look timeless, and light your space beautifully.',
        primaryLabel: 'Explore Best Sellers',
        primaryAction: { type: 'section', value: 'products' },
        secondaryLabel: 'Read Our Blog',
        secondaryAction: { type: 'section', value: 'blogs' },
      },
      {
        id: 'slide-3',
        image:
          'https://images.pexels.com/photos/3965520/pexels-photo-3965520.jpeg?auto=compress&cs=tinysrgb&w=1600',
        alt: 'Wooden furniture in living room',
        badge: 'Handcrafted',
        title: 'Build a calm, cozy home',
        subtitle:
          'From side tables to shelves, create warmth with natural textures and soft lighting—one piece at a time.',
        primaryLabel: 'Shop Collection',
        primaryAction: { type: 'section', value: 'categories' },
        secondaryLabel: 'View Reviews',
        secondaryAction: { type: 'section', value: 'reviews' },
      },
    ],
    [],
  )

  function handleHeroAction(action) {
    if (!action) return
    if (action.type === 'section') {
      handleNavigate(action.value)
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

  return (
    <div
      className={
        theme === 'dark'
          ? 'min-h-screen bg-[#1a0f00] text-stone-100 flex flex-col'
          : 'min-h-screen bg-[#fff7e6] text-stone-900 flex flex-col'
      }
    >
      {/* Header */}
      <Header
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

      {/* Main content */}
      <main className={theme === 'dark' ? 'flex-1 pt-32 md:pt-20' : 'flex-1 pt-32 md:pt-20'}>
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
                    categories={CATEGORIES}
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
                    categories={CATEGORIES}
                    onGoToProducts={() => handleNavigate('products')}
                    onCategorySelect={(categoryId) => {
                      setSelectedCategory(categoryId)
                      handleNavigate('products')
                    }}
                  />
                )}

                {activeSection === 'products' && (
                  <ProductsSection
                    categories={CATEGORIES}
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
          <Route path="/blogs" element={<BlogsList blogs={BLOGS} />} />
          <Route path="/blog/:id" element={<BlogDetail blogs={BLOGS} />} />
          <Route path="/reels" element={<ReelsPage reels={REELS} />} />
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
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </main>

      <Footer theme={theme} />
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
