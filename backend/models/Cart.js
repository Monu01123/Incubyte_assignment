import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  sweet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sweet',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price_at_added: {
    type: Number,
    required: true,
    min: 0,
  },
});

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

// Calculate total price
cartSchema.methods.calculateTotal = function () {
  return this.items.reduce((total, item) => {
    return total + (item.price_at_added * item.quantity);
  }, 0);
};

cartSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    ret.user_id = ret.user_id?.toString();
    ret.items = ret.items.map(item => ({
      id: item._id?.toString(),
      sweet_id: item.sweet_id?.toString(),
      quantity: item.quantity,
      price_at_added: item.price_at_added,
    }));
    ret.total = doc.calculateTotal();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Cart = mongoose.model('Cart', cartSchema);

