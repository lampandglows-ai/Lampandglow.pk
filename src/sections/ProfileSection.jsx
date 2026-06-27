import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, AlertCircle, Loader, CheckCircle,
  ShoppingBag, Heart, MapPin as MapPinIcon, Star, Bell, Settings,
  LogOut, SlidersHorizontal
} from 'lucide-react';

export default function ProfileSection({ profile, orders, handleProfileChange, onLogout }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: ''
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      Object.entries(formData).forEach(([key, value]) => handleProfileChange(key, value));
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      pending:   'bg-[#EAF3DE] text-[#3B6D11]',
      confirmed: 'bg-[#FAEEDA] text-[#854F0B]',
      shipped:   'bg-[#E6F1FB] text-[#185FA5]',
      delivered: 'bg-[#EAF3DE] text-[#3B6D11]',
      cancelled: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-stone-100 text-stone-600';
  };

  const getStatusLabel = (status) => {
    const map = {
      pending:   'Processing',
      confirmed: 'Crafting',
      shipped:   'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return map[status] || status;
  };

  const initials = profile?.firstName?.charAt(0)?.toUpperCase() || 'U';
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ');

  const navItems = [
    { id: 'orders',    icon: ShoppingBag, label: 'My orders' },
    { id: 'wishlist',  icon: Heart,       label: 'Wishlist' },
    { id: 'addresses', icon: MapPinIcon,  label: 'Addresses' },
    { id: 'reviews',   icon: Star,        label: 'Reviews' },
    { id: 'notifications', icon: Bell,    label: 'Notifications' },
    { id: 'settings',  icon: Settings,    label: 'Settings' },
  ];

  return (
    <div className="w-full">
      {/* Alerts */}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-start gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-green-800 text-sm">{message}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Main Card */}
      <div className="w-full border border-stone-200 rounded-xl overflow-hidden shadow-sm bg-white grid grid-cols-1 lg:grid-cols-[240px_1fr]">

        {/* ── Sidebar ── */}
        <aside className="bg-[#412402]">
          {/* Desktop header */}
          <div className="hidden lg:block px-5 pt-5 pb-4">
            <div className="flex items-center gap-2 text-[#FAC775] text-xs font-medium tracking-widest mb-5">
              <User size={14} />
              Lamp &amp; Glow
            </div>
            <div className="w-12 h-12 rounded-full bg-[#EF9F27] flex items-center justify-center text-base font-semibold text-[#412402] mx-auto mb-2">
              {initials}
            </div>
            <p className="text-sm font-medium text-[#FAC775] text-center">{fullName}</p>
            <p className="text-xs text-[#854F0B] text-center mt-1">Member since 2024</p>
            <div className="h-px bg-[#633806] mt-4" />
          </div>

          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[#633806]">
            <div className="w-10 h-10 rounded-full bg-[#EF9F27] flex items-center justify-center text-sm font-semibold text-[#412402] flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-[#FAC775]">{fullName}</p>
              <p className="text-xs text-[#854F0B]">Member since 2024</p>
            </div>
          </div>

          {/* Nav — vertical on desktop, horizontal scroll on mobile */}
          <nav className="flex lg:flex-col gap-1 p-3 lg:p-4 overflow-x-auto lg:overflow-x-visible">
            {navItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors flex-shrink-0 lg:flex-shrink lg:w-full
                  ${activeTab === id
                    ? 'bg-[rgba(239,159,39,0.18)] text-[#FAC775] font-medium'
                    : 'text-[#C87020] hover:bg-[rgba(255,180,60,0.1)]'}`}
              >
                <Icon size={15} />
                <span className="hidden lg:inline">{label}</span>
              </button>
            ))}

            <div className="hidden lg:block h-px bg-[#633806] my-1" />

            <button
              onClick={onLogout}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#A32D2D] hover:bg-[rgba(255,180,60,0.1)] transition-colors flex-shrink-0 lg:flex-shrink lg:w-full whitespace-nowrap"
            >
              <LogOut size={15} />
              <span className="hidden lg:inline">Sign out</span>
            </button>
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="p-4 lg:p-5 overflow-y-auto min-h-[400px]">

          {/* Orders tab */}
          {(activeTab === 'orders' || activeTab === 'orders') && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-stone-900">My orders</h2>
                <Link
                  to="/orders"
                  className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 text-stone-600 hover:border-stone-400 flex items-center gap-1.5 transition-colors"
                >
                  <SlidersHorizontal size={12} />
                  Filter
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Total orders', value: orders?.length || 0 },
                  { label: 'Wishlist',      value: 0 },
                  { label: 'Reviews',       value: 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-center">
                    <span className="text-xl font-semibold text-[#BA7517] block">{value}</span>
                    <span className="text-xs text-stone-500">{label}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">Recent orders</p>

              {!orders || orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <ShoppingBag size={36} className="text-stone-300" />
                  <p className="text-sm text-stone-400">No orders yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mb-4">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200 hover:border-stone-300 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FAEEDA] flex items-center justify-center flex-shrink-0">
                        <ShoppingBag size={16} className="text-[#BA7517]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">
                          {order.items?.[0]?.productName || 'Order'}
                        </p>
                        <p className="text-xs text-stone-500">
                          #{order._id?.substring(0, 8)} · {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Rs. {order.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${getStatusStyle(order.orderStatus)}`}>
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* COD Banner */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAEEDA]">
                <ShoppingBag size={18} className="text-[#854F0B] flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#633806]">COD available nationwide</p>
                  <p className="text-xs text-[#854F0B]">Cash on delivery on all orders · Free delivery over Rs. 3,000</p>
                </div>
              </div>
            </>
          )}

          {/* Wishlist tab */}
          {activeTab === 'wishlist' && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Heart size={36} className="text-stone-300" />
              <p className="text-sm text-stone-400">Your wishlist is empty</p>
            </div>
          )}

          {/* Addresses tab */}
          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-base font-semibold text-stone-900 mb-4">Saved addresses</h2>
              {(profile?.addressLine1 || profile?.city) ? (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-stone-50 border border-stone-200">
                  <MapPin size={16} className="text-stone-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-stone-700">
                    {[profile?.addressLine1, profile?.addressLine2, profile?.city, profile?.state, profile?.postalCode].filter(Boolean).join(', ')}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <MapPin size={36} className="text-stone-300" />
                  <p className="text-sm text-stone-400">No addresses saved</p>
                </div>
              )}
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === 'reviews' && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Star size={36} className="text-stone-300" />
              <p className="text-sm text-stone-400">No reviews yet</p>
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === 'notifications' && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Bell size={36} className="text-stone-300" />
              <p className="text-sm text-stone-400">No notifications</p>
            </div>
          )}

          {/* Settings tab — profile edit */}
          {activeTab === 'settings' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-stone-900">Profile information</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-3 py-1.5 bg-[#5A2D0C] hover:bg-[#7A4A20] text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit profile
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'First name',  name: 'firstName',   type: 'text' },
                      { label: 'Last name',   name: 'lastName',    type: 'text' },
                      { label: 'Mobile',      name: 'mobile',      type: 'tel' },
                      { label: 'Email',       name: 'email',       type: 'email' },
                    ].map(({ label, name, type }) => (
                      <div key={name}>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
                        <input
                          type={type}
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-stone-900"
                        />
                      </div>
                    ))}

                    {[
                      { label: 'Address line 1', name: 'addressLine1', span: true },
                      { label: 'Address line 2', name: 'addressLine2', span: true },
                    ].map(({ label, name, span }) => (
                      <div key={name} className={span ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
                        <input
                          type="text"
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-stone-900"
                        />
                      </div>
                    ))}

                    {[
                      { label: 'City',        name: 'city' },
                      { label: 'State',       name: 'state' },
                      { label: 'Postal code', name: 'postalCode' },
                    ].map(({ label, name }) => (
                      <div key={name}>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
                        <input
                          type="text"
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-stone-900"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-[#5A2D0C] hover:bg-[#7A4A20] text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading && <Loader size={15} className="animate-spin" />}
                      {loading ? 'Saving…' : 'Save changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2 rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  <InfoRow icon={<Mail size={16} className="text-stone-400" />} label="Email" value={profile?.email} />
                  {profile?.mobile && (
                    <InfoRow icon={<Phone size={16} className="text-stone-400" />} label="Phone" value={profile.mobile} />
                  )}
                  {(profile?.addressLine1 || profile?.city) && (
                    <InfoRow
                      icon={<MapPin size={16} className="text-stone-400 mt-0.5" />}
                      label="Address"
                      value={[profile?.addressLine1, profile?.addressLine2, profile?.city, profile?.state, profile?.postalCode].filter(Boolean).join(', ')}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-stone-400">{label}</p>
        <p className="text-sm font-medium text-stone-900">{value || '—'}</p>
      </div>
    </div>
  );
}