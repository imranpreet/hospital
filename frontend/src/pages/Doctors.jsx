import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import { motion } from 'framer-motion'
import { Search, Stethoscope, Calendar, Mail, Phone, Award, Star, BookOpen, GraduationCap, Clock, CheckCircle, X, User, FileText } from 'lucide-react'

export default function Doctors(){
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showAvailability, setShowAvailability] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [showPatientList, setShowPatientList] = useState(false)
  const [patientsList, setPatientsList] = useState([])
  const [expandedEducation, setExpandedEducation] = useState({})
  const [bookingData, setBookingData] = useState({
    patientName: '',
    problem: '',
    preferredTime: '',
    selectedDate: '',
    selectedTimeSlot: ''
  })
  const [availabilityResult, setAvailabilityResult] = useState(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const navigate = useNavigate()
  
  const toggleEducation = (doctorId) => {
    setExpandedEducation(prev => ({
      ...prev,
      [doctorId]: !prev[doctorId]
    }))
  }

  // Sample expert doctors with complete information
  const sampleDoctors = [
    {
      _id: '1',
      name: 'Dr. Asha Rao',
      specialization: 'Cardiologist',
      department: 'Cardiology',
      experience: '15 years',
      education: 'MD, DM Cardiology - Harvard Medical School',
      educationDetails: {
        degree: 'Doctor of Medicine (MD), Doctor of Medicine in Cardiology (DM)',
        university: 'Harvard Medical School',
        year: '2010',
        additional: 'Fellowship in Interventional Cardiology, Johns Hopkins Hospital (2012)',
        certifications: ['Board Certified in Cardiology', 'FACC (Fellow of American College of Cardiology)', 'Advanced Cardiac Life Support (ACLS)']
      },
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
      certificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80',
      bio: 'Dr. Asha Rao is a board-certified cardiologist with over 15 years of experience. She specializes in interventional cardiology and has performed over 3,000 successful cardiac procedures. She completed her residency at Johns Hopkins and fellowship at Harvard Medical School.',
      email: 'asha.rao@citycare.com',
      contact: '+1 (555) 123-4567',
      rating: 4.9,
      patients: '5000+',
      availability: {
        monday: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        tuesday: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'],
        wednesday: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        thursday: ['09:00 AM', '10:00 AM', '11:00 AM'],
        friday: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        saturday: ['09:00 AM', '10:00 AM'],
        sunday: []
      }
    },
    {
      _id: '2',
      name: 'Dr. Priya Sharma',
      specialization: 'Neurologist',
      department: 'Neurology',
      experience: '12 years',
      education: 'MD, Neurology - Stanford University',
      educationDetails: {
        degree: 'Doctor of Medicine (MD) in Neurology',
        university: 'Stanford University School of Medicine',
        year: '2013',
        additional: 'Residency in Neurology, Mayo Clinic (2016)',
        certifications: ['Board Certified in Neurology', 'Epilepsy Specialist Certification', 'Stroke Intervention Certification']
      },
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
      certificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80',
      bio: 'Dr. Priya Sharma specializes in treating neurological disorders including epilepsy, stroke, and movement disorders. She has published over 50 research papers and is a pioneer in advanced brain imaging techniques. She believes in patient-centered care and evidence-based medicine.',
      email: 'priya.sharma@citycare.com',
      contact: '+1 (555) 234-5678',
      rating: 4.8,
      patients: '4500+',
      availability: {
        monday: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        tuesday: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        wednesday: ['10:00 AM', '11:00 AM', '02:00 PM'],
        thursday: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        friday: ['09:00 AM', '10:00 AM', '11:00 AM'],
        saturday: [],
        sunday: []
      }
    },
    {
      _id: '3',
      name: 'Dr. Vikram Singh',
      specialization: 'Pediatrician',
      department: 'Pediatrics',
      experience: '10 years',
      education: 'MD, Pediatrics - Yale School of Medicine',
      educationDetails: {
        degree: 'Doctor of Medicine (MD) in Pediatrics',
        university: 'Yale School of Medicine',
        year: '2015',
        additional: 'Fellowship in Pediatric Emergency Medicine, Boston Children\'s Hospital (2018)',
        certifications: ['Board Certified in Pediatrics', 'Pediatric Advanced Life Support (PALS)', 'Child Development Specialist']
      },
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
      certificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80',
      bio: 'Dr. Vikram Singh is passionate about child healthcare and preventive medicine. He has extensive experience in treating childhood diseases, developmental disorders, and behavioral issues. He creates a comfortable and friendly environment for young patients and their families.',
      email: 'vikram.singh@citycare.com',
      contact: '+1 (555) 345-6789',
      rating: 4.9,
      patients: '6000+',
      availability: {
        monday: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'],
        tuesday: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        wednesday: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'],
        thursday: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'],
        friday: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'],
        saturday: ['09:00 AM', '10:00 AM', '11:00 AM'],
        sunday: []
      }
    },
    {
      _id: '4',
      name: 'Dr. James Williams',
      specialization: 'Orthopedic Surgeon',
      department: 'Orthopedics',
      experience: '18 years',
      education: 'MD, MS Orthopedics - Mayo Clinic',
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
      certificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80',
      bio: 'Dr. James Williams is a renowned orthopedic surgeon specializing in joint replacement, sports injuries, and spinal surgery. He has performed over 5,000 successful surgeries and is known for his innovative minimally invasive techniques that reduce recovery time.',
      email: 'james.williams@citycare.com',
      contact: '+1 (555) 456-7890',
      rating: 4.7,
      patients: '4000+',
      availability: {
        monday: ['08:00 AM', '09:00 AM', '10:00 AM', '02:00 PM'],
        tuesday: ['08:00 AM', '09:00 AM', '10:00 AM'],
        wednesday: ['08:00 AM', '09:00 AM', '02:00 PM', '03:00 PM'],
        thursday: ['08:00 AM', '09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'],
        friday: ['08:00 AM', '09:00 AM', '10:00 AM'],
        saturday: [],
        sunday: []
      }
    },
    {
      _id: '5',
      name: 'Dr. Priya Patel',
      specialization: 'Dermatologist',
      department: 'Dermatology',
      experience: '8 years',
      education: 'MD, Dermatology - Columbia University',
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
      certificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80',
      bio: 'Dr. Priya Patel is an expert in medical and cosmetic dermatology. She treats various skin conditions including acne, eczema, psoriasis, and skin cancer. She also offers advanced cosmetic procedures like laser therapy, chemical peels, and anti-aging treatments.',
      email: 'priya.patel@citycare.com',
      contact: '+1 (555) 567-8901',
      rating: 4.8,
      patients: '3500+',
      availability: {
        monday: ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
        tuesday: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        wednesday: ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM'],
        thursday: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        friday: ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM'],
        saturday: ['10:00 AM', '11:00 AM'],
        sunday: []
      }
    },
    {
      _id: '6',
      name: 'Dr. Robert Thompson',
      specialization: 'General Surgeon',
      department: 'Surgery',
      experience: '20 years',
      education: 'MD, MS General Surgery - Johns Hopkins',
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
      certificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80',
      bio: 'Dr. Robert Thompson is a highly experienced general surgeon with expertise in laparoscopic and robotic surgery. He specializes in abdominal surgeries, hernia repairs, and minimally invasive procedures. He has trained numerous surgeons and is recognized internationally for his surgical skills.',
      email: 'robert.thompson@citycare.com',
      contact: '+1 (555) 678-9012',
      rating: 4.9,
      patients: '7000+',
      availability: {
        monday: ['08:00 AM', '09:00 AM', '10:00 AM'],
        tuesday: ['08:00 AM', '09:00 AM', '10:00 AM', '02:00 PM'],
        wednesday: ['08:00 AM', '09:00 AM'],
        thursday: ['08:00 AM', '09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'],
        friday: ['08:00 AM', '09:00 AM', '10:00 AM'],
        saturday: [],
        sunday: []
      }
    },
    {
      _id: '7',
      name: 'Dr. Aisha Khan',
      specialization: 'Gynecologist',
      department: 'Obstetrics & Gynecology',
      experience: '14 years',
      education: 'MD, MS OB/GYN - University of California',
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
      certificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80',
      bio: 'Dr. Aisha Khan is a compassionate gynecologist specializing in women\'s health, prenatal care, and minimally invasive gynecological surgery. She has delivered over 2,000 babies and is known for her patient-centered approach. She provides comprehensive care for women of all ages.',
      email: 'aisha.khan@citycare.com',
      contact: '+1 (555) 789-0123',
      rating: 4.9,
      patients: '5500+',
      availability: {
        monday: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        tuesday: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'],
        wednesday: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        thursday: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'],
        friday: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'],
        saturday: ['09:00 AM', '10:00 AM'],
        sunday: []
      }
    },
    {
      _id: '8',
      name: 'Dr. David Martinez',
      specialization: 'Psychiatrist',
      department: 'Mental Health',
      experience: '11 years',
      education: 'MD, Psychiatry - Duke University Medical Center',
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
      certificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80',
      bio: 'Dr. David Martinez is a board-certified psychiatrist specializing in anxiety disorders, depression, and trauma therapy. He uses evidence-based approaches including CBT, medication management, and mindfulness techniques. He creates a safe, non-judgmental space for healing.',
      email: 'david.martinez@citycare.com',
      contact: '+1 (555) 890-1234',
      rating: 4.8,
      patients: '3800+',
      availability: {
        monday: ['10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
        tuesday: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        wednesday: ['10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'],
        thursday: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        friday: ['10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'],
        saturday: [],
        sunday: []
      }
    },
    {
      _id: '9',
      name: 'Dr. Lisa Anderson',
      specialization: 'Ophthalmologist',
      department: 'Eye Care',
      experience: '16 years',
      education: 'MD, Ophthalmology - Johns Hopkins University',
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
      certificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80',
      bio: 'Dr. Lisa Anderson is a leading ophthalmologist specializing in cataract surgery, LASIK, and retinal diseases. She has performed over 8,000 successful eye surgeries and is recognized for her expertise in advanced vision correction techniques. She combines cutting-edge technology with compassionate patient care.',
      email: 'lisa.anderson@citycare.com',
      contact: '+1 (555) 901-2345',
      rating: 4.9,
      patients: '6200+',
      availability: {
        monday: ['08:30 AM', '09:30 AM', '10:30 AM', '02:00 PM', '03:00 PM'],
        tuesday: ['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM'],
        wednesday: ['08:30 AM', '09:30 AM', '10:30 AM', '02:00 PM', '03:00 PM'],
        thursday: ['08:30 AM', '09:30 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        friday: ['08:30 AM', '09:30 AM', '10:30 AM', '02:00 PM'],
        saturday: ['09:00 AM', '10:00 AM'],
        sunday: []
      }
    },
    {
      _id: '10',
      name: 'Dr. Raj Kumar',
      specialization: 'ENT Specialist',
      department: 'Ear, Nose & Throat',
      experience: '13 years',
      education: 'MD, MS ENT - All India Institute of Medical Sciences',
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
      certificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&q=80',
      bio: 'Dr. Raj Kumar is an expert ENT surgeon specializing in sinus surgery, hearing restoration, and voice disorders. He has extensive experience in endoscopic procedures and has helped thousands of patients improve their quality of life. He is known for his precise surgical skills and patient-first approach.',
      email: 'raj.kumar@citycare.com',
      contact: '+1 (555) 012-3456',
      rating: 4.8,
      patients: '4800+',
      availability: {
        monday: ['09:00 AM', '10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM'],
        tuesday: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        wednesday: ['09:00 AM', '10:00 AM', '03:00 PM', '04:00 PM'],
        thursday: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
        friday: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM'],
        saturday: ['09:00 AM', '10:00 AM'],
        sunday: []
      }
    }
  ]

  useEffect(() => {
    // Fetch real doctors from backend
    API.get('/doctors')
      .then(res => {
        // If backend has doctors, use them; otherwise use sample doctors
        if (res.data && res.data.length > 0) {
          setDoctors(res.data)
        } else {
          setDoctors(sampleDoctors)
        }
        setLoading(false)
      })
      .catch(() => {
        // Fallback to sample doctors if API fails
        setDoctors(sampleDoctors)
        setLoading(false)
      })
  }, [])

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
    d.department?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCheckAvailability = (doctor) => {
    setSelectedDoctor(doctor)
    setShowBookingForm(true)
    setShowAvailability(false)
    setAvailabilityResult(null)
    setBookingData({ patientName: '', problem: '', preferredTime: '', selectedDate: '', selectedTimeSlot: '' })
  }

  // New function to check if doctor is available on selected date and time
  const checkDoctorAvailability = () => {
    if (!bookingData.selectedDate || !bookingData.selectedTimeSlot) {
      alert('Please select both date and time slot')
      return
    }

    setCheckingAvailability(true)
    
    // Get the day of week from selected date (for reference only, not blocking)
    const selectedDateObj = new Date(bookingData.selectedDate)
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = days[selectedDateObj.getDay()]
    
    // NOTE: We're not checking day-of-week restrictions anymore
    // Doctors can be booked any day, we only check for time slot conflicts
    
    // Get all possible time slots from doctor's schedule (use all available slots from any day)
    let allDoctorSlots = []
    if (selectedDoctor.availability) {
      Object.values(selectedDoctor.availability).forEach(daySlots => {
        daySlots.forEach(slot => {
          if (!allDoctorSlots.includes(slot)) {
            allDoctorSlots.push(slot)
          }
        })
      })
    }
    
    // If no availability data, allow standard time slots
    if (allDoctorSlots.length === 0) {
      allDoctorSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
    }

    // Check if doctor already has an appointment at this time - ENHANCED CHECKING
    const allAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '{}')
    const doctorAppointments = allAppointments[selectedDoctor._id] || []
    
    // Also check main appointments list
    const mainAppointments = JSON.parse(localStorage.getItem('appointments') || '[]')
    
    // Combine all appointments
    const combinedAppointments = [
      ...doctorAppointments,
      ...mainAppointments.filter(apt => 
        apt.doctorId === selectedDoctor._id || 
        apt.doctor === selectedDoctor.name ||
        apt.doctorName === selectedDoctor.name
      )
    ]
    
    console.log('🔍 Checking availability for:', selectedDoctor.name)
    console.log('📅 Selected Date:', bookingData.selectedDate)
    console.log('⏰ Selected Time:', bookingData.selectedTimeSlot)
    console.log('📋 All appointments:', combinedAppointments)
    
    const conflictingAppointment = combinedAppointments.find(apt => {
      const isSameDate = apt.appointmentDate === bookingData.selectedDate || apt.date === bookingData.selectedDate
      const isSameTime = apt.appointmentTime === bookingData.selectedTimeSlot || apt.time === bookingData.selectedTimeSlot
      const isPending = apt.status === 'pending' || apt.status === 'scheduled' || !apt.status
      
      console.log('Checking appointment:', apt.patientName || apt.patient, '- Same date:', isSameDate, 'Same time:', isSameTime, 'Pending:', isPending)
      
      return isSameDate && isSameTime && isPending
    })

    if (conflictingAppointment) {
      console.log('❌ CONFLICT FOUND with patient:', conflictingAppointment.patientName || conflictingAppointment.patient)
      
      // Calculate alternative slots from all doctor's time slots
      const alternativeSlots = allDoctorSlots.filter(slot => 
        !combinedAppointments.some(apt => {
          const isSameDate = apt.appointmentDate === bookingData.selectedDate || apt.date === bookingData.selectedDate
          const isSameTime = apt.appointmentTime === slot || apt.time === slot
          const isPending = apt.status === 'pending' || apt.status === 'scheduled' || !apt.status
          return isSameDate && isSameTime && isPending
        })
      )
      
      setAvailabilityResult({
        available: false,
        reason: 'busy',
        message: `❌ Sorry! Dr. ${selectedDoctor.name} is BUSY at ${bookingData.selectedTimeSlot} on ${new Date(bookingData.selectedDate).toLocaleDateString()}.`,
        detailedMessage: `Patient "${conflictingAppointment.patientName || conflictingAppointment.patient}" has already booked this time slot. Please reschedule.`,
        alternativeSlots: alternativeSlots,
        conflictWith: conflictingAppointment.patientName || conflictingAppointment.patient
      })
      setCheckingAvailability(false)
      return
    }

    // Doctor is available!
    setTimeout(() => {
      setAvailabilityResult({
        available: true,
        message: `Great news! Dr. ${selectedDoctor.name} is available on ${new Date(bookingData.selectedDate).toLocaleDateString()} at ${bookingData.selectedTimeSlot}. You can proceed with booking your appointment.`,
        confirmedDate: bookingData.selectedDate,
        confirmedTime: bookingData.selectedTimeSlot
      })
      setCheckingAvailability(false)
    }, 1500) // Simulate checking delay
  }

  const handleShowAvailability = () => {
    if (!bookingData.patientName || !bookingData.problem) {
      alert('Please fill in your name and problem first')
      return
    }
    setShowBookingForm(false)
    setShowAvailability(true)
  }

  const handleBookAppointment = (doctor) => {
    // Directly navigate to appointment page with doctor info
    navigate('/appointment', { 
      state: { 
        selectedDoctor: doctor
      } 
    })
  }

  const handleBookingSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    
    if (!bookingData.patientName || !bookingData.problem || !bookingData.preferredTime) {
      alert('Please fill in all fields and select a time slot')
      return
    }

    // Add patient to doctor's patient list
    const allAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '{}')
    const doctorAppointments = allAppointments[selectedDoctor._id] || []
    
    // Parse the preferred time to get date and time
    const appointmentDate = new Date().toISOString().split('T')[0] // Today's date
    
    const newPatient = {
      id: Date.now(),
      patientName: bookingData.patientName,
      age: 0, // Age not collected in this form
      problem: bookingData.problem,
      appointmentDate: appointmentDate,
      appointmentTime: bookingData.preferredTime,
      status: 'pending'
    }
    
    doctorAppointments.push(newPatient)
    allAppointments[selectedDoctor._id] = doctorAppointments
    localStorage.setItem('doctorAppointments', JSON.stringify(allAppointments))

    // Create notification
    const notification = {
      id: Date.now(),
      title: 'New Appointment Request',
      message: `${bookingData.patientName} requested an appointment with Dr. ${selectedDoctor.name} at ${bookingData.preferredTime}`,
      timestamp: new Date().toISOString(),
      read: false
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }))

    // Show success message
    alert(`✅ Great! Dr. ${selectedDoctor.name} is available!\n\n` +
          `Patient: ${bookingData.patientName}\n` +
          `Problem: ${bookingData.problem}\n` +
          `Preferred Time: ${bookingData.preferredTime}\n\n` +
          `Proceeding to book your appointment...`)
    
    // Navigate to appointment page with all details
    navigate('/appointment', { 
      state: { 
        selectedDoctor: selectedDoctor,
        patientName: bookingData.patientName,
        problem: bookingData.problem,
        preferredTime: bookingData.preferredTime
      } 
    })
  }

  const handleViewPatients = async (doctor) => {
    setSelectedDoctor(doctor)
    
    // Try to fetch real appointments from database
    try {
      const response = await API.get('/appointments')
      const allAppointments = response.data
      
      // Filter appointments for this doctor
      const doctorAppointments = allAppointments
        .filter(apt => {
          const doctorId = apt.doctorId?._id || apt.doctorId
          return doctorId === doctor._id
        })
        .map(apt => ({
          id: apt._id,
          appointmentId: apt._id, // Store appointment ID for status updates
          patientName: apt.patientId?.name || 'Unknown',
          age: apt.patientId?.age || 'N/A',
          problem: apt.reason || 'General Consultation',
          appointmentDate: apt.date,
          appointmentTime: apt.time || 'N/A',
          status: apt.status === 'completed' ? 'checked-up' : 'pending',
          checkedUpDate: apt.status === 'completed' ? apt.updatedAt : null
        }))
      
      if (doctorAppointments.length > 0) {
        setPatientsList(doctorAppointments)
        setShowPatientList(true)
        return
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
    
    // Fall back to localStorage if API fails or no appointments found
    const allAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '{}')
    const doctorAppointments = allAppointments[doctor._id] || []
    
    // If no appointments exist, create some sample data for demonstration
    if (doctorAppointments.length === 0) {
      const samplePatients = [
        {
          id: Date.now() + 1,
          patientName: 'John Smith',
          age: 45,
          problem: 'Chest pain and irregular heartbeat',
          appointmentDate: '2025-10-28',
          appointmentTime: '09:00 AM',
          status: 'checked-up',
          checkedUpDate: '2025-10-28'
        },
        {
          id: Date.now() + 2,
          patientName: 'Emma Wilson',
          age: 38,
          problem: 'Routine cardiac checkup',
          appointmentDate: '2025-10-29',
          appointmentTime: '10:00 AM',
          status: 'checked-up',
          checkedUpDate: '2025-10-29'
        },
        {
          id: Date.now() + 3,
          patientName: 'Michael Brown',
          age: 52,
          problem: 'High blood pressure consultation',
          appointmentDate: '2025-10-31',
          appointmentTime: '02:00 PM',
          status: 'pending'
        },
        {
          id: Date.now() + 4,
          patientName: 'Sarah Davis',
          age: 41,
          problem: 'Follow-up after cardiac procedure',
          appointmentDate: '2025-11-01',
          appointmentTime: '11:00 AM',
          status: 'pending'
        }
      ]
      
      allAppointments[doctor._id] = samplePatients
      localStorage.setItem('doctorAppointments', JSON.stringify(allAppointments))
      setPatientsList(samplePatients)
    } else {
      setPatientsList(doctorAppointments)
    }
    
    setShowPatientList(true)
  }

  const togglePatientStatus = async (patientId) => {
    const updatedPatients = patientsList.map(patient => {
      if (patient.id === patientId) {
        const newStatus = patient.status === 'pending' ? 'checked-up' : 'pending'
        
        // If marking as checked-up, remove the related notification
        if (newStatus === 'checked-up') {
          const notifications = JSON.parse(localStorage.getItem('notifications') || '[]')
          const updatedNotifications = notifications.filter(notif => 
            !notif.message.includes(patient.patientName) || 
            !notif.message.includes(selectedDoctor.name)
          )
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
          
          // Dispatch event to update notification UI
          window.dispatchEvent(new CustomEvent('notificationRemoved'))
        }
        
        return {
          ...patient,
          status: newStatus,
          checkedUpDate: newStatus === 'checked-up' ? new Date().toISOString().split('T')[0] : null
        }
      }
      return patient
    })
    
    setPatientsList(updatedPatients)
    
    // Update localStorage
    const allAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '{}')
    allAppointments[selectedDoctor._id] = updatedPatients
    localStorage.setItem('doctorAppointments', JSON.stringify(allAppointments))
    
    // Also update in database if appointmentId exists
    const patient = patientsList.find(p => p.id === patientId)
    if (patient && patient.appointmentId) {
      try {
        const newStatus = patient.status === 'pending' ? 'completed' : 'scheduled'
        await API.patch(`/appointments/${patient.appointmentId}/status`, { status: newStatus })
        console.log('Database appointment status updated successfully')
      } catch (error) {
        console.error('Error updating appointment status in database:', error)
      }
    }
  }

  const getTodayAvailability = (doctor) => {
    if (!doctor.availability) return []
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = days[new Date().getDay()]
    return doctor.availability[today] || []
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50'>
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 py-16 shadow-xl'>
        <div className='max-w-7xl mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center'
          >
            <div className='flex items-center justify-center gap-4 mb-4'>
              <div className='w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl'>
                <Stethoscope className='w-10 h-10 text-blue-600' />
              </div>
              <h1 className='text-6xl font-extrabold text-white drop-shadow-2xl'>Our Expert Doctors</h1>
            </div>
            <p className='text-2xl text-white/90 mb-6 font-medium drop-shadow-lg'>
              World-Class Healthcare Professionals at Your Service
            </p>
            <div className='flex items-center justify-center gap-8 text-white/90'>
              <div className='flex items-center gap-2'>
                <Award className='w-5 h-5' />
                <span className='font-semibold'>Board Certified</span>
              </div>
              <div className='w-1 h-6 bg-white/30'></div>
              <div className='flex items-center gap-2'>
                <Star className='w-5 h-5' />
                <span className='font-semibold'>Highly Rated</span>
              </div>
              <div className='w-1 h-6 bg-white/30'></div>
              <div className='flex items-center gap-2'>
                <GraduationCap className='w-5 h-5' />
                <span className='font-semibold'>Experienced</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-12'>
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='mb-12'
        >
          <div className='max-w-3xl mx-auto relative'>
            <Search className='absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400' />
            <input
              type='text'
              placeholder='Search by name, specialization, or department...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-14 pr-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-lg text-lg transition-all bg-white'
            />
          </div>
        </motion.div>

        {loading ? (
            <div className='text-center py-20'>
              <div className='inline-block animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent shadow-lg'></div>
              <p className='mt-6 text-gray-600 text-xl font-medium'>Loading expert doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className='text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100'>
              <Stethoscope className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-600 text-xl'>No doctors found matching your search.</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredDoctors.map((doctor, idx) => (
                <motion.div
                  key={doctor._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className='bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 group hover:-translate-y-2'
                >
                  {/* Doctor Image */}
                  <div className='relative h-80 overflow-hidden'>
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' 
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&size=500&background=0D8ABC&color=fff&bold=true`
                      }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent'></div>
                    
                    {/* Rating Badge */}
                    <div className='absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg flex items-center gap-1'>
                      <Star className='w-5 h-5 text-yellow-500 fill-yellow-500' />
                      <span className='font-bold text-gray-800'>{doctor.rating || '4.8'}</span>
                    </div>

                    {/* Experience Badge */}
                    <div className='absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-xl shadow-lg font-bold text-sm'>
                      {doctor.experience || '10+ years'}
                    </div>

                    {/* Name overlay */}
                    <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                      <h3 className='text-3xl font-bold mb-1 drop-shadow-lg'>{doctor.name}</h3>
                      <div className='flex items-center gap-2 text-cyan-300'>
                        <Award className='w-5 h-5' />
                        <span className='font-semibold text-lg'>{doctor.specialization || 'Medical Specialist'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Doctor Info */}
                  <div className='p-6 space-y-4'>
                    {/* Education & Certificate */}
                    <div 
                      className='bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 cursor-pointer hover:shadow-md transition-all duration-300'
                      onClick={() => toggleEducation(doctor._id)}
                    >
                      <div className='flex items-start gap-3 mb-3'>
                        <GraduationCap className='w-6 h-6 text-blue-600 flex-shrink-0 mt-1' />
                        <div className='flex-1'>
                          <div className='text-xs font-semibold text-blue-600 mb-1 flex items-center justify-between'>
                            <span>EDUCATION</span>
                            <span className='text-xs text-gray-500'>{expandedEducation[doctor._id] ? '▲ Click to collapse' : '▼ Click to expand'}</span>
                          </div>
                          <p className='text-sm text-gray-700 font-medium leading-relaxed'>{doctor.education || 'Medical Degree'}</p>
                          
                          {/* Expanded Education Details */}
                          {expandedEducation[doctor._id] && doctor.educationDetails && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className='mt-4 pt-4 border-t border-blue-200 space-y-3'
                            >
                              <div>
                                <p className='text-xs font-semibold text-blue-700 mb-1'>Degree</p>
                                <p className='text-sm text-gray-700'>{doctor.educationDetails.degree}</p>
                              </div>
                              <div>
                                <p className='text-xs font-semibold text-blue-700 mb-1'>University</p>
                                <p className='text-sm text-gray-700'>{doctor.educationDetails.university}</p>
                              </div>
                              <div>
                                <p className='text-xs font-semibold text-blue-700 mb-1'>Year of Graduation</p>
                                <p className='text-sm text-gray-700'>{doctor.educationDetails.year}</p>
                              </div>
                              {doctor.educationDetails.additional && (
                                <div>
                                  <p className='text-xs font-semibold text-blue-700 mb-1'>Additional Training</p>
                                  <p className='text-sm text-gray-700'>{doctor.educationDetails.additional}</p>
                                </div>
                              )}
                              {doctor.educationDetails.certifications && doctor.educationDetails.certifications.length > 0 && (
                                <div>
                                  <p className='text-xs font-semibold text-blue-700 mb-2'>Certifications</p>
                                  <ul className='space-y-1'>
                                    {doctor.educationDetails.certifications.map((cert, idx) => (
                                      <li key={idx} className='text-sm text-gray-700 flex items-start gap-2'>
                                        <CheckCircle className='w-4 h-4 text-green-600 mt-0.5 flex-shrink-0' />
                                        <span>{cert}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
                      {doctor.certificate && (
                        <div className='flex items-center gap-2 text-xs text-blue-600 font-semibold hover:underline'>
                          <BookOpen className='w-4 h-4' />
                          <span>View Certificate</span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    <p className='text-sm text-gray-600 leading-relaxed line-clamp-3'>
                      {doctor.bio || 'Experienced medical professional dedicated to providing excellent patient care.'}
                    </p>

                    {/* Stats */}
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center border border-green-100'>
                        <div className='text-2xl font-bold text-green-600'>{doctor.patients || '2000+'}</div>
                        <div className='text-xs text-gray-600 font-medium'>Patients Treated</div>
                      </div>
                      <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center border border-purple-100'>
                        <div className='text-2xl font-bold text-purple-600'>{doctor.department || 'General'}</div>
                        <div className='text-xs text-gray-600 font-medium'>Department</div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className='space-y-2 pt-2 border-t border-gray-100'>
                      {doctor.email && (
                        <div className='flex items-center gap-2 text-gray-600'>
                          <Mail className='w-4 h-4 text-blue-500' />
                          <span className='text-xs'>{doctor.email}</span>
                        </div>
                      )}
                      {doctor.contact && (
                        <div className='flex items-center gap-2 text-gray-600'>
                          <Phone className='w-4 h-4 text-green-500' />
                          <span className='text-xs font-medium'>{doctor.contact}</span>
                        </div>
                      )}
                    </div>

                    {/* Today's Availability */}
                    {getTodayAvailability(doctor).length > 0 && (
                      <div className='bg-green-50 rounded-xl p-3 border border-green-200'>
                        <div className='flex items-center gap-2 mb-2'>
                          <CheckCircle className='w-4 h-4 text-green-600' />
                          <span className='text-xs font-bold text-green-700'>Available Today</span>
                        </div>
                        <div className='flex flex-wrap gap-1'>
                          {getTodayAvailability(doctor).slice(0, 3).map((slot, i) => (
                            <span key={i} className='text-xs bg-white text-green-700 px-2 py-1 rounded-lg font-medium border border-green-200'>
                              {slot}
                            </span>
                          ))}
                          {getTodayAvailability(doctor).length > 3 && (
                            <span className='text-xs text-green-600 font-semibold'>+{getTodayAvailability(doctor).length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className='grid grid-cols-2 gap-3 pt-2'>
                      <button 
                        onClick={() => handleCheckAvailability(doctor)}
                        className='flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-cyan-200 transition-all font-bold text-sm border-2 border-blue-200 shadow-md'
                      >
                        <Clock className='w-4 h-4' />
                        Availability
                      </button>
                      <button 
                        onClick={() => handleBookAppointment(doctor)}
                        className='flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all font-bold text-sm shadow-lg hover:shadow-xl'
                      >
                        <Calendar className='w-4 h-4' />
                        Appoint
                      </button>
                    </div>
                    
                    {/* View Patients Button */}
                    <button 
                      onClick={() => handleViewPatients(doctor)}
                      className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl hover:from-indigo-200 hover:to-purple-200 transition-all font-bold text-sm border-2 border-indigo-200 shadow-md mt-2'
                    >
                      <User className='w-4 h-4' />
                      View Patient List
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Stats Section */}
          {!loading && filteredDoctors.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className='mt-16 text-center'
            >
              <div className='bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl p-8 shadow-2xl'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                  <div>
                    <div className='text-5xl font-bold mb-2'>{filteredDoctors.length}</div>
                    <div className='text-lg text-blue-100'>Expert Doctors</div>
                  </div>
                  <div>
                    <div className='text-5xl font-bold mb-2'>15+</div>
                    <div className='text-lg text-blue-100'>Specializations</div>
                  </div>
                  <div>
                    <div className='text-5xl font-bold mb-2'>24/7</div>
                    <div className='text-lg text-blue-100'>Emergency Care</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
      </div>

        {/* Availability Modal */}
        {showAvailability && selectedDoctor && (
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto'
            >
              {/* Modal Header */}
              <div className='bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-3xl relative'>
                <button 
                  onClick={() => setShowAvailability(false)}
                  className='absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition'
                >
                  <X className='w-6 h-6' />
                </button>
                <div className='flex items-center gap-4'>
                  <img 
                    src={selectedDoctor.image} 
                    alt={selectedDoctor.name}
                    className='w-20 h-20 rounded-2xl object-cover border-4 border-white/30'
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&size=200&background=0D8ABC&color=fff&bold=true`
                    }}
                  />
                  <div>
                    <h2 className='text-3xl font-bold mb-1'>{selectedDoctor.name}</h2>
                    <p className='text-cyan-100 text-lg'>{selectedDoctor.specialization}</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className='p-6'>
                {/* Patient Information Display */}
                <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 mb-6 border-2 border-green-200'>
                  <h3 className='text-lg font-bold text-gray-800 mb-3 flex items-center gap-2'>
                    <User className='w-5 h-5 text-green-600' />
                    Your Information
                  </h3>
                  <div className='space-y-2 text-sm'>
                    <p className='text-gray-700'>
                      <span className='font-semibold'>Patient Name:</span> 
                      <span className='ml-2 text-gray-900'>{bookingData.patientName || 'Not provided'}</span>
                    </p>
                    <p className='text-gray-700'>
                      <span className='font-semibold'>Problem:</span> 
                      <span className='ml-2 text-gray-900'>{bookingData.problem || 'Not provided'}</span>
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3 mb-6'>
                  <Clock className='w-6 h-6 text-blue-600' />
                  <h3 className='text-2xl font-bold text-gray-800'>Doctor's Weekly Availability</h3>
                </div>

                <div className='space-y-4 max-h-96 overflow-y-auto'>
                  {selectedDoctor.availability && Object.entries(selectedDoctor.availability).map(([day, slots]) => (
                    <div key={day} className='border-2 border-gray-100 rounded-2xl p-4 hover:border-blue-200 transition'>
                      <div className='flex items-center justify-between mb-3'>
                        <h4 className='text-lg font-bold text-gray-800 capitalize'>{day}</h4>
                        {slots.length > 0 ? (
                          <span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1'>
                            <CheckCircle className='w-3 h-3' />
                            Available
                          </span>
                        ) : (
                          <span className='bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold'>
                            Not Available
                          </span>
                        )}
                      </div>
                      {slots.length > 0 ? (
                        <div className='flex flex-wrap gap-2'>
                          {slots.map((slot, idx) => (
                            <button
                              key={idx}
                              onClick={() => setBookingData({...bookingData, preferredTime: `${day} - ${slot}`})}
                              className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                                bookingData.preferredTime === `${day} - ${slot}`
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                  : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className='text-gray-400 text-sm'>No slots available</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected Time Display */}
                {bookingData.preferredTime && (
                  <div className='mt-6 bg-green-50 rounded-xl p-4 border-2 border-green-200'>
                    <p className='text-green-800 font-semibold flex items-center gap-2'>
                      <CheckCircle className='w-5 h-5' />
                      Selected Time: {bookingData.preferredTime}
                    </p>
                  </div>
                )}

                {/* Confirm Booking Button */}
                <button
                  onClick={handleBookingSubmit}
                  disabled={!bookingData.preferredTime}
                  className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all font-bold text-lg shadow-lg ${
                    bookingData.preferredTime
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Calendar className='w-6 h-6' />
                  {bookingData.preferredTime ? 'Appoint' : 'Select a Time Slot'}
                </button>

                <p className='text-center text-sm text-gray-500 mt-4'>
                  ✅ Doctor is available! Select a time slot and click "Appoint" to proceed
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && selectedDoctor && (
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='bg-white rounded-3xl shadow-2xl max-w-2xl w-full'
            >
              {/* Modal Header */}
              <div className='bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-3xl relative'>
                <button 
                  onClick={() => setShowBookingForm(false)}
                  className='absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition'
                >
                  <X className='w-6 h-6' />
                </button>
                <div className='flex items-center gap-4'>
                  <img 
                    src={selectedDoctor.image} 
                    alt={selectedDoctor.name}
                    className='w-20 h-20 rounded-2xl object-cover border-4 border-white/30'
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&size=200&background=0D8ABC&color=fff&bold=true`
                    }}
                  />
                  <div>
                    <h2 className='text-3xl font-bold mb-1'>Book Appointment</h2>
                    <p className='text-green-100 text-lg'>with {selectedDoctor.name}</p>
                  </div>
                </div>
              </div>

              {/* Modal Content - Booking Form */}
              <div className='p-6'>
                <div className='space-y-5'>
                  {/* Patient Name */}
                  <div>
                    <label className='flex items-center gap-2 text-gray-700 font-semibold mb-2'>
                      <User className='w-5 h-5 text-blue-600' />
                      Your Name
                    </label>
                    <input
                      type='text'
                      value={bookingData.patientName}
                      onChange={(e) => setBookingData({...bookingData, patientName: e.target.value})}
                      placeholder='Enter your full name'
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all'
                    />
                  </div>

                  {/* Problem/Concern */}
                  <div>
                    <label className='flex items-center gap-2 text-gray-700 font-semibold mb-2'>
                      <FileText className='w-5 h-5 text-blue-600' />
                      What problem are you facing?
                    </label>
                    <textarea
                      value={bookingData.problem}
                      onChange={(e) => setBookingData({...bookingData, problem: e.target.value})}
                      placeholder='Describe your symptoms or concerns in detail...'
                      rows='3'
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none'
                    />
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className='flex items-center gap-2 text-gray-700 font-semibold mb-2'>
                      <Calendar className='w-5 h-5 text-blue-600' />
                      Select Appointment Date
                    </label>
                    <input
                      type='date'
                      value={bookingData.selectedDate}
                      onChange={(e) => setBookingData({...bookingData, selectedDate: e.target.value, selectedTimeSlot: ''})}
                      min={new Date().toISOString().split('T')[0]}
                      max={new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]}
                      className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg font-medium'
                    />
                    <p className='text-xs text-gray-500 mt-1'>You can book up to 30 days in advance</p>
                  </div>

                  {/* Time Slot Selection */}
                  {bookingData.selectedDate && (
                    <div>
                      <label className='flex items-center gap-2 text-gray-700 font-semibold mb-2'>
                        <Clock className='w-5 h-5 text-blue-600' />
                        Select Time Slot
                      </label>
                      <select
                        value={bookingData.selectedTimeSlot}
                        onChange={(e) => setBookingData({...bookingData, selectedTimeSlot: e.target.value})}
                        className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg font-medium'
                      >
                        <option value=''>-- Select a time slot --</option>
                        <option value='08:00 AM'>08:00 AM</option>
                        <option value='08:30 AM'>08:30 AM</option>
                        <option value='09:00 AM'>09:00 AM</option>
                        <option value='09:30 AM'>09:30 AM</option>
                        <option value='10:00 AM'>10:00 AM</option>
                        <option value='10:30 AM'>10:30 AM</option>
                        <option value='11:00 AM'>11:00 AM</option>
                        <option value='11:30 AM'>11:30 AM</option>
                        <option value='12:00 PM'>12:00 PM</option>
                        <option value='01:00 PM'>01:00 PM</option>
                        <option value='02:00 PM'>02:00 PM</option>
                        <option value='02:30 PM'>02:30 PM</option>
                        <option value='03:00 PM'>03:00 PM</option>
                        <option value='03:30 PM'>03:30 PM</option>
                        <option value='04:00 PM'>04:00 PM</option>
                        <option value='04:30 PM'>04:30 PM</option>
                        <option value='05:00 PM'>05:00 PM</option>
                      </select>
                    </div>
                  )}

                  {/* Doctor Info Summary */}
                  <div className='bg-blue-50 rounded-xl p-4 border-2 border-blue-100'>
                    <h4 className='font-bold text-gray-800 mb-2 flex items-center gap-2'>
                      <Stethoscope className='w-5 h-5 text-blue-600' />
                      Doctor Information
                    </h4>
                    <div className='space-y-1 text-sm text-gray-700'>
                      <p><span className='font-semibold'>Specialization:</span> {selectedDoctor.specialization}</p>
                      <p><span className='font-semibold'>Department:</span> {selectedDoctor.department}</p>
                      <p><span className='font-semibold'>Experience:</span> {selectedDoctor.experience}</p>
                    </div>
                  </div>

                  {/* Availability Result */}
                  {availabilityResult && (
                    <div className={`rounded-xl p-5 border-2 ${
                      availabilityResult.available 
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <div className='flex items-start gap-3'>
                        {availabilityResult.available ? (
                          <CheckCircle className='w-6 h-6 text-green-600 flex-shrink-0 mt-1' />
                        ) : (
                          <X className='w-6 h-6 text-red-600 flex-shrink-0 mt-1' />
                        )}
                        <div className='flex-1'>
                          <h4 className={`font-bold text-lg mb-2 ${
                            availabilityResult.available ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {availabilityResult.available ? '✅ Doctor is Available!' : '❌ Doctor Not Available'}
                          </h4>
                          <p className={`text-sm mb-3 ${
                            availabilityResult.available ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {availabilityResult.message}
                          </p>

                          {/* Detailed conflict message */}
                          {!availabilityResult.available && availabilityResult.detailedMessage && (
                            <div className='mb-3 bg-orange-100 border-2 border-orange-300 rounded-lg p-3'>
                              <p className='text-orange-800 font-bold text-sm'>
                                ⚠️ {availabilityResult.detailedMessage}
                              </p>
                            </div>
                          )}

                          {!availabilityResult.available && availabilityResult.alternativeSlots && availabilityResult.alternativeSlots.length > 0 && (
                            <div className='mt-3'>
                              <p className='text-sm font-semibold text-red-800 mb-2'>✅ Available time slots for rescheduling:</p>
                              <div className='flex flex-wrap gap-2'>
                                {availabilityResult.alternativeSlots.map((slot, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setBookingData({...bookingData, selectedTimeSlot: slot})
                                      setAvailabilityResult(null)
                                    }}
                                    className='px-3 py-2 bg-green-100 border-2 border-green-300 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200 transition-all'
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                              <p className='text-xs text-gray-600 mt-2'>👆 Click any slot to reschedule</p>
                            </div>
                          )}

                          {!availabilityResult.available && availabilityResult.alternativeSlots && availabilityResult.alternativeSlots.length === 0 && (
                            <div className='mt-3 bg-red-100 border-2 border-red-300 rounded-lg p-3'>
                              <p className='text-red-800 font-bold text-sm'>
                                ❌ All time slots are fully booked for this date. Please select a different day.
                              </p>
                            </div>
                          )}

                          {!availabilityResult.available && availabilityResult.suggestedDays && availabilityResult.suggestedDays.length > 0 && (
                            <div className='mt-3'>
                              <p className='text-sm font-semibold text-red-800 mb-2'>Doctor works on these days:</p>
                              <div className='flex flex-wrap gap-2'>
                                {availabilityResult.suggestedDays.map((day, idx) => (
                                  <span key={idx} className='px-3 py-1 bg-white border-2 border-red-200 text-red-700 rounded-lg text-sm font-medium capitalize'>
                                    {day}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {!availabilityResult.available && availabilityResult.availableSlots && availabilityResult.availableSlots.length > 0 && (
                            <div className='mt-3'>
                              <p className='text-sm font-semibold text-red-800 mb-2'>Available time slots for this day:</p>
                              <div className='flex flex-wrap gap-2'>
                                {availabilityResult.availableSlots.map((slot, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setBookingData({...bookingData, selectedTimeSlot: slot})}
                                    className='px-3 py-1 bg-white border-2 border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-all'
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {availabilityResult.available && (
                        <button
                          onClick={() => {
                            // Navigate to appointment with all details
                            const newPatient = {
                              id: Date.now(),
                              patientName: bookingData.patientName,
                              age: 0,
                              problem: bookingData.problem,
                              appointmentDate: bookingData.selectedDate,
                              appointmentTime: bookingData.selectedTimeSlot,
                              status: 'pending'
                            }
                            
                            const allAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '{}')
                            const doctorAppointments = allAppointments[selectedDoctor._id] || []
                            doctorAppointments.push(newPatient)
                            allAppointments[selectedDoctor._id] = doctorAppointments
                            localStorage.setItem('doctorAppointments', JSON.stringify(allAppointments))

                            navigate('/appointment', { 
                              state: { 
                                selectedDoctor: selectedDoctor,
                                patientName: bookingData.patientName,
                                problem: bookingData.problem,
                                appointmentDate: bookingData.selectedDate,
                                appointmentTime: bookingData.selectedTimeSlot
                              } 
                            })
                          }}
                          className='w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold shadow-lg'
                        >
                          <Calendar className='w-5 h-5' />
                          Proceed to Book Appointment
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Check Availability Button */}
                <button
                  onClick={checkDoctorAvailability}
                  disabled={!bookingData.patientName || !bookingData.problem || !bookingData.selectedDate || !bookingData.selectedTimeSlot || checkingAvailability}
                  className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all font-bold text-lg shadow-lg ${
                    bookingData.patientName && bookingData.problem && bookingData.selectedDate && bookingData.selectedTimeSlot && !checkingAvailability
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {checkingAvailability ? (
                    <>
                      <div className='w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin'></div>
                      Checking Availability...
                    </>
                  ) : (
                    <>
                      <Clock className='w-6 h-6' />
                      Check Doctor Availability
                    </>
                  )}
                </button>

                <p className='text-center text-sm text-gray-500 mt-4'>
                  Fill all fields to check if the doctor is available on your preferred date & time
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Patient List Modal */}
        {showPatientList && selectedDoctor && (
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col'
            >
              {/* Modal Header */}
              <div className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl relative flex-shrink-0'>
                <button 
                  onClick={() => setShowPatientList(false)}
                  className='absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition'
                >
                  <X className='w-6 h-6' />
                </button>
                <div className='flex items-center gap-4'>
                  <img 
                    src={selectedDoctor.image} 
                    alt={selectedDoctor.name}
                    className='w-20 h-20 rounded-2xl object-cover border-4 border-white/30'
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&size=200&background=0D8ABC&color=fff&bold=true`
                    }}
                  />
                  <div>
                    <h2 className='text-3xl font-bold mb-1'>Patient List</h2>
                    <p className='text-indigo-100 text-lg'>{selectedDoctor.name} - {selectedDoctor.specialization}</p>
                    <p className='text-indigo-200 text-sm mt-1'>Total Appointments: {patientsList.length}</p>
                  </div>
                </div>
              </div>

              {/* Modal Content - Patient List */}
              <div className='p-6 overflow-y-auto flex-1'>
                {patientsList.length === 0 ? (
                  <div className='text-center py-12'>
                    <User className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                    <p className='text-gray-500 text-lg'>No appointments yet</p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {/* Summary Stats */}
                    <div className='grid grid-cols-2 gap-4 mb-6'>
                      <div className='bg-green-50 rounded-xl p-4 border-2 border-green-200'>
                        <div className='text-3xl font-bold text-green-600'>
                          {patientsList.filter(p => p.status === 'checked-up').length}
                        </div>
                        <div className='text-sm text-gray-600 font-medium'>Checked Up</div>
                      </div>
                      <div className='bg-orange-50 rounded-xl p-4 border-2 border-orange-200'>
                        <div className='text-3xl font-bold text-orange-600'>
                          {patientsList.filter(p => p.status === 'pending').length}
                        </div>
                        <div className='text-sm text-gray-600 font-medium'>Pending</div>
                      </div>
                    </div>

                    {/* Patient Cards */}
                    {patientsList.map((patient) => (
                      <div 
                        key={patient.id}
                        className={`border-2 rounded-2xl p-5 transition-all hover:shadow-lg ${
                          patient.status === 'checked-up' 
                            ? 'bg-green-50 border-green-300' 
                            : 'bg-orange-50 border-orange-300'
                        }`}
                      >
                        <div className='flex items-start justify-between gap-4'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-3'>
                              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                                {patient.patientName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className='text-xl font-bold text-gray-800'>{patient.patientName}</h3>
                                <p className='text-sm text-gray-600'>Age: {patient.age} years</p>
                              </div>
                            </div>

                            <div className='space-y-2 mb-4'>
                              <div className='flex items-start gap-2'>
                                <FileText className='w-4 h-4 text-gray-500 mt-1 flex-shrink-0' />
                                <div>
                                  <span className='text-xs font-semibold text-gray-600'>Problem:</span>
                                  <p className='text-sm text-gray-800'>{patient.problem}</p>
                                </div>
                              </div>
                              
                              <div className='flex items-center gap-4 text-sm'>
                                <div className='flex items-center gap-2'>
                                  <Calendar className='w-4 h-4 text-blue-600' />
                                  <span className='font-medium'>{new Date(patient.appointmentDate).toLocaleDateString()}</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <Clock className='w-4 h-4 text-purple-600' />
                                  <span className='font-medium'>{patient.appointmentTime}</span>
                                </div>
                              </div>

                              {patient.status === 'checked-up' && patient.checkedUpDate && (
                                <div className='flex items-center gap-2 text-xs text-green-700'>
                                  <CheckCircle className='w-4 h-4' />
                                  <span>Checked up on {new Date(patient.checkedUpDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className='flex flex-col items-end gap-3'>
                            {/* Status Badge */}
                            <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                              patient.status === 'checked-up'
                                ? 'bg-green-600 text-white'
                                : 'bg-orange-600 text-white'
                            }`}>
                              {patient.status === 'checked-up' ? '✓ Checked Up' : '⏳ Pending'}
                            </span>

                            {/* Toggle Status Button */}
                            <button
                              onClick={() => togglePatientStatus(patient.id)}
                              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                                patient.status === 'pending'
                                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              }`}
                            >
                              {patient.status === 'pending' ? 'Mark as Checked Up' : 'Mark as Pending'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
    </div>
  )
}
