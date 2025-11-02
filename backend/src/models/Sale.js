const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  medicineName: {
    type: String,
    required: true
  },
  medicineId: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

const saleSchema = new mongoose.Schema({
  saleId: {
    type: String,
    unique: true,
    sparse: true
  },
  items: [saleItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Insurance'],
    default: 'Cash'
  },
  customerName: String,
  customerPhone: String,
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  soldBy: {
    type: String,
    default: 'Admin'
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Cancelled'],
    default: 'Completed'
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  notes: String
}, {
  timestamps: true
});

// Auto-generate sale ID
saleSchema.pre('save', async function(next) {
  if (!this.saleId) {
    try {
      const count = await this.constructor.countDocuments();
      this.saleId = `SALE${(count + 1).toString().padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating saleId:', error);
      this.saleId = `SALE${Date.now().toString().slice(-6)}`;
    }
  }
  next();
});

// Index for faster queries
saleSchema.index({ saleDate: -1 });
saleSchema.index({ saleId: 1 });
saleSchema.index({ status: 1 });

module.exports = mongoose.model('Sale', saleSchema);
