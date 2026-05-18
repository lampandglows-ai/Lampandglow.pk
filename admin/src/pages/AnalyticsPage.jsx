import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader, AlertCircle } from 'lucide-react';

export default function AnalyticsPage() {
  const { api } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/analytics/sales');
      setAnalytics(response.data.analytics);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin text-orange-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Sales and performance insights</p>
      </div>

      {/* Monthly Sales */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Sales</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Month</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Revenue</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Orders</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.monthlySales?.length > 0 ? (
                analytics.monthlySales.map((sale) => (
                  <tr key={sale._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{sale._id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{sale.total.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{sale.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-center text-gray-600">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status Distribution</h2>
        <div className="space-y-3">
          {analytics?.orderStatusCount?.length > 0 ? (
            analytics.orderStatusCount.map((status) => (
              <div key={status._id} className="flex items-center gap-4">
                <span className="capitalize font-medium text-gray-900 w-24">{status._id}:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8">
                  <div
                    className={`h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                      status._id === 'delivered'
                        ? 'bg-green-500'
                        : status._id === 'shipped'
                        ? 'bg-blue-500'
                        : status._id === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                    }`}
                    style={{ width: `${Math.min((status.count / Math.max(...analytics.orderStatusCount.map(s => s.count))) * 100, 100)}%` }}
                  >
                    {status.count}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No order data available</p>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Units Sold</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.topProducts?.length > 0 ? (
                analytics.topProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {product.productDetails?.[0]?.name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{product.totalSold}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{product.totalRevenue.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-4 text-center text-gray-600">
                    No product data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
