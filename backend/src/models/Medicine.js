const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  medicineId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Inhaler', 'Cream', 'Other']
  },
  batchNumber: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  minimumRequired: {
    type: Number,
    required: true,
    default: 10
  },
  location: {
    type: String,
    default: 'Main Pharmacy'
  },
  addedBy: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Out of Stock', 'Expired', 'Low Stock'],
    default: 'Available'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
  },
  description: {
    type: String
  },
  dosage: {
    type: String
  },
  sideEffects: {
    type: String
  },
  salesCount: {
    type: Number,
    default: 0
  },
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  // Legacy fields for backward compatibility
  price: { type: Number },
  stock: { type: Number }
}, { timestamps: true });

// Indexes for better performance
medicineSchema.index({ name: 'text' })
medicineSchema.index({ category: 1 })
medicineSchema.index({ status: 1 })
medicineSchema.index({ expiryDate: 1 })
medicineSchema.index({ stockQuantity: 1 })

// Auto-update status based on stock and expiry
medicineSchema.pre('save', function(next) {
  const today = new Date()
  
  // Sync legacy fields
  if (this.pricePerUnit) this.price = this.pricePerUnit
  if (this.stockQuantity !== undefined) this.stock = this.stockQuantity
  
  // Check if expired
  if (this.expiryDate < today) {
    this.status = 'Expired'
  } 
  // Check if out of stock
  else if (this.stockQuantity === 0) {
    this.status = 'Out of Stock'
  }
  // Check if low stock
  else if (this.stockQuantity <= this.minimumRequired) {
    this.status = 'Low Stock'
  }
  // Otherwise available
  else {
    this.status = 'Available'
  }
  
  next()
})

// Method to check if expiring soon (within 30 days)
medicineSchema.methods.isExpiringSoon = function() {
  const today = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(today.getDate() + 30)
  
  return this.expiryDate <= thirtyDaysFromNow && this.expiryDate > today
}

module.exports = mongoose.model('Medicine', medicineSchema);


