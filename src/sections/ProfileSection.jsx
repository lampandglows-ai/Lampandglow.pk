import { Link } from 'react-router-dom'

export default function ProfileSection({ profile, orders, handleProfileChange, onLogout }) {
  return (
    <section className="bg-gray-100 min-h-screen py-10 px-0">
      <div className="w-full bg-white shadow-sm overflow-hidden border border-gray-200">
        
        {/* My Orders Section */}
        <div className="px-6 pt-6 pb-6">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700"
          >
            View all orders
          </Link>
        </div>

        {/* Cover */}
        <div className="relative h-44 sm:h-56 bg-gradient-to-r from-slate-700 to-slate-500">
          {profile.bannerUrl ? (
            <img
              src={profile.bannerUrl}
              alt="Banner"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}

          <div className="absolute right-4 bottom-4">
            <label className="inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-gray-900 shadow-sm cursor-pointer hover:bg-white">
              Change banner
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const url = URL.createObjectURL(file)
                  handleProfileChange('bannerUrl', url)
                }}
              />
            </label>
          </div>
        </div>

        <div className="relative px-6 pb-10">
          
          {/* Avatar */}
          <div className="absolute -top-16 left-6">
            <div className="group w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-md bg-gray-200 relative">
              <img
                src={profile.avatarUrl || '/avatar.jpg'}
                alt="Profile"
                className="w-full h-full object-cover"
              />

              <label className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity cursor-pointer group-hover:opacity-100">
                <span className="h-9 w-9 rounded-full bg-white/95 grid place-items-center shadow">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-900" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 7h3l2-2h6l2 2h3v13H4V7z" />
                    <path d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  </svg>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const url = URL.createObjectURL(file)
                    handleProfileChange('avatarUrl', url)
                  }}
                />
              </label>
            </div>
          </div>

          {/* Name + Save */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-20 gap-3">
            <h1 className="text-xl font-semibold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h1>

            <div className="flex gap-3 sm:gap-2">
              <button className="px-5 py-2 text-sm font-medium text-sky-600 border border-sky-500 rounded-full hover:bg-sky-50 transition">
                Save changes
              </button>
              <button 
                onClick={onLogout}
                className="px-5 py-2 text-sm font-medium text-red-600 border border-red-500 rounded-full hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mt-10 border-t pt-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-6">
              Personal details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* First Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  First name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) =>
                    handleProfileChange("firstName", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) =>
                    handleProfileChange("lastName", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Mobile number
                </label>
                <input
                  type="text"
                  value={profile.mobile}
                  onChange={(e) =>
                    handleProfileChange("mobile", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Email ID
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    handleProfileChange("email", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="mt-12 border-t pt-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-6">
              Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Address line 1
                </label>
                <input
                  type="text"
                  value={profile.addressLine1 || ''}
                  onChange={(e) => handleProfileChange('addressLine1', e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Address line 2
                </label>
                <input
                  type="text"
                  value={profile.addressLine2 || ''}
                  onChange={(e) => handleProfileChange('addressLine2', e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={profile.city || ''}
                  onChange={(e) => handleProfileChange('city', e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={profile.state || ''}
                  onChange={(e) => handleProfileChange('state', e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Postal code
                </label>
                <input
                  type="text"
                  value={profile.postalCode || ''}
                  onChange={(e) => handleProfileChange('postalCode', e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
