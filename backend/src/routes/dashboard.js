const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

router.get('/stats', async (req, res)=>{
  try{
    const users = await User.countDocuments();
    const doctors = await Doctor.countDocuments();
    const patients = await Patient.countDocuments();
    const appointments = await Appointment.countDocuments();
    res.json({ users, doctors, patients, appointments });
  }catch(err){ console.error(err); res.status(500).json({ msg: 'err' }) }
});

module.exports = router;
