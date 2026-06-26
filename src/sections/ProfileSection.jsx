import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, AlertCircle, Loader, CheckCircle, ShoppingBag, Heart, MapPin as MapPinIcon, Star, Bell, Settings, LogOut, Home, ShoppingBag as OrdersIcon, Heart as WishlistIcon, User as UserIcon } from 'lucide-react';

export default function ProfileSection({ profile, orders, handleProfileChange, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    mobile: profile?.mobile || '',
    email: profile?.email || '',
    addressLine1: profile?.addressLine1 || '',
    addressLine2: profile?.addressLine2 || '',
    city: profile?.city || '',
    state: profile?.state || '',
    postalCode: profile?.postalCode || ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        mobile: profile.mobile || '',
        email: profile.email || '',
        addressLine1: profile.addressLine1 || '',
        addressLine2: profile.addressLine2 || '',
        city: profile.city || '',
        state: profile.state || '',
        postalCode: profile.postalCode || ''
      });
    }
  }, [profile]);

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
      // Update each field
      Object.entries(formData).forEach(([key, value]) => {
        handleProfileChange(key, value);
      });
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-[#EAF3DE] text-[#3B6D11]';
      case 'confirmed': return 'bg-[#FAEEDA] text-[#854F0B]';
      case 'shipped': return 'bg-[#E6F1FB] text-[#185FA5]';
      case 'delivered': return 'bg-[#EAF3DE] text-[#3B6D11]';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Processing';
      case 'confirmed': return 'Crafting';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  // Desktop View
  const DesktopView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-0 border border-stone-200 rounded-xl overflow-hidden min-h-[600px] bg-white shadow-lg">
      {/* Sidebar */}
      <div className="bg-[#412402] p-6 flex flex-col">
        <div className="text-xs font-medium text-[#FAC775] tracking-widest mb-6 flex items-center gap-2">
          <User size={16} />
          Lamp & Glow
        </div>
        
        <div className="w-14 h-14 rounded-full bg-[#EF9F27] flex items-center justify-center text-lg font-semibold text-[#412402] mx-auto mb-2">
          {profile?.firstName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="text-sm font-medium text-[#FAC775] text-center mb-1">
          {profile?.firstName} {profile?.lastName}
        </div>
        <div className="text-xs text-[#854F0B] text-center mb-5">
          Member since 2024
        </div>
        
        <div className="h-px bg-[#633806] my-3"></div>
        
        <nav className="flex-1 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[rgba(239,159,39,0.18)] text-[#FAC775] font-medium text-sm cursor-pointer">
            <ShoppingBag size={16} />
            My orders
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#C87020] hover:bg-[rgba(255,180,60,0.10)] text-sm cursor-pointer transition-colors">
            <Heart size={16} />
            Wishlist
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#C87020] hover:bg-[rgba(255,180,60,0.10)] text-sm cursor-pointer transition-colors">
            <MapPinIcon size={16} />
            Addresses
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#C87020] hover:bg-[rgba(255,180,60,0.10)] text-sm cursor-pointer transition-colors">
            <Star size={16} />
            My reviews
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#C87020] hover:bg-[rgba(255,180,60,0.10)] text-sm cursor-pointer transition-colors">
            <Bell size={16} />
            Notifications
          </div>
          
          <div className="h-px bg-[#633806] my-3"></div>
          
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#C87020] hover:bg-[rgba(255,180,60,0.10)] text-sm cursor-pointer transition-colors">
            <Settings size={16} />
            Settings
          </div>
          <div 
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A32D2D] hover:bg-[rgba(255,180,60,0.10)] text-sm cursor-pointer transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-stone-900">My orders</h2>
          <Link 
            to="/orders"
            className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 hover:border-stone-400 flex items-center gap-2"
          >
            <Settings size={14} />
            Filter
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-stone-50 rounded-lg p-3 text-center border border-stone-200">
            <span className="text-2xl font-semibold text-[#BA7517] block">{orders?.length || 0}</span>
            <span className="text-xs text-stone-500">Total orders</span>
          </div>
          <div className="bg-stone-50 rounded-lg p-3 text-center border border-stone-200">
            <span className="text-2xl font-semibold text-[#BA7517] block">0</span>
            <span className="text-xs text-stone-500">Wishlist items</span>
          </div>
          <div className="bg-stone-50 rounded-lg p-3 text-center border border-stone-200">
            <span className="text-2xl font-semibold text-[#BA7517] block">0</span>
            <span className="text-xs text-stone-500">Reviews given</span>
          </div>
        </div>

        <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">Recent orders</p>

        {/* Orders List */}
        {!orders || orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200 hover:border-stone-300 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-[#FAEEDA] flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={18} className="text-[#BA7517]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">
                    {order.items?.[0]?.productName || 'Order'}
                  </p>
                  <p className="text-xs text-stone-500">
                    #{order._id?.substring(0, 8)} · {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Rs. {order.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${getStatusColor(order.orderStatus)}`}>
                  {getStatusLabel(order.orderStatus)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* COD Banner */}
        <div className="mt-6 p-4 rounded-lg bg-[#FAEEDA] flex items-center gap-3">
          <ShoppingBag size={20} className="text-[#854F0B] flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#633806]">COD available nationwide</p>
            <p className="text-xs text-[#854F0B]">Cash on delivery on all orders · Free delivery over Rs. 3,000</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile View
  const MobileView = () => (
    <div className="w-[320px] mx-auto border-2 border-stone-800 rounded-[32px] overflow-hidden bg-white shadow-2xl">
      {/* Phone Notch */}
      <div className="w-20 h-5 bg-stone-800 rounded-b-xl mx-auto"></div>
      
      {/* Screen Content */}
      <div className="px-0 pb-4">
        {/* Banner */}
        <div className="h-[72px] bg-[#412402] relative flex items-end justify-center pb-0">
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
            <div className="w-11 h-11 rounded-full bg-[#EF9F27] border-2 border-white flex items-center justify-center text-sm font-semibold text-[#412402]">
              {profile?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-8 px-4 text-center">
          <p className="text-sm font-medium text-stone-900 mb-1">{profile?.firstName} {profile?.lastName}</p>
          <p className="text-xs text-stone-500 mb-3">
            <MapPinIcon size={10} className="inline mr-1" />
            {profile?.city || 'Location'} · Member since 2024
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-stone-50 rounded-lg p-2 border border-stone-200">
              <span className="text-base font-semibold text-[#BA7517] block">{orders?.length || 0}</span>
              <span className="text-[9px] text-stone-500">Orders</span>
            </div>
            <div className="bg-stone-50 rounded-lg p-2 border border-stone-200">
              <span className="text-base font-semibold text-[#BA7517] block">0</span>
              <span className="text-[9px] text-stone-500">Wishlist</span>
            </div>
            <div className="bg-stone-50 rounded-lg p-2 border border-stone-200">
              <span className="text-base font-semibold text-[#BA7517] block">0</span>
              <span className="text-[9px] text-stone-500">Reviews</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-stone-200 mb-3">
            <div className="flex-1 text-xs py-2 text-center text-[#BA7517] border-b-2 border-[#EF9F27] font-medium">
              Orders
            </div>
            <div className="flex-1 text-xs py-2 text-center text-stone-400">
              Wishlist
            </div>
            <div className="flex-1 text-xs py-2 text-center text-stone-400">
              Details
            </div>
          </div>

          {/* Orders */}
          {!orders || orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag size={32} className="mx-auto text-stone-300 mb-2" />
              <p className="text-xs text-stone-500">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200">
                  <div className="w-7 h-7 rounded bg-[#FAEEDA] flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={14} className="text-[#BA7517]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-stone-900 truncate">
                      {order.items?.[0]?.productName || 'Order'}
                    </p>
                    <p className="text-[9px] text-stone-500">
                      #{order._id?.substring(0, 8)} · {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusColor(order.orderStatus)}`}>
                    {getStatusLabel(order.orderStatus)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="flex border-t border-stone-200 mt-4 pt-2 pb-1">
            <div className="flex-1 flex flex-col items-center gap-1 text-[#BA7517]">
              <Home size={18} />
              <span className="text-[9px]">Home</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 text-stone-400">
              <OrdersIcon size={18} />
              <span className="text-[9px]">Orders</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 text-stone-400">
              <WishlistIcon size={18} />
              <span className="text-[9px]">Wishlist</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 text-stone-400">
              <UserIcon size={18} />
              <span className="text-[9px]">Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-green-800 text-sm">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <DesktopView />
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <MobileView />
        </div>

        {/* Profile Edit Section (Desktop Only) */}
        {typeof window !== 'undefined' && window.innerWidth >= 1024 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6 border border-stone-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-stone-900">Profile Information</h3>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-[#5A2D0C] hover:bg-[#7A4A20] text-white rounded-lg transition duration-200 text-sm font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Mobile</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Address Line 1</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-stone-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#5A2D0C] hover:bg-[#7A4A20] text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading && <Loader size={18} className="animate-spin" />}
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold py-2.5 rounded-lg transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-stone-400" />
                  <div>
                    <p className="text-xs text-stone-500">Email</p>
                    <p className="text-sm font-medium text-stone-900">{profile?.email}</p>
                  </div>
                </div>
                {profile?.mobile && (
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-stone-400" />
                    <div>
                      <p className="text-xs text-stone-500">Phone</p>
                      <p className="text-sm font-medium text-stone-900">{profile?.mobile}</p>
                    </div>
                  </div>
                )}
                {(profile?.addressLine1 || profile?.city) && (
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-stone-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-stone-500">Address</p>
                      <p className="text-sm font-medium text-stone-900">
                        {[profile?.addressLine1, profile?.addressLine2, profile?.city, profile?.state, profile?.postalCode].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}