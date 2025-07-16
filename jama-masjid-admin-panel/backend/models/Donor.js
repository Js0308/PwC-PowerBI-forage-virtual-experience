const mongoose = require('mongoose');
const validator = require('validator');

const donorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxLength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxLength: [50, 'Last name cannot exceed 50 characters']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: 'Mobile number must be exactly 10 digits'
    },
    unique: true
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    enum: {
      values: ['Masjid Chawl', 'Phugewadi', 'Wakhare Chawl', 'Sanjay Nagar', 'Outside'],
      message: 'Area must be one of: Masjid Chawl, Phugewadi, Wakhare Chawl, Sanjay Nagar, Outside'
    }
  },
  totalDonations: {
    type: Number,
    default: 0,
    min: 0
  },
  lastDonationDate: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    maxLength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Index for faster searches
donorSchema.index({ firstName: 1, lastName: 1 });
donorSchema.index({ mobileNumber: 1 });
donorSchema.index({ area: 1 });

// Virtual for full name
donorSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
donorSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Donor', donorSchema);