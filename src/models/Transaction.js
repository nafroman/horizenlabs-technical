const mongoose = require('../db');

const transactionSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: String, required: true },
    txHash: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending',
    },
    error: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
