import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  sweet_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sweet',
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  transaction_type: {
    type: String,
    required: true,
    enum: ['purchase', 'restock'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Transform _id to id in JSON output
transactionSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    ret.sweet_id = ret.sweet_id?.toString();
    ret.user_id = ret.user_id?.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Transaction = mongoose.model('Transaction', transactionSchema);

