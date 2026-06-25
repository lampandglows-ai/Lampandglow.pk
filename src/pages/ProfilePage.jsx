import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import { User, Mail, Phone, MapPin, AlertCircle, Loader, CheckCircle } from 'lucide-react';

export default function ProfilePage({ theme = 'light' }) {
  const { user, updateProfile, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || ''
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900/30 text-yellow-300';
      case 'confirmed': return 'bg-blue-900/30 text-blue-300';
      case 'shipped': return 'bg-purple-900/30 text-purple-300';
      case 'delivered': return 'bg-green-900/30 text-green-300';
      case 'cancelled': return 'bg-red-900/30 text-red-300';
      default: return 'bg-white/10 text-white/80';
    }
  };

  if (!user) {
    return (
      <div className={theme === 'dark' ? 'flex items-center justify-center min-h-screen bg-[#1F1F1F]' : 'flex items-center justify-center min-h-screen'}>
        <p className={theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}>Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className={theme === 'dark' ? 'min-h-screen py-12 px-4 bg-[#1F1F1F]' : 'min-h-screen py-12 px-4'}>
      <div className="max-w-6xl mx-auto">
        {message && (
          <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="text-[#22C55E] flex-shrink-0 mt-0.5" size={20} />
            <p className="text-green-300">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className={theme === 'dark' ? 'bg-[#2A2A2A] rounded-lg shadow p-6' : 'bg-[#7A4A20] rounded-lg shadow p-6'}>
              <div className="text-center mb-6">
                <div className={theme === 'dark' ? 'w-20 h-20 bg-[#5A2D0C] rounded-full flex items-center justify-center mx-auto mb-4' : 'w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4'}>
                  <User size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-white/70 text-sm">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-[#FFD400]/20 text-[#FFD400] rounded-full text-xs font-semibold">
                    Admin
                  </span>
                )}
              </div>

              <button
                onClick={logout}
                className="w-full bg-[#E53935] hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="lg:col-span-2">
            <div className={theme === 'dark' ? 'bg-[#2A2A2A] rounded-lg shadow p-6 mb-8' : 'bg-[#7A4A20] rounded-lg shadow p-6 mb-8'}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Profile Information</h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className={theme === 'dark' ? 'px-4 py-2 bg-[#5A2D0C] hover:bg-[#7A4A20] text-white rounded-lg transition duration-200' : 'px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition duration-200'}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={theme === 'dark' ? 'w-full px-4 py-2 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#2A2A2A] text-stone-100' : 'w-full px-4 py-2 border border-[#FFD400]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#5A2D0C] text-white'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={theme === 'dark' ? 'w-full px-4 py-2 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#2A2A2A] text-stone-100' : 'w-full px-4 py-2 border border-[#FFD400]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#5A2D0C] text-white'}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-white/80 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={theme === 'dark' ? 'w-full px-4 py-2 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#2A2A2A] text-stone-100' : 'w-full px-4 py-2 border border-[#FFD400]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#5A2D0C] text-white'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={theme === 'dark' ? 'w-full px-4 py-2 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#2A2A2A] text-stone-100' : 'w-full px-4 py-2 border border-[#FFD400]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#5A2D0C] text-white'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={theme === 'dark' ? 'w-full px-4 py-2 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#2A2A2A] text-stone-100' : 'w-full px-4 py-2 border border-[#FFD400]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#5A2D0C] text-white'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={theme === 'dark' ? 'w-full px-4 py-2 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#2A2A2A] text-stone-100' : 'w-full px-4 py-2 border border-[#FFD400]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[#5A2D0C] text-white'}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading && <Loader size={18} className="animate-spin" />}
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded-lg transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-white/70" />
                    <div>
                      <p className="text-sm text-white/70">Email</p>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-white/70" />
                      <div>
                        <p className="text-sm text-white/70">Phone</p>
                        <p className="text-white font-medium">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-white/70 mt-1" />
                      <div>
                        <p className="text-sm text-white/70">Address</p>
                        <p className="text-white font-medium">
                          {user.address}, {user.city}, {user.state} {user.zipCode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Orders Section */}
            <div className="bg-[#7A4A20] rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-white mb-6">My Orders</h3>

              {loadingOrders ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="animate-spin text-orange-600" size={32} />
                </div>
              ) : orders.length === 0 ? (
                <p className="text-white/70 text-center py-8">No orders yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#7A4A20] border-b border-[#FFD400]/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Total</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-[#FFD400]/10 hover:bg-[#7A4A20]/80">
                          <td className="px-4 py-3 text-sm text-white">{order._id?.substring(0, 8)}...</td>
                          <td className="px-4 py-3 text-sm text-white/70">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-white">₹{order.totalAmount}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
