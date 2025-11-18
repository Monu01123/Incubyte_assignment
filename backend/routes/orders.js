import express from 'express';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Sweet } from '../models/Sweet.js';
import { Bill } from '../models/Bill.js';
import { User } from '../models/User.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create order from cart
router.post('/create', authenticate, async (req, res) => {
  try {
    const { payment_method = 'cash' } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user_id: req.user._id }).populate('items.sweet_id');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock and prepare order items
    const orderItems = [];
    for (const cartItem of cart.items) {
      const sweet = cartItem.sweet_id;
      
      if (sweet.quantity < cartItem.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${sweet.name}. Available: ${sweet.quantity}, Requested: ${cartItem.quantity}`,
        });
      }

      orderItems.push({
        sweet_id: sweet._id,
        sweet_name: sweet.name,
        quantity: cartItem.quantity,
        price: cartItem.price_at_added,
        subtotal: cartItem.price_at_added * cartItem.quantity,
      });
    }

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Create order
    const orderNumber = await Order.generateOrderNumber();
    const order = new Order({
      order_number: orderNumber,
      user_id: req.user._id,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: 'pending',
      payment_status: 'pending',
    });

    await order.save();

    // Update stock quantities
    for (const cartItem of cart.items) {
      const sweet = await Sweet.findById(cartItem.sweet_id);
      sweet.quantity -= cartItem.quantity;
      await sweet.save();
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Generate bill
    const user = await User.findById(req.user._id);
    const billNumber = await Bill.generateBillNumber();
    const bill = new Bill({
      bill_number: billNumber,
      order_id: order._id,
      user_id: req.user._id,
      user_name: user.full_name,
      user_email: user.email,
      items: orderItems.map(item => ({
        sweet_name: item.sweet_name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      subtotal,
      tax,
      total,
      payment_method,
    });

    await bill.save();

    // Update order payment status if paid
    if (payment_method !== 'cash') {
      order.payment_status = 'paid';
      await order.save();
    }

    await order.populate('user_id', 'email full_name');

    res.status(201).json({
      order,
      bill,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id })
      .sort({ created_at: -1 })
      .populate('items.sweet_id', 'name image_url');

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
});

// Get all orders (Admin/Super Admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, payment_status, start_date, end_date } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (payment_status) query.payment_status = payment_status;
    if (start_date || end_date) {
      query.created_at = {};
      if (start_date) query.created_at.$gte = new Date(start_date);
      if (end_date) query.created_at.$lte = new Date(end_date);
    }

    const orders = await Order.find(query)
      .sort({ created_at: -1 })
      .populate('user_id', 'email full_name');

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('user_id', 'email full_name');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns order or is admin
    if (order.user_id._id.toString() !== req.user._id.toString() && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch order' });
  }
});

// Update order status (Admin/Super Admin)
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: error.message || 'Failed to update order status' });
  }
});

// Cancel order
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns order or is admin
    if (order.user_id.toString() !== req.user._id.toString() && !req.user.is_admin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (order.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed order' });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({ error: 'Order already cancelled' });
    }

    // Restore stock
    for (const item of order.items) {
      const sweet = await Sweet.findById(item.sweet_id);
      if (sweet) {
        sweet.quantity += item.quantity;
        await sweet.save();
      }
    }

    order.status = 'cancelled';
    if (order.payment_status === 'paid') {
      order.payment_status = 'refunded';
    }
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: error.message || 'Failed to cancel order' });
  }
});

export default router;

