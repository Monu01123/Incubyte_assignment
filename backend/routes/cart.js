import express from 'express';
import { Cart } from '../models/Cart.js';
import { Sweet } from '../models/Sweet.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user's cart
router.get('/', authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user._id }).populate('items.sweet_id');

    if (!cart) {
      cart = new Cart({
        user_id: req.user._id,
        items: [],
      });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/add', authenticate, async (req, res) => {
  try {
    const { sweet_id, quantity } = req.body;

    if (!sweet_id || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Sweet ID and valid quantity are required' });
    }

    // Verify sweet exists and has stock
    const sweet = await Sweet.findById(sweet_id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock available' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      cart = new Cart({
        user_id: req.user._id,
        items: [],
      });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.sweet_id.toString() === sweet_id
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (sweet.quantity < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock available' });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        sweet_id,
        quantity,
        price_at_added: sweet.price,
      });
    }

    await cart.save();
    await cart.populate('items.sweet_id');

    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: error.message || 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/item/:item_id', authenticate, async (req, res) => {
  try {
    const { item_id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.id(item_id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Check stock availability
    const sweet = await Sweet.findById(item.sweet_id);
    if (!sweet || sweet.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock available' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.sweet_id');

    res.json(cart);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: error.message || 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/item/:item_id', authenticate, async (req, res) => {
  try {
    const { item_id } = req.params;

    const cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items.id(item_id)?.remove();
    await cart.save();
    await cart.populate('items.sweet_id');

    res.json(cart);
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: error.message || 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/clear', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: error.message || 'Failed to clear cart' });
  }
});

export default router;

