const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Medicine = require('../models/Medicine');

// @route   POST /api/sales
// @desc    Create new sale (billing)
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { items, discount = 0, customerName, customerPhone, paymentMethod, notes } = req.body;
    
    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in sale' });
    }
    
    // Calculate total and update stock
    let totalAmount = 0;
    const saleItems = [];
    
    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      
      if (!medicine) {
        return res.status(404).json({ 
          success: false, 
          message: `Medicine ${item.medicineName} not found` 
        });
      }
      
      if (medicine.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stockQuantity}` 
        });
      }
      
      const itemTotal = medicine.pricePerUnit * item.quantity;
      totalAmount += itemTotal;
      
      // Update stock
      medicine.stockQuantity -= item.quantity;
      medicine.salesCount += item.quantity;
      await medicine.save();
      
      saleItems.push({
        medicine: medicine._id,
        medicineName: medicine.name,
        medicineId: medicine.medicineId,
        quantity: item.quantity,
        pricePerUnit: medicine.pricePerUnit,
        totalPrice: itemTotal
      });
    }
    
    const finalAmount = totalAmount - discount;
    
    // Create sale
    const sale = new Sale({
      items: saleItems,
      totalAmount,
      discount,
      finalAmount,
      customerName,
      customerPhone,
      paymentMethod,
      notes
    });
    
    await sale.save();
    
    res.status(201).json({
      success: true,
      message: 'Sale completed successfully',
      data: sale
    });
    
  } catch (err) {
    console.error('Create sale error:', err);
    res.status(500).json({ success: false, message: 'Failed to process sale' });
  }
});

// @route   GET /api/sales
// @desc    Get all sales
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.saleDate = {};
      if (startDate) query.saleDate.$gte = new Date(startDate);
      if (endDate) query.saleDate.$lte = new Date(endDate);
    }
    
    const sales = await Sale.find(query)
      .sort({ saleDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('items.medicine', 'name category');
    
    const count = await Sale.countDocuments(query);
    
    res.json({
      success: true,
      data: sales,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    console.error('Get sales error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch sales' });
  }
});

// @route   GET /api/sales/stats
// @desc    Get sales statistics
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    // Today's sales
    const todaySales = await Sale.aggregate([
      { $match: { saleDate: { $gte: startOfToday }, status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' }, count: { $sum: 1 } } }
    ]);
    
    // This month's sales
    const monthSales = await Sale.aggregate([
      { $match: { saleDate: { $gte: startOfMonth }, status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' }, count: { $sum: 1 } } }
    ]);
    
    // This year's sales
    const yearSales = await Sale.aggregate([
      { $match: { saleDate: { $gte: startOfYear }, status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' }, count: { $sum: 1 } } }
    ]);
    
    // Top selling medicines
    const topSelling = await Sale.aggregate([
      { $match: { status: 'Completed' } },
      { $unwind: '$items' },
      { $group: { 
        _id: '$items.medicine',
        medicineName: { $first: '$items.medicineName' },
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.totalPrice' }
      }},
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);
    
    // Daily sales trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyTrend = await Sale.aggregate([
      { $match: { saleDate: { $gte: sevenDaysAgo }, status: 'Completed' } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$saleDate' } },
        sales: { $sum: '$finalAmount' },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        today: todaySales[0] || { total: 0, count: 0 },
        month: monthSales[0] || { total: 0, count: 0 },
        year: yearSales[0] || { total: 0, count: 0 },
        topSelling,
        dailyTrend
      }
    });
  } catch (err) {
    console.error('Get sales stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch sales statistics' });
  }
});

// @route   GET /api/sales/:id
// @desc    Get single sale
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('items.medicine');
    
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    
    res.json({ success: true, data: sale });
  } catch (err) {
    console.error('Get sale error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch sale' });
  }
});

// @route   PATCH /api/sales/:id/status
// @desc    Update sale status
// @access  Private
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    
    res.json({ success: true, message: 'Status updated', data: sale });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

module.exports = router;
