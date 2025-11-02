const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Bed = require('../models/Bed');
const Patient = require('../models/Patient');
const { auth } = require('../middleware/auth');

// Get all rooms with bed details
router.get('/rooms', auth, async (req, res) => {
  try {
    const { roomType, status } = req.query;
    
    const filter = {};
    if (roomType) filter.roomType = roomType;
    if (status) filter.status = status;
    
    const rooms = await Room.find(filter).sort({ roomNumber: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Create new room
router.post('/rooms', auth, async (req, res) => {
  try {
    const { roomNumber, roomType, floor, capacity, pricePerDay, amenities } = req.body;
    
    // Check if room already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ msg: 'Room number already exists' });
    }
    
    const room = new Room({
      roomNumber,
      roomType,
      floor,
      capacity,
      availableBeds: capacity,
      pricePerDay,
      amenities: amenities || []
    });
    
    await room.save();
    
    // Create beds for this room
    const beds = [];
    for (let i = 1; i <= capacity; i++) {
      const bed = new Bed({
        bedNumber: `${roomNumber}-B${i}`,
        room: room._id,
        status: 'Available'
      });
      beds.push(bed);
    }
    
    await Bed.insertMany(beds);
    
    res.json({ msg: 'Room and beds created successfully', room, bedsCreated: beds.length });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all beds with filters
router.get('/beds', auth, async (req, res) => {
  try {
    const { roomType, status, roomId } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (roomId) filter.room = roomId;
    
    let beds = await Bed.find(filter)
      .populate('room')
      .populate({
        path: 'patient',
        select: 'name age gender contact admissionDate admissionReason'
      })
      .sort({ bedNumber: 1 });
    
    // Filter by room type if specified
    if (roomType) {
      beds = beds.filter(bed => bed.room && bed.room.roomType === roomType);
    }
    
    res.json(beds);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get bed statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalBeds = await Bed.countDocuments();
    const occupiedBeds = await Bed.countDocuments({ status: 'Occupied' });
    const availableBeds = await Bed.countDocuments({ status: 'Available' });
    const maintenanceBeds = await Bed.countDocuments({ status: 'Maintenance' });
    
    // Beds by room type
    const rooms = await Room.find({ status: 'Active' });
    const bedsByType = {};
    
    for (const room of rooms) {
      if (!bedsByType[room.roomType]) {
        bedsByType[room.roomType] = {
          total: 0,
          occupied: 0,
          available: 0
        };
      }
      bedsByType[room.roomType].total += room.capacity;
      bedsByType[room.roomType].occupied += room.occupiedBeds;
      bedsByType[room.roomType].available += room.availableBeds;
    }
    
    // Recent admissions
    const recentAdmissions = await Patient.find({ admissionStatus: 'Admitted' })
      .populate('bed')
      .populate('room')
      .sort({ admissionDate: -1 })
      .limit(5);
    
    res.json({
      totalBeds,
      occupiedBeds,
      availableBeds,
      maintenanceBeds,
      occupancyRate: ((occupiedBeds / totalBeds) * 100).toFixed(2),
      bedsByType,
      recentAdmissions
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Admit patient - Automatic bed assignment
router.post('/admit', auth, async (req, res) => {
  try {
    const { patientId, roomType, admissionReason, doctorId } = req.body;
    
    if (!patientId || !roomType) {
      return res.status(400).json({ msg: 'Patient ID and room type are required' });
    }
    
    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    // Check if patient is already admitted
    if (patient.admissionStatus === 'Admitted') {
      return res.status(400).json({ msg: 'Patient is already admitted' });
    }
    
    // Find available room of specified type
    const availableRoom = await Room.findOne({
      roomType,
      status: 'Active',
      availableBeds: { $gt: 0 }
    }).sort({ availableBeds: -1 });
    
    if (!availableRoom) {
      return res.status(404).json({ 
        msg: `No beds available in ${roomType} rooms`,
        suggestion: 'Please try a different room type or wait for a bed to become available'
      });
    }
    
    // Find first available bed in the room
    const availableBed = await Bed.findOne({
      room: availableRoom._id,
      status: 'Available'
    });
    
    if (!availableBed) {
      return res.status(404).json({ msg: 'No beds available in this room' });
    }
    
    // Update bed status
    availableBed.status = 'Occupied';
    availableBed.patient = patientId;
    availableBed.assignedDate = new Date();
    availableBed.dischargeDate = null;
    await availableBed.save();
    
    // Update room occupancy
    availableRoom.occupiedBeds += 1;
    availableRoom.availableBeds -= 1;
    await availableRoom.save();
    
    // Update patient
    patient.admissionStatus = 'Admitted';
    patient.bed = availableBed._id;
    patient.room = availableRoom._id;
    patient.admissionDate = new Date();
    patient.admissionReason = admissionReason || '';
    patient.dischargeDate = null;
    if (doctorId) patient.doctorId = doctorId;
    await patient.save();
    
    // Populate data for response
    await patient.populate('bed room doctorId');
    
    res.json({
      msg: 'Patient admitted successfully',
      patient,
      bed: availableBed,
      room: availableRoom
    });
    
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Discharge patient
router.post('/discharge', auth, async (req, res) => {
  try {
    const { patientId, dischargeSummary } = req.body;
    
    if (!patientId) {
      return res.status(400).json({ msg: 'Patient ID is required' });
    }
    
    const patient = await Patient.findById(patientId).populate('bed room');
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    
    if (patient.admissionStatus !== 'Admitted') {
      return res.status(400).json({ msg: 'Patient is not currently admitted' });
    }
    
    // Update bed status
    if (patient.bed) {
      const bed = await Bed.findById(patient.bed);
      if (bed) {
        bed.status = 'Available';
        bed.patient = null;
        bed.dischargeDate = new Date();
        bed.notes = dischargeSummary || '';
        await bed.save();
        
        // Update room occupancy
        if (patient.room) {
          const room = await Room.findById(patient.room);
          if (room) {
            room.occupiedBeds -= 1;
            room.availableBeds += 1;
            await room.save();
          }
        }
      }
    }
    
    // Update patient
    patient.admissionStatus = 'Discharged';
    patient.dischargeDate = new Date();
    
    // Calculate total days and bill
    if (patient.admissionDate && patient.room) {
      const days = Math.ceil((patient.dischargeDate - patient.admissionDate) / (1000 * 60 * 60 * 24));
      patient.totalBill = days * patient.room.pricePerDay;
    }
    
    await patient.save();
    await patient.populate('bed room doctorId');
    
    res.json({
      msg: 'Patient discharged successfully',
      patient,
      daysStayed: Math.ceil((patient.dischargeDate - patient.admissionDate) / (1000 * 60 * 60 * 24)),
      totalBill: patient.totalBill
    });
    
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Search beds or patients
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ msg: 'Search query is required' });
    }
    
    // Search beds by bed number
    const beds = await Bed.find({
      bedNumber: { $regex: query, $options: 'i' }
    }).populate('room patient').limit(10);
    
    // Search patients by name
    const patients = await Patient.find({
      name: { $regex: query, $options: 'i' },
      admissionStatus: 'Admitted'
    }).populate('bed room').limit(10);
    
    res.json({ beds, patients });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update bed status (for maintenance)
router.put('/beds/:bedId', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const bed = await Bed.findById(req.params.bedId);
    if (!bed) {
      return res.status(404).json({ msg: 'Bed not found' });
    }
    
    // Don't allow status change if occupied
    if (bed.status === 'Occupied' && status !== 'Occupied') {
      return res.status(400).json({ msg: 'Cannot change status of occupied bed. Discharge patient first.' });
    }
    
    bed.status = status;
    bed.notes = notes || bed.notes;
    await bed.save();
    
    res.json({ msg: 'Bed status updated', bed });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
