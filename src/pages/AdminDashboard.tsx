import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, orderApi } from '../services/api';
import { DashboardStats, Order } from '../types';
import { BarChart3, DollarSign, Package, Users, AlertTriangle, Candy } from 'lucide-react';

export function AdminDashboard() {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, orders] = await Promise.all([
        analyticsApi.getDashboardStats(),
        orderApi.getAllOrders({ status: 'pending' }),
      ]);
      setStats(dashboardStats);
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <div className="p-8 text-center">Access denied. Admin privileges required.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center">Failed to load dashboard data.</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          {isSuperAdmin && (
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              Super Admin
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Revenue</p>
                <p className="text-3xl font-bold text-amber-600">${stats.today.revenue.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{stats.today.orders} orders</p>
              </div>
              <DollarSign className="w-12 h-12 text-amber-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">This Month</p>
                <p className="text-3xl font-bold text-blue-600">${stats.this_month.revenue.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{stats.this_month.orders} orders</p>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending_orders}</p>
                <p className="text-sm text-gray-500">Requires attention</p>
              </div>
              <Package className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-600">{stats.low_stock_items}</p>
                <p className="text-sm text-gray-500">Need restocking</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-600" />
              Customers
            </h2>
            <p className="text-4xl font-bold text-amber-600">{stats.total_customers}</p>
            <p className="text-gray-600 mt-2">Total registered customers</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Candy className="w-6 h-6 text-amber-600" />
              Products
            </h2>
            <p className="text-4xl font-bold text-amber-600">{stats.total_sweets}</p>
            <p className="text-gray-600 mt-2">Total sweets in inventory</p>
          </div>
        </div>

        {recentOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Pending Orders</h2>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-amber-100 rounded-lg hover:bg-amber-50 transition-all"
                >
                  <div>
                    <p className="font-semibold">Order #{order.order_number}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600">${order.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{order.items.length} items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

