const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// List doctors with optional department filter
router.get('/', async (req, res) => {
  try {
    const { department, q } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const doctors = await Doctor.find(filter).limit(100);
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create doctor
router.post('/', async (req, res) => {
  try {
    const doc = new Doctor(req.body);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const doc = await Doctor.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
