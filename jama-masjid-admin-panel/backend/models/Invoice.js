const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: [true, 'Donor is required']
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
    default: 'Donation to Jama Masjid Phugewadi'
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxLength: [500, 'Notes cannot exceed 500 characters']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'cheque', 'online', 'bank_transfer'],
    default: null
  },
  paymentDate: {
    type: Date,
    default: null
  },
  createdBy: {
    type: String,
    default: 'jamamasjid'
  }
}, {
  timestamps: true
});

// Index for faster queries
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ donor: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ dueDate: 1 });

// Pre-save middleware to generate invoice number
invoiceSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    const currentYear = new Date().getFullYear();
    this.invoiceNumber = `JMP-${currentYear}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);