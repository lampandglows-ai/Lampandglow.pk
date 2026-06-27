import { useState, useEffect } from 'react'
import { Trash2, Star, Search, AlertCircle, CheckCircle, Loader2, MessageSquare, Reply, X } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import reviewsService from '../utils/reviewsService.js'
import productsService from '../utils/productsService.js'
import { useAuth } from '../context/AuthContext.jsx'


export default function AdminReviewsPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [reviews, setReviews] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  // Load reviews and products from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [reviewsData, productsData] = await Promise.all([
          reviewsService.getAllReviews(),
          productsService.getAllProducts()
        ])
        setReviews(reviewsData)
        setProducts(productsData)
      } catch (error) {
        console.error('Error loading data:', error)
        setMessage({ type: 'error', text: 'Failed to load reviews from Firebase' })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await reviewsService.deleteReview(reviewId)
        setReviews((prev) => prev.filter((r) => r.id !== reviewId))
        setMessage({ type: 'success', text: 'Review deleted successfully!' })
        setTimeout(() => {
          setMessage({ type: '', text: '' })
        }, 3000)
      } catch (error) {
        console.error('Error deleting review:', error)
        const reason = error?.code === 'permission-denied'
          ? 'Firebase permission denied. Your Firestore Security Rules may not allow deleting reviews.'
          : error?.message || 'Please try again.'
        setMessage({ type: 'error', text: 'Failed to delete review. ' + reason })
        setTimeout(() => {
          setMessage({ type: '', text: '' })
        }, 3000)
      }
    }
  }

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) {
      setMessage({ type: 'error', text: 'Please enter a reply message' })
      return
    }

    try {
      const updatedReview = await reviewsService.addReply(reviewId, replyText.trim())
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, adminReply: updatedReview.adminReply, adminReplyAt: updatedReview.adminReplyAt } : r))
      )
      setReplyingTo(null)
      setReplyText('')
      setMessage({ type: 'success', text: 'Reply added successfully!' })
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 3000)
    } catch (error) {
      console.error('Error adding reply:', error)
      const reason = error?.code === 'permission-denied'
          ? 'Firebase permission denied. Your Firestore Security Rules may not allow replying to reviews.'
          : error?.message || 'Please try again.'
        setMessage({ type: 'error', text: 'Failed to add reply. ' + reason })
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 3000)
    }
  }

  const handleRemoveReply = async (reviewId) => {
    if (window.confirm('Are you sure you want to remove this reply?')) {
      try {
        await reviewsService.removeReply(reviewId)
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, adminReply: null, adminReplyAt: null } : r))
        )
        setMessage({ type: 'success', text: 'Reply removed successfully!' })
        setTimeout(() => {
          setMessage({ type: '', text: '' })
        }, 3000)
      } catch (error) {
        console.error('Error removing reply:', error)
        setMessage({ type: 'error', text: 'Failed to remove reply. Please try again.' })
        setTimeout(() => {
          setMessage({ type: '', text: '' })
        }, 3000)
      }
    }
  }

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId)
    return product?.name || 'Unknown Product'
  }

  const getProductImage = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (product?.images && product.images.length > 0) return product.images[0]
    if (product?.image) return product.image
    return null
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getProductName(review.productId).toLowerCase().includes(searchQuery.toLowerCase())

    const matchesProduct = selectedProduct === 'all' || review.productId === selectedProduct

    return matchesSearch && matchesProduct
  })

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-[#FFD400] text-[#FFD400]' : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Reviews Management</h2>
            <p className="text-gray-600 mt-1">Manage customer reviews across all products</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span className="font-semibold">{reviews.length} Total Reviews</span>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#E53935] flex-shrink-0" />
            )}
            <p
              className={`font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name, review text, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Product Filter */}
            <div>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Products</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reviews found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery || selectedProduct !== 'all'
                ? 'Try adjusting your filters'
                : 'Reviews will appear here when customers submit them'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {getProductImage(review.productId) ? (
                      <img
                        src={getProductImage(review.productId)}
                        alt={getProductName(review.productId)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Customer Info */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-[#F5F1EA]0 flex items-center justify-center text-white font-bold">
                            {review.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.name || 'Anonymous'}</p>
                            <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                          </div>
                        </div>

                        {/* Product Name */}
                        <p className="text-sm text-gray-600 mb-2">
                          Product: <span className="font-medium text-gray-900">{getProductName(review.productId)}</span>
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          {renderStars(review.rating)}
                          <span className="text-sm font-semibold text-gray-700">{review.rating}/5</span>
                        </div>

                        {/* Comment */}
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                        {/* Admin Reply Section */}
                        {review.adminReply && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                A
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-blue-900 text-sm">Admin Reply</p>
                                  <p className="text-xs text-blue-600">
                                    {review.adminReplyAt ? new Date(review.adminReplyAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }) : ''}
                                  </p>
                                </div>
                                <p className="text-blue-800 text-sm leading-relaxed">{review.adminReply}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Reply Form */}
                        {replyingTo === review.id && (
                          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Write your reply:
                            </label>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your response to this review..."
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              autoFocus
                            />
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => handleReply(review.id)}
                                disabled={!replyText.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                              >
                                Post Reply
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingTo(null)
                                  setReplyText('')
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!review.adminReply ? (
                          <button
                            onClick={() => setReplyingTo(review.id)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                            title="Reply to review"
                          >
                            <Reply className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRemoveReply(review.id)}
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition"
                            title="Remove reply"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete review"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}