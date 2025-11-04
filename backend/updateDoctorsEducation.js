require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./src/models/Doctor');

const educationData = {
  'Dr. Sarah Johnson': {
    education: 'MD, DM Cardiology - Harvard Medical School',
    educationDetails: {
      degree: 'MD (Doctor of Medicine), DM (Doctorate of Medicine in Cardiology)',
      university: 'Harvard Medical School, Boston',
      year: '2008',
      additional: 'Fellowship in Interventional Cardiology at Massachusetts General Hospital',
      certifications: [
        'Board Certified Cardiologist (American Board of Internal Medicine)',
        'ACLS (Advanced Cardiovascular Life Support) Certified',
        'Fellow of American College of Cardiology (FACC)'
      ]
    }
  },
  'Dr. Michael Chen': {
    education: 'MD, Neurology - Stanford University',
    educationDetails: {
      degree: 'MD (Doctor of Medicine), Neurology Specialization',
      university: 'Stanford University School of Medicine',
      year: '2010',
      additional: 'Fellowship in Clinical Neurophysiology',
      certifications: [
        'Board Certified Neurologist',
        'Certified in Electroencephalography (EEG)',
        'Stroke Specialist Certification'
      ]
    }
  },
  'Dr. Emily Rodriguez': {
    education: 'MD, Pediatrics - Yale School of Medicine',
    educationDetails: {
      degree: 'MD (Doctor of Medicine), Pediatrics',
      university: 'Yale School of Medicine',
      year: '2012',
      additional: 'Pediatric Emergency Medicine Fellowship',
      certifications: [
        'Board Certified Pediatrician',
        'Pediatric Advanced Life Support (PALS)',
        'Child Abuse Pediatrics Subspecialty'
      ]
    }
  },
  'Dr. James Wilson': {
    education: 'MD, MS Orthopedics - Mayo Clinic',
    educationDetails: {
      degree: 'MD (Doctor of Medicine), MS (Master of Surgery) in Orthopedics',
      university: 'Mayo Clinic College of Medicine',
      year: '2009',
      additional: 'Sports Medicine Fellowship',
      certifications: [
        'Board Certified Orthopedic Surgeon',
        'Certificate of Added Qualification in Sports Medicine',
        'Arthroscopy Association Certified'
      ]
    }
  },
  'Dr. Priya Sharma': {
    education: 'MD, Gynecology - AIIMS Delhi',
    educationDetails: {
      degree: 'MD (Doctor of Medicine) in Obstetrics & Gynecology',
      university: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
      year: '2011',
      additional: 'Fellowship in Reproductive Medicine',
      certifications: [
        'Board Certified OB/GYN',
        'Laparoscopic Surgery Certified',
        'High-Risk Pregnancy Specialist'
      ]
    }
  },
  'Dr. Robert Taylor': {
    education: 'MD, General Medicine - Johns Hopkins',
    educationDetails: {
      degree: 'MD (Doctor of Medicine), Internal Medicine',
      university: 'Johns Hopkins University School of Medicine',
      year: '2007',
      additional: 'Chief Resident in Internal Medicine',
      certifications: [
        'Board Certified Internal Medicine Physician',
        'Primary Care Certification',
        'Geriatric Medicine Certificate'
      ]
    }
  }
};

async function updateDoctors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const doctors = await Doctor.find();
    console.log(`Found ${doctors.length} doctors to update`);

    for (const doctor of doctors) {
      const eduData = educationData[doctor.name];
      if (eduData) {
        doctor.education = eduData.education;
        doctor.educationDetails = eduData.educationDetails;
        await doctor.save();
        console.log(`✅ Updated education for ${doctor.name}`);
      } else {
        // Add generic education for doctors without specific data
        doctor.education = `MD, ${doctor.specialization}`;
        doctor.educationDetails = {
          degree: `MD (Doctor of Medicine) in ${doctor.specialization}`,
          university: 'Medical College',
          year: '2010',
          certifications: [`Board Certified ${doctor.specialization} Specialist`]
        };
        await doctor.save();
        console.log(`✅ Added generic education for ${doctor.name}`);
      }
    }

    console.log('\n✅ All doctors updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating doctors:', error);
    process.exit(1);
  }
}

updateDoctors();
