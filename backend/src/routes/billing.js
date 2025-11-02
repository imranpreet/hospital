const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const { auth } = require('../middleware/auth');

router.post('/create', auth, async (req, res)=>{
  try{
    const { patientId, items = [], paymentMode } = req.body;
    const total = items.reduce((s,i)=> s + (i.price * (i.qty || 1)), 0);
    const bill = new Bill({ patientId, totalAmount: total, paymentMode });
    await bill.save();
    res.status(201).json(bill);
  }catch(err){ console.error(err); res.status(500).json({ msg: 'err' }) }
});

router.get('/view/:id', auth, async (req, res)=>{
  const bill = await Bill.findById(req.params.id);
  if (!bill) return res.status(404).json({ msg: 'Not found' });
  res.json(bill);
});

module.exports = router;
