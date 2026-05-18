import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, X } from 'lucide-react';

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-40 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="bg-orange-600 p-2 rounded-lg">
                <span className="font-bold text-white">LG</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">LampandGlow</h1>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto lg:hidden p-1 hover:bg-gray-800 rounded"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    active
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-400">
            <p>LampandGlow © 2026</p>
          </div>
        </div>
      </div>
    </>
  );
}
