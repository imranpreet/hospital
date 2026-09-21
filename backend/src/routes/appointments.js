const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { auth } = require('../middleware/auth');
const sendEmail = require('../utils/notifier');

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason, symptoms, aiSummary, recommendedDepartment, recommendedDoctor } = req.body;
    if (!patientId || !doctorId || !date) return res.status(400).json({ msg: 'Missing fields' });

    const appt = new Appointment({
      patientId,
      doctorId,
      date: new Date(date),
      time,
      reason: reason || aiSummary || 'General Consultation',
      symptoms: symptoms || reason || 'General Consultation',
      aiSummary: aiSummary || '',
      recommendedDepartment: recommendedDepartment || '',
      recommendedDoctor: recommendedDoctor || ''
    });
    await appt.save();

    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    const summaryText = [
      `Patient: ${patient ? patient.name : 'Patient'}`,
      `Doctor: ${doctor ? doctor.name : 'Doctor'}`,
      `Date: ${date}`,
      `Time: ${time}`,
      `Symptoms: ${symptoms || reason || 'Not provided'}`,
      `AI Summary: ${aiSummary || 'No AI summary provided'}`,
      `Recommended Department: ${recommendedDepartment || 'General Consultation'}`,
      `Recommended Doctor: ${recommendedDoctor || doctor?.name || 'Consultation'}`
    ].join('\n');

    if (patient && patient.contact) {
      sendEmail(patient.contact, 'Appointment Confirmation + AI Health Summary', `Your appointment is booked on ${date} at ${time}.\n\nAI Summary:\n${aiSummary || 'No additional AI guidance available.'}\n\nRecommended Department: ${recommendedDepartment || 'General Consultation'}\nRecommended Doctor: ${recommendedDoctor || doctor?.name || 'Doctor'}`);
    }

    if (doctor && doctor.email) {
      sendEmail(doctor.email, 'New Patient Appointment Summary', `Patient details:\n${summaryText}`);
    }

    res.status(201).json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// List appointments for logged-in user (patient or doctor)
router.get('/', auth, async (req, res) => {
  try {
    const { role, id } = req.user;
    const { patientId } = req.query; // Support query parameter for filtering

    let query = {};
    if (patientId) {
      query.patientId = patientId;
    } else if (role === 'patient') {
      query.patientId = id;
    } else if (role === 'doctor') {
      query.doctorId = id;
    }

    const appts = await Appointment.find(query)
      .populate('patientId')
      .populate('doctorId')
      .limit(200)
      .sort({ date: -1 });

    res.json(appts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Cancel appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ msg: 'Not found' });
    appt.status = 'cancelled';
    await appt.save();
    res.json({ msg: 'Cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update appointment status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const appt = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');

    if (!appt) return res.status(404).json({ msg: 'Appointment not found' });

    appt.status = status;
    await appt.save();

    res.json({ msg: 'Status updated successfully', appointment: appt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
