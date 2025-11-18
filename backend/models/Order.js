import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  sweet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sweet',
    required: true,
  },
  sweet_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema({
  order_number: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  completed_at: {
    type: Date,
  },
});

orderSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  if (this.status === 'completed' && !this.completed_at) {
    this.completed_at = Date.now();
  }
  next();
});

// Generate unique order number
orderSchema.statics.generateOrderNumber = async function () {
  const prefix = 'ORD';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const orderNumber = `${prefix}-${timestamp}-${random}`;
  
  // Ensure uniqueness
  const exists = await this.findOne({ order_number: orderNumber });
  if (exists) {
    return this.generateOrderNumber();
  }
  
  return orderNumber;
};

orderSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    ret.user_id = ret.user_id?.toString();
    ret.items = ret.items.map(item => ({
      id: item._id?.toString(),
      sweet_id: item.sweet_id?.toString(),
      sweet_name: item.sweet_name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    }));
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Order = mongoose.model('Order', orderSchema);

