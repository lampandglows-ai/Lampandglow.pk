import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, X, AlertCircle, CheckCircle, ImagePlus, Loader2 } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import AdminLayout from '../components/AdminLayout'
import productsService from '../utils/productsService.js'
import { storage } from '../utils/firebase.js'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [imageUploading, setImageUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    images: [],
  })

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const data = await productsService.getAllProducts()
        setProducts(data)
      } catch (e) {
        console.error('Error loading products:', e)
        setMessage({ type: 'error', text: 'Failed to load products from Firebase' })
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Upload images to Firebase Storage and store download URLs
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setImageUploading(true)
    try {
      const uploadPromises = files.map(async (file) => {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`)
        await uploadBytes(storageRef, file)
        const url = await getDownloadURL(storageRef)
        return url
      })

      const urls = await Promise.all(uploadPromises)
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }))
    } catch (err) {
      console.error('Error uploading images:', err)
      setMessage({ type: 'error', text: `Image upload failed: ${err.message}` })
    } finally {
      setImageUploading(false)
      // Reset input so same file can be selected again if needed
      e.target.value = ''
    }
  }

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  // Helper: upload a base64/data URL image to Firebase Storage
  const uploadBase64Image = async (dataUrl) => {
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    const ext = dataUrl.split(';')[0].split('/')[1] || 'png'
    const storageRef = ref(storage, `products/${Date.now()}_image.${ext}`)
    await uploadBytes(storageRef, blob)
    return getDownloadURL(storageRef)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.category.trim() || !formData.price.trim()) {
      setMessage({ type: 'error', text: 'Please fill all required fields' })
      return
    }

    setSaving(true)

    try {
      // Migrate any base64 images to Storage URLs before saving
      let finalImages = formData.images
      if (finalImages.some((img) => img.startsWith('data:'))) {
        finalImages = await Promise.all(
          finalImages.map(async (img) => {
            if (img.startsWith('data:')) {
              return uploadBase64Image(img)
            }
            return img
          })
        )
      }

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        images: finalImages,
        image: finalImages[0] || '',
      }

      if (editingId) {
        // Update existing product in Firebase
        await productsService.updateProduct(editingId, payload)
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? { ...p, ...payload, updatedAt: new Date().toISOString() }
              : p
          )
        )
        setMessage({ type: 'success', text: 'Product updated successfully!' })
        setEditingId(null)
      } else {
        // Add new product to Firebase
        const newProduct = await productsService.createProduct(payload)
        setProducts((prev) => [newProduct, ...prev])
        setMessage({ type: 'success', text: 'Product added successfully!' })
      }

      resetForm()
    } catch (error) {
      console.error('Error saving product:', error)
      setMessage({ type: 'error', text: 'Failed to save product. Please try again.' })
    } finally {
      setSaving(false)
    }

    setTimeout(() => {
      setMessage({ type: '', text: '' })
    }, 3000)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      images: [],
    })
    setShowForm(false)
  }

  const handleEdit = (product) => {
    const images = product.images || (product.image ? [product.image] : [])
    setFormData({
      name: product.name || '',
      category: product.category || '',
      price: String(product.price ?? ''),
      description: product.description || '',
      images,
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsService.deleteProduct(id)
        setProducts((prev) => prev.filter((p) => p.id !== id))
        setMessage({ type: 'success', text: 'Product deleted successfully!' })
      } catch (error) {
        console.error('Error deleting product:', error)
        setMessage({ type: 'error', text: 'Failed to delete product. Please try again.' })
      }
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 3000)
    }
  }

  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase()
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  })

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0]
    if (product.image) return product.image
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Product Management</h2>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transition flex items-center gap-2 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
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
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
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

        {/* Add/Edit Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6 flex items-center justify-between text-white">
                <h3 className="text-2xl font-bold">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-1 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Decor">Decor</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (Rs) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Multiple Images Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Product Images
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {/* Upload Button */}
                    <label className={`w-32 h-32 border-2 border-dashed rounded-lg transition flex flex-col items-center justify-center text-center cursor-pointer ${imageUploading ? 'border-orange-300 bg-orange-50' : 'border-gray-300 hover:border-orange-500'}`}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={imageUploading}
                      />
                      {imageUploading ? (
                        <Loader2 className="w-6 h-6 text-orange-500 animate-spin mb-1" />
                      ) : (
                        <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                      )}
                      <span className="text-xs text-gray-500">
                        {imageUploading ? 'Uploading...' : 'Add Images'}
                      </span>
                    </label>

                    {/* Image Previews */}
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">First image will be used as the main product image.</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving || imageUploading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingId ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={saving}
                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name, category, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            <p className="mt-2 text-gray-500">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQuery ? 'Try adjusting your search' : 'Add your first product to get started'}
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
                  {/* Image */}
                  {getProductImage(product) && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 flex-1">{product.name}</h3>
                      <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>

                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <p className="text-2xl font-bold text-orange-500">Rs.{product.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Stats Footer */}
        {!loading && filteredProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <p className="text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of{' '}
              <span className="font-bold text-gray-900">{products.length}</span> products
            </p>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Inventory Value</p>
              <p className="text-2xl font-bold text-orange-500">
                Rs.{filteredProducts.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
