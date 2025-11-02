require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./src/models/Doctor');

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    specialization: 'Cardiologist',
    department: 'Cardiology',
    experience: '15 years',
    qualification: 'MD, DM (Cardiology)',
    phone: '+1-555-0101',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    consultationFee: 150,
    rating: 4.8
  },
  {
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    specialization: 'Neurologist',
    department: 'Neurology',
    experience: '12 years',
    qualification: 'MD, DM (Neurology)',
    phone: '+1-555-0102',
    availability: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    consultationFee: 180,
    rating: 4.9
  },
  {
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    specialization: 'Pediatrician',
    department: 'Pediatrics',
    experience: '10 years',
    qualification: 'MD, DCH',
    phone: '+1-555-0103',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    consultationFee: 120,
    rating: 4.7
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    specialization: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    experience: '18 years',
    qualification: 'MS (Ortho), FRCS',
    phone: '+1-555-0104',
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    consultationFee: 200,
    rating: 4.9
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@hospital.com',
    specialization: 'Gynecologist',
    department: 'Obstetrics & Gynecology',
    experience: '14 years',
    qualification: 'MD, DGO',
    phone: '+1-555-0105',
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    consultationFee: 140,
    rating: 4.8
  },
  {
    name: 'Dr. Robert Taylor',
    email: 'robert.taylor@hospital.com',
    specialization: 'General Physician',
    department: 'General Medicine',
    experience: '20 years',
    qualification: 'MBBS, MD',
    phone: '+1-555-0106',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    consultationFee: 100,
    rating: 4.6
  },
  {
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@hospital.com',
    specialization: 'Dermatologist',
    department: 'Dermatology',
    experience: '11 years',
    qualification: 'MD, DVD',
    phone: '+1-555-0107',
    availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    consultationFee: 130,
    rating: 4.7
  },
  {
    name: 'Dr. David Kumar',
    email: 'david.kumar@hospital.com',
    specialization: 'ENT Specialist',
    department: 'ENT',
    experience: '13 years',
    qualification: 'MS (ENT)',
    phone: '+1-555-0108',
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    consultationFee: 140,
    rating: 4.8
  },
  {
    name: 'Dr. Amanda White',
    email: 'amanda.white@hospital.com',
    specialization: 'Ophthalmologist',
    department: 'Ophthalmology',
    experience: '9 years',
    qualification: 'MS (Ophth), FICO',
    phone: '+1-555-0109',
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    consultationFee: 135,
    rating: 4.7
  },
  {
    name: 'Dr. Thomas Martinez',
    email: 'thomas.martinez@hospital.com',
    specialization: 'Psychiatrist',
    department: 'Psychiatry',
    experience: '16 years',
    qualification: 'MD (Psychiatry)',
    phone: '+1-555-0110',
    availability: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    consultationFee: 160,
    rating: 4.9
  }
];

async function seedDoctors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing doctors (optional - comment out if you want to keep existing ones)
    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    // Insert new doctors
    const result = await Doctor.insertMany(doctors);
    console.log(`✅ Successfully added ${result.length} doctors to the database`);

    // Display the doctors
    console.log('\nDoctors added:');
    result.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.name} - ${doc.specialization} (${doc.department})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    process.exit(1);
  }
}

seedDoctors();
