import { useState, useEffect, useMemo } from 'react'
import { Search, Eye, MapPin, Phone, Mail, CheckCircle, Clock, Truck } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  // Load orders from localStorage
  useEffect(() => {
    const loadAllOrders = async () => {
      try {
        const allOrders = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.includes('user-orders-')) {
            try {
              const data = JSON.parse(localStorage.getItem(key))
              if (Array.isArray(data)) {
                allOrders.push(...data)
              }
            } catch {
              // Skip invalid data
            }
          }
        }
        // Sort by creation date (newest first)
        allOrders.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        setOrders(allOrders)
      } catch (error) {
        console.error('Error loading orders:', error)
      }
    }

    loadAllOrders()
  }, [])

  // Save orders to localStorage
  const saveOrders = (newOrders) => {
    // Group orders by user and save
    const groupedByUser = {}
    newOrders.forEach((order) => {
      if (!groupedByUser[order.userId]) {
        groupedByUser[order.userId] = []
      }
      groupedByUser[order.userId].push(order)
    })

    // Save each user's orders
    Object.keys(groupedByUser).forEach((userId) => {
      localStorage.setItem(`user-orders-${userId}`, JSON.stringify(groupedByUser[userId]))
    })
  }

  const updateOrderStatus = (orderId, newStatus) => {
    const newOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(newOrders)
    saveOrders(newOrders)
    setSelectedOrder((prev) =>
      prev ? { ...prev, status: newStatus } : null
    )
  }

  // Filter and search
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone?.includes(searchQuery)

      const matchesStatus =
        filterStatus === 'all' || order.status === filterStatus

      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, filterStatus])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
          <div className="text-right">
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-orange-500">{orders.length}</p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No orders have been placed yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Order ID</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Customer</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Total</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-6 font-mono text-sm font-semibold text-gray-600">
                        #{order.id?.slice(0, 8)}
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{order.fullName}</p>
                          <p className="text-sm text-gray-500">{order.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-lg text-orange-500">
                        ₹{order.total?.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-orange-500 hover:text-orange-700 font-semibold flex items-center gap-1 transition"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6 text-white sticky top-0 z-10 flex items-center justify-between">
                <h3 className="text-2xl font-bold">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white/80 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8">
                {/* Order Header */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="text-2xl font-bold text-gray-900">#{selectedOrder.id?.slice(0, 12)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedOrder.createdAt
                        ? new Date(selectedOrder.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Full Name</p>
                      <p className="font-semibold text-gray-900">{selectedOrder.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {selectedOrder.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4" /> {selectedOrder.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Payment Method</p>
                      <p className="font-semibold text-gray-900">
                        {selectedOrder.paymentMethod === 'cash_on_delivery'
                          ? 'Cash on Delivery'
                          : selectedOrder.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    Delivery Address
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{selectedOrder.addressLine1}</p>
                    {selectedOrder.addressLine2 && (
                      <p className="text-gray-700">{selectedOrder.addressLine2}</p>
                    )}
                    <p className="text-gray-700">
                      {selectedOrder.city}, {selectedOrder.state} {selectedOrder.postalCode}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {item.product?.name || item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × ₹{(item.product?.price || item.unitPrice)?.toLocaleString()}
                            </p>
                          </div>
                          <p className="font-bold text-orange-500">
                            ₹{((item.product?.price || item.unitPrice) * item.quantity)?.toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No items in this order</p>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-semibold text-gray-900">
                        ₹{selectedOrder.subtotal?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Shipping</span>
                      <span className="font-semibold text-gray-900">
                        ₹{selectedOrder.shipping?.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-orange-200 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{selectedOrder.total?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Status Update */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Update Order Status</h4>
                  <div className="flex flex-wrap gap-3">
                    {['pending', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        className={`px-6 py-2 rounded-lg font-semibold transition transform hover:scale-105 ${
                          selectedOrder.status === status
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Notes */}
                {selectedOrder.note && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-2">Special Notes</p>
                    <p className="text-blue-800">{selectedOrder.note}</p>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
