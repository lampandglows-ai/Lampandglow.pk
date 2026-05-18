import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit, Loader, AlertCircle, Search, X, Upload, Eye } from 'lucide-react';

export default function ProductsPage() {
  const { api } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [viewingProduct, setViewingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({...formData, image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        setSuccess('Product updated successfully!');
      } else {
        await api.post('/products', formData);
        setSuccess('Product created successfully!');
      }
      await fetchProducts();
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        setError('');
        await api.delete(`/products/${id}`);
        setSuccess('Product deleted successfully!');
        await fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock
    });
    setImagePreview(product.image);
    setEditingId(product._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '', image: '', stock: '' });
    setImagePreview('');
    setShowForm(false);
    setEditingId(null);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-orange-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage and upload products to your store</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition font-semibold"
          >
            <Plus size={20} />
            Add New Product
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-600">
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start justify-between gap-3">
          <p className="text-green-700">{success}</p>
          <button onClick={() => setSuccess('')} className="text-green-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Add/Edit Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a category</option>
                    <option value="Lamps">Lamps</option>
                    <option value="Lightings">Lightings</option>
                    <option value="Bulbs">Bulbs</option>
                    <option value="Fixtures">Fixtures</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="imageInput"
                    />
                    <label htmlFor="imageInput" className="cursor-pointer">
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData({...formData, image: ''});
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-gray-600">Or paste image URL</label>
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image && !imagePreview ? formData.image : ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        setFormData({...formData, image: url});
                        if (url) setImagePreview(url);
                      }}
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white px-6 py-2 rounded-lg transition font-semibold flex items-center gap-2"
              >
                {submitting ? <Loader size={18} className="animate-spin" /> : null}
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      {!showForm && (
        <div className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-gray-700"
          />
        </div>
      )}

      {/* Products Grid */}
      {!showForm && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Total Products: {filteredProducts.length}
            </h3>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-gray-600">No products found. Click "Add New Product" to create one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                  {/* Product Image */}
                  <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        onClick={() => setViewingProduct(product)}
                        className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-orange-600">₹{product.price}</p>
                        <p className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">{viewingProduct.name}</h3>
              <button onClick={() => setViewingProduct(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {viewingProduct.image && (
                    <img src={viewingProduct.image} alt={viewingProduct.name} className="w-full h-64 object-cover rounded-lg" />
                  )}
                </div>
                <div>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Category</dt>
                      <dd className="text-gray-900">{viewingProduct.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Price</dt>
                      <dd className="text-2xl font-bold text-orange-600">₹{viewingProduct.price}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Stock</dt>
                      <dd className={`font-semibold ${viewingProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {viewingProduct.stock} units
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-600">Description</dt>
                      <dd className="text-gray-900 text-sm mt-1">{viewingProduct.description}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
