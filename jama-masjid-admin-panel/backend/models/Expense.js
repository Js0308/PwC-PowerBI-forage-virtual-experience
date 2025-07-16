const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxLength: [500, 'Description cannot exceed 500 characters']
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
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'Maintenance',
        'Utilities',
        'Religious Events',
        'Staff Salary',
        'Cleaning',
        'Security',
        'Repairs',
        'Office Supplies',
        'Food & Refreshments',
        'Transportation',
        'Medical',
        'Education',
        'Charity',
        'Others'
      ],
      message: 'Please select a valid category'
    }
  },
  expenseDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'cheque', 'online', 'bank_transfer'],
    required: [true, 'Payment method is required']
  },
  vendor: {
    type: String,
    trim: true,
    maxLength: [100, 'Vendor name cannot exceed 100 characters']
  },
  billNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxLength: [500, 'Notes cannot exceed 500 characters']
  },
  createdBy: {
    type: String,
    default: 'jamamasjid'
  },
  approvedBy: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'approved'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
expenseSchema.index({ expenseNumber: 1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ expenseDate: 1 });
expenseSchema.index({ status: 1 });

// Pre-save middleware to generate expense number
expenseSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    const currentYear = new Date().getFullYear();
    this.expenseNumber = `EXP-${currentYear}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Expense', expenseSchema);