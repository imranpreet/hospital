const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

router.post('/', async (req, res)=>{
  try{
    const p = new Patient(req.body);
    await p.save();
    res.status(201).json(p);
  }catch(err){ console.error(err); res.status(500).json({ msg: 'err' }) }
});

router.get('/', async (req, res)=>{
  const list = await Patient.find().limit(500);
  res.json(list);
});

// Get single patient by ID
router.get('/:id', async (req, res)=>{
  try{
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    res.json(patient);
  }catch(err){ 
    console.error(err); 
    res.status(500).json({ msg: 'Error fetching patient' }) 
  }
});

module.exports = router;
