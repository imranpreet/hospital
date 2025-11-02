const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const { auth } = require('../middleware/auth');

// @route   GET /api/medicines
// @desc    Get all medicines with filters
// @access  Public
router.get('/', async (req, res)=>{
  try {
    const { category, status, search, page = 1, limit = 10, sortBy = 'name' } = req.query
    
    let query = {}
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category
    }
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status
    }
    
    // Search by name, manufacturer, or supplier
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } }
      ]
    }
    
    const medicines = await Medicine.find(query)
      .sort({ [sortBy]: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    
    const total = await Medicine.countDocuments(query)
    
    res.json({
      success: true,
      data: medicines,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    })
  } catch(err) {
    console.error('Get medicines error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch medicines' })
  }
});

// @route   GET /api/medicines/stats
// @desc    Get pharmacy statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalMedicines = await Medicine.countDocuments()
    const availableMedicines = await Medicine.countDocuments({ status: 'Available' })
    const lowStockMedicines = await Medicine.countDocuments({ status: 'Low Stock' })
    const outOfStockMedicines = await Medicine.countDocuments({ status: 'Out of Stock' })
    const expiredMedicines = await Medicine.countDocuments({ status: 'Expired' })
    
    // Get medicines expiring in 30 days
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)
    const expiringSoon = await Medicine.countDocuments({
      expiryDate: { $gte: today, $lte: thirtyDaysFromNow },
      status: { $ne: 'Expired' }
    })
    
    // Total stock value
    const medicines = await Medicine.find()
    const totalValue = medicines.reduce((sum, med) => sum + (med.pricePerUnit * med.stockQuantity), 0)
    
    // Category distribution
    const categoryStats = await Medicine.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$stockQuantity' } } },
      { $sort: { count: -1 } }
    ])
    
    // Top selling medicines
    const topSelling = await Medicine.find().sort({ salesCount: -1 }).limit(5)
    
    res.json({
      success: true,
      data: {
        totalMedicines,
        availableMedicines,
        lowStockMedicines,
        outOfStockMedicines,
        expiredMedicines,
        expiringSoon,
        totalValue: totalValue.toFixed(2),
        categoryStats,
        topSelling
      }
    })
  } catch (err) {
    console.error('Get stats error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' })
  }
})

// @route   GET /api/medicines/expiring-soon
// @desc    Get medicines expiring within 30 days
// @access  Public
router.get('/expiring-soon', async (req, res) => {
  try {
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)
    
    const medicines = await Medicine.find({
      expiryDate: { $gte: today, $lte: thirtyDaysFromNow },
      status: { $ne: 'Expired' }
    }).sort({ expiryDate: 1 })
    
    res.json({
      success: true,
      data: medicines
    })
  } catch (err) {
    console.error('Get expiring medicines error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch expiring medicines' })
  }
})

// @route   GET /api/medicines/low-stock
// @desc    Get low stock medicines
// @access  Public
router.get('/low-stock', async (req, res) => {
  try {
    const medicines = await Medicine.find({
      $or: [
        { status: 'Low Stock' },
        { status: 'Out of Stock' }
      ]
    }).sort({ stockQuantity: 1 })
    
    res.json({
      success: true,
      data: medicines
    })
  } catch (err) {
    console.error('Get low stock medicines error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch low stock medicines' })
  }
})

// @route   GET /api/medicines/out-of-stock
// @desc    Get out of stock medicines
// @access  Public
router.get('/out-of-stock', async (req, res) => {
  try {
    const medicines = await Medicine.find({
      $or: [
        { stockQuantity: 0 },
        { status: 'Out of Stock' }
      ]
    }).sort({ name: 1 })
    
    res.json({
      success: true,
      data: medicines,
      count: medicines.length
    })
  } catch (err) {
    console.error('Get out of stock medicines error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch out of stock medicines' })
  }
})

// @route   GET /api/medicines/:id
// @desc    Get single medicine
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id)
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' })
    }
    res.json({ success: true, data: medicine })
  } catch (err) {
    console.error('Get medicine error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch medicine' })
  }
})

// @route   POST /api/medicines
// @desc    Add new medicine
// @access  Private
router.post('/', async (req, res)=>{
  try{
    // Generate medicineId if not provided
    if (!req.body.medicineId) {
      const count = await Medicine.countDocuments()
      req.body.medicineId = `MED${(count + 1).toString().padStart(6, '0')}`
    }
    
    const medicine = new Medicine(req.body);
    await medicine.save();
    
    res.status(201).json({
      success: true,
      message: 'Medicine added successfully',
      data: medicine
    });
  }catch(err){ 
    console.error('Add medicine error:', err)
    res.status(500).json({ success: false, message: 'Failed to add medicine', error: err.message })
  }
});

// @route   PUT /api/medicines/:id
// @desc    Update medicine
// @access  Private
router.put('/:id', async (req, res)=>{
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' })
    }
    
    res.json({
      success: true,
      message: 'Medicine updated successfully',
      data: medicine
    });
  } catch (err) {
    console.error('Update medicine error:', err)
    res.status(500).json({ success: false, message: 'Failed to update medicine' })
  }
});

// @route   PATCH /api/medicines/:id/stock
// @desc    Update medicine stock
// @access  Private
router.patch('/:id/stock', async (req, res) => {
  try {
    const { quantity, operation } = req.body // operation: 'add' or 'subtract'
    
    const medicine = await Medicine.findById(req.params.id)
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' })
    }
    
    if (operation === 'add') {
      medicine.stockQuantity += quantity
      medicine.lastRestocked = new Date()
    } else if (operation === 'subtract') {
      medicine.stockQuantity -= quantity
      medicine.salesCount += 1
    }
    
    await medicine.save()
    
    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: medicine
    })
  } catch (err) {
    console.error('Update stock error:', err)
    res.status(500).json({ success: false, message: 'Failed to update stock' })
  }
})

// @route   DELETE /api/medicines/:id
// @desc    Delete medicine
// @access  Private
router.delete('/:id', async (req, res)=>{
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' })
    }
    
    res.json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (err) {
    console.error('Delete medicine error:', err)
    res.status(500).json({ success: false, message: 'Failed to delete medicine' })
  }
});

module.exports = router;

