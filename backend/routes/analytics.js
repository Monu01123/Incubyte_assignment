import express from 'express';
import { Order } from '../models/Order.js';
import { Bill } from '../models/Bill.js';
import { Sweet } from '../models/Sweet.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get revenue analytics (Admin/Super Admin)
router.get('/revenue', authenticate, requireAdmin, async (req, res) => {
  try {
    const { start_date, end_date, group_by = 'day' } = req.query;

    let dateFilter = {};
    if (start_date || end_date) {
      dateFilter.created_at = {};
      if (start_date) dateFilter.created_at.$gte = new Date(start_date);
      if (end_date) dateFilter.created_at.$lte = new Date(end_date);
    }

    // Get completed orders
    const orders = await Order.find({
      ...dateFilter,
      status: 'completed',
      payment_status: 'paid',
    });

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group by date
    const revenueByDate = {};
    orders.forEach(order => {
      const date = new Date(order.created_at);
      let key;
      
      if (group_by === 'day') {
        key = date.toISOString().split('T')[0];
      } else if (group_by === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (group_by === 'year') {
        key = date.getFullYear().toString();
      }

      if (!revenueByDate[key]) {
        revenueByDate[key] = { date: key, revenue: 0, orders: 0 };
      }
      revenueByDate[key].revenue += order.total;
      revenueByDate[key].orders += 1;
    });

    res.json({
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      average_order_value: averageOrderValue,
      revenue_by_date: Object.values(revenueByDate),
    });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch revenue data' });
  }
});

// Get top selling sweets (Admin/Super Admin)
router.get('/top-sweets', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit = 10, start_date, end_date } = req.query;

    let dateFilter = {};
    if (start_date || end_date) {
      dateFilter.created_at = {};
      if (start_date) dateFilter.created_at.$gte = new Date(start_date);
      if (end_date) dateFilter.created_at.$lte = new Date(end_date);
    }

    const orders = await Order.find({
      ...dateFilter,
      status: 'completed',
    });

    // Aggregate sales by sweet
    const sweetSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const sweetId = item.sweet_id.toString();
        if (!sweetSales[sweetId]) {
          sweetSales[sweetId] = {
            sweet_id: sweetId,
            sweet_name: item.sweet_name,
            quantity_sold: 0,
            revenue: 0,
          };
        }
        sweetSales[sweetId].quantity_sold += item.quantity;
        sweetSales[sweetId].revenue += item.subtotal;
      });
    });

    const topSweets = Object.values(sweetSales)
      .sort((a, b) => b.quantity_sold - a.quantity_sold)
      .slice(0, parseInt(limit));

    res.json(topSweets);
  } catch (error) {
    console.error('Get top sweets error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch top sweets' });
  }
});

// Get dashboard stats (Admin/Super Admin)
router.get('/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    // Today's stats
    const todayOrders = await Order.countDocuments({
      created_at: { $gte: today },
      status: 'completed',
    });
    const todayRevenue = await Order.aggregate([
      {
        $match: {
          created_at: { $gte: today },
          status: 'completed',
          payment_status: 'paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const todayRevenueValue = todayRevenue[0]?.total || 0;

    // This month's stats
    const monthOrders = await Order.countDocuments({
      created_at: { $gte: thisMonth },
      status: 'completed',
    });
    const monthRevenue = await Order.aggregate([
      {
        $match: {
          created_at: { $gte: thisMonth },
          status: 'completed',
          payment_status: 'paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const monthRevenueValue = monthRevenue[0]?.total || 0;

    // This year's stats
    const yearRevenue = await Order.aggregate([
      {
        $match: {
          created_at: { $gte: thisYear },
          status: 'completed',
          payment_status: 'paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const yearRevenueValue = yearRevenue[0]?.total || 0;

    // Pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Total customers
    const totalCustomers = await User.countDocuments({ is_admin: false });

    // Low stock items
    const lowStockItems = await Sweet.countDocuments({ quantity: { $lt: 10 } });

    // Total sweets
    const totalSweets = await Sweet.countDocuments();

    res.json({
      today: {
        orders: todayOrders,
        revenue: todayRevenueValue,
      },
      this_month: {
        orders: monthOrders,
        revenue: monthRevenueValue,
      },
      this_year: {
        revenue: yearRevenueValue,
      },
      pending_orders: pendingOrders,
      total_customers: totalCustomers,
      low_stock_items: lowStockItems,
      total_sweets: totalSweets,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch dashboard stats' });
  }
});

export default router;

