import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader, AlertCircle, Search, Eye, X, CheckCircle } from 'lucide-react';

export default function OrdersPage() {
  const { api } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/orders');
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setSuccess('Order status updated successfully!');
      await fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'shipped': return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'delivered': return 'bg-green-100 text-green-800 border border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-orange-600" size={32} />
      </div>
    );
  }

  const filteredOrders = orders.filter(o =>
    o._id.includes(searchTerm) || 
    o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage and track customer orders</p>
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
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <p className="text-green-700">{success}</p>
          </div>
          <button onClick={() => setSuccess('')} className="text-green-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-3">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by order ID, customer name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-gray-700"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {orders.filter(o => o.orderStatus === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Shipped</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {orders.filter(o => o.orderStatus === 'shipped').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Delivered</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {orders.filter(o => o.orderStatus === 'delivered').length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-900 font-medium">{order.user?.name || 'Unknown'}</div>
                      <div className="text-gray-600 text-xs">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₹{order.totalAmount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer ${getStatusColor(order.orderStatus)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg transition text-xs font-medium"
                      >
                        <Eye size={14} />
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
      {viewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              <button onClick={() => setViewingOrder(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-gray-900">{viewingOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="text-gray-900">{new Date(viewingOrder.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-orange-600">₹{viewingOrder.totalAmount}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-gray-900">{viewingOrder.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{viewingOrder.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900">{viewingOrder.shippingAddress?.phone || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>{viewingOrder.shippingAddress?.address}</p>
                  <p>{viewingOrder.shippingAddress?.city}, {viewingOrder.shippingAddress?.state} {viewingOrder.shippingAddress?.zipCode}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-2">
                  {viewingOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{item.price}</p>
                        <p className="text-sm text-gray-600">Subtotal: ₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Info */}
              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <p className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getStatusColor(viewingOrder.orderStatus)}`}>
                    {viewingOrder.orderStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getPaymentStatusColor(viewingOrder.paymentStatus)}`}>
                    {viewingOrder.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
