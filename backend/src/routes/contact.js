const express = require('express')
const router = express.Router()
const Contact = require('../models/Contact')
const { auth } = require('../middleware/auth')

// @route   POST /api/contact/submit
// @desc    Submit contact form
// @access  Public
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    // Validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      })
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\-\s()]{10,}$/
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid phone number' 
      })
    }

    // Create contact submission
    const contact = new Contact({
      name,
      email,
      phone,
      message,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    })

    await contact.save()

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name,
        createdAt: contact.createdAt
      }
    })
  } catch (error) {
    console.error('Contact submission error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit contact form. Please try again.' 
    })
  }
})

// @route   GET /api/contact/all
// @desc    Get all contact submissions (Admin only)
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query
    
    let query = {}
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status
    }
    
    // Search by name, email, or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-userAgent -ipAddress')

    const total = await Contact.countDocuments(query)

    // Get status counts
    const statusCounts = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        },
        statusCounts: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count
          return acc
        }, {})
      }
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch contacts' 
    })
  }
})

// @route   GET /api/contact/stats
// @desc    Get contact statistics (Admin only)
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Contact.countDocuments()
    const newContacts = await Contact.countDocuments({ status: 'new' })
    const resolvedContacts = await Contact.countDocuments({ status: 'resolved' })
    
    // Get contacts from last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentContacts = await Contact.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    })

    // Get contacts from today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayContacts = await Contact.countDocuments({ 
      createdAt: { $gte: today } 
    })

    res.json({
      success: true,
      data: {
        total,
        new: newContacts,
        resolved: resolvedContacts,
        last30Days: recentContacts,
        today: todayContacts
      }
    })
  } catch (error) {
    console.error('Get contact stats error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics' 
    })
  }
})

// @route   PATCH /api/contact/:id/status
// @desc    Update contact status (Admin only)
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body
    
    if (!['new', 'read', 'replied', 'resolved'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      })
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact not found' 
      })
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: contact
    })
  } catch (error) {
    console.error('Update contact status error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update status' 
    })
  }
})

// @route   DELETE /api/contact/:id
// @desc    Delete contact submission (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact not found' 
      })
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    })
  } catch (error) {
    console.error('Delete contact error:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete contact' 
    })
  }
})

module.exports = router
