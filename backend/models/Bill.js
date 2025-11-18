import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  bill_number: {
    type: String,
    required: true,
    unique: true,
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
  },
  items: [{
    sweet_name: String,
    quantity: Number,
    price: Number,
    subtotal: Number,
  }],
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
  payment_method: {
    type: String,
    enum: ['cash', 'card', 'online'],
    default: 'cash',
  },
  generated_at: {
    type: Date,
    default: Date.now,
  },
});

// Generate unique bill number
billSchema.statics.generateBillNumber = async function () {
  const prefix = 'BILL';
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const billNumber = `${prefix}-${dateStr}-${random}`;
  
  // Ensure uniqueness
  const exists = await this.findOne({ bill_number: billNumber });
  if (exists) {
    return this.generateBillNumber();
  }
  
  return billNumber;
};

billSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    ret.order_id = ret.order_id?.toString();
    ret.user_id = ret.user_id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Bill = mongoose.model('Bill', billSchema);

