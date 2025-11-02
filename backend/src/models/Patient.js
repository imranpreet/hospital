const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  contact: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  history: [{ date: Date, notes: String }],
  // Ward Management Fields
  admissionStatus: {
    type: String,
    enum: ['Admitted', 'Discharged', 'Outpatient'],
    default: 'Outpatient'
  },
  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
    default: null
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null
  },
  admissionDate: {
    type: Date,
    default: null
  },
  dischargeDate: {
    type: Date,
    default: null
  },
  admissionReason: {
    type: String,
    default: ''
  },
  totalBill: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
