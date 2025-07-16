const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: [true, 'Donor is required']
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    default: null
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  description: {
    type: String,
    default: 'Donation received for Jama Masjid Phugewadi'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'cheque', 'online', 'bank_transfer'],
    required: [true, 'Payment method is required']
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  chequeNumber: {
    type: String,
    default: null
  },
  bankName: {
    type: String,
    default: null
  },
  transactionId: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    maxLength: [500, 'Notes cannot exceed 500 characters']
  },
  createdBy: {
    type: String,
    default: 'jamamasjid'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
receiptSchema.index({ receiptNumber: 1 });
receiptSchema.index({ donor: 1 });
receiptSchema.index({ invoice: 1 });
receiptSchema.index({ paymentDate: 1 });

// Pre-save middleware to generate receipt number
receiptSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    const currentYear = new Date().getFullYear();
    this.receiptNumber = `RCP-${currentYear}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Receipt', receiptSchema);