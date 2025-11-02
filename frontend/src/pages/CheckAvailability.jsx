import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import { 
  Calendar, Clock, User, FileText, Stethoscope, 
  CheckCircle, X, AlertCircle, ArrowRight, RefreshCw 
} from 'lucide-react'

export default function CheckAvailability() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  
  const [formData, setFormData] = useState({
    patientName: '',
    problem: '',
    problemCategory: '',
    selectedDoctor: '',
    appointmentDate: '',
    appointmentTime: ''
  })
  
  const [availabilityResult, setAvailabilityResult] = useState(null)

  // Problem categories mapped to specializations
  const problemCategories = [
    { value: 'heart', label: 'Heart Related Issues', specialization: 'Cardiologist' },
    { value: 'brain', label: 'Brain & Nervous System', specialization: 'Neurologist' },
    { value: 'children', label: 'Children Health', specialization: 'Pediatrician' },
    { value: 'bones', label: 'Bones & Joints', specialization: 'Orthopedic Surgeon' },
    { value: 'skin', label: 'Skin Problems', specialization: 'Dermatologist' },
    { value: 'surgery', label: 'Surgery Required', specialization: 'General Surgeon' },
    { value: 'women', label: 'Women Health', specialization: 'Gynecologist' },
    { value: 'mental', label: 'Mental Health', specialization: 'Psychiatrist' },
    { value: 'eye', label: 'Eye Problems', specialization: 'Ophthalmologist' },
    { value: 'ent', label: 'Ear, Nose & Throat', specialization: 'ENT Specialist' },
    { value: 'general', label: 'General Health Issues', specialization: 'General Physician' }
  ]

  // Sample doctors data (same as Doctors page)
  const sampleDoctors = [
    {
      _id: '1',
      name: 'Dr. Asha Rao',
      specialization: 'Cardiologist',
      department: 'Cardiology',
      experience: '15 years',
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
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
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
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
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
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
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
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
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
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
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
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
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
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
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
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
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
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
      image: 'https://i.pinimg.com/736x/db/0e/3c/db0e3cecc65f6edeb2314f47c23d6027.jpg',
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
    API.get('/doctors')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setDoctors(res.data)
        } else {
          setDoctors(sampleDoctors)
        }
        setLoading(false)
      })
      .catch(() => {
        setDoctors(sampleDoctors)
        setLoading(false)
      })
  }, [])

  // Filter doctors based on problem category
  const filteredDoctors = formData.problemCategory
    ? doctors.filter(doc => {
        const category = problemCategories.find(c => c.value === formData.problemCategory)
        return doc.specialization === category?.specialization
      })
    : doctors

  // Check doctor availability
  const checkAvailability = () => {
    if (!formData.patientName || !formData.problem || !formData.selectedDoctor || 
        !formData.appointmentDate || !formData.appointmentTime) {
      alert('Please fill all fields')
      return
    }

    setCheckingAvailability(true)
    const selectedDoc = doctors.find(d => d._id === formData.selectedDoctor)
    
    // Get day of week
    const dateObj = new Date(formData.appointmentDate)
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = days[dateObj.getDay()]
    
    // Simulate checking delay
    setTimeout(() => {
      // Check if doctor works on this day
      const doctorSlotsForDay = selectedDoc.availability?.[dayName] || []
      
      if (doctorSlotsForDay.length === 0) {
        setAvailabilityResult({
          available: false,
          type: 'day-off',
          doctor: selectedDoc,
          message: `Dr. ${selectedDoc.name} does not work on ${dayName}s.`,
          suggestion: 'Please select another day from the doctor\'s working schedule.',
          workingDays: Object.keys(selectedDoc.availability || {})
            .filter(day => selectedDoc.availability[day].length > 0)
            .map(day => day.charAt(0).toUpperCase() + day.slice(1))
        })
        setCheckingAvailability(false)
        return
      }

      // Check if selected time is in doctor's schedule
      if (!doctorSlotsForDay.includes(formData.appointmentTime)) {
        setAvailabilityResult({
          available: false,
          type: 'wrong-time',
          doctor: selectedDoc,
          message: `Dr. ${selectedDoc.name} is not available at ${formData.appointmentTime} on ${dayName}s.`,
          suggestion: 'Please select one of the available time slots below:',
          availableSlots: doctorSlotsForDay
        })
        setCheckingAvailability(false)
        return
      }

      // Check for conflicting appointments from ALL sources
      const allAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '{}')
      const doctorAppointments = allAppointments[selectedDoc._id] || []
      
      // Also check appointments from the main appointments list
      const mainAppointments = JSON.parse(localStorage.getItem('appointments') || '[]')
      
      // Combine all appointments for this doctor
      const combinedAppointments = [
        ...doctorAppointments,
        ...mainAppointments.filter(apt => 
          apt.doctorId === selectedDoc._id || 
          apt.doctor === selectedDoc.name ||
          apt.doctorName === selectedDoc.name
        )
      ]
      
      console.log('Checking appointments for doctor:', selectedDoc.name)
      console.log('Doctor ID:', selectedDoc._id)
      console.log('Selected Date:', formData.appointmentDate)
      console.log('Selected Time:', formData.appointmentTime)
      console.log('All appointments for this doctor:', combinedAppointments)
      
      const conflict = combinedAppointments.find(apt => {
        const isSameDate = apt.appointmentDate === formData.appointmentDate || apt.date === formData.appointmentDate
        const isSameTime = apt.appointmentTime === formData.appointmentTime || apt.time === formData.appointmentTime
        const isPending = apt.status === 'pending' || apt.status === 'scheduled' || !apt.status
        
        console.log('Checking appointment:', apt)
        console.log('Same date?', isSameDate, 'Same time?', isSameTime, 'Pending?', isPending)
        
        return isSameDate && isSameTime && isPending
      })

      if (conflict) {
        console.log('CONFLICT FOUND:', conflict)
        
        const alternativeSlots = doctorSlotsForDay.filter(slot => 
          !combinedAppointments.some(apt => {
            const isSameDate = apt.appointmentDate === formData.appointmentDate || apt.date === formData.appointmentDate
            const isSameTime = apt.appointmentTime === slot || apt.time === slot
            const isPending = apt.status === 'pending' || apt.status === 'scheduled' || !apt.status
            return isSameDate && isSameTime && isPending
          })
        )

        setAvailabilityResult({
          available: false,
          type: 'busy',
          doctor: selectedDoc,
          message: `❌ Sorry! Dr. ${selectedDoc.name} is BUSY at ${formData.appointmentTime} on ${new Date(formData.appointmentDate).toLocaleDateString()}.`,
          suggestion: alternativeSlots.length > 0 
            ? `Another patient "${conflict.patientName || conflict.patient || 'Someone'}" already has an appointment at this time. Please reschedule by selecting one of these available time slots:`
            : `All time slots are fully booked for ${new Date(formData.appointmentDate).toLocaleDateString()}. Please select a different day.`,
          availableSlots: alternativeSlots,
          conflictWith: conflict.patientName || conflict.patient || 'Another patient',
          bookedSlots: combinedAppointments
            .filter(apt => (apt.appointmentDate === formData.appointmentDate || apt.date === formData.appointmentDate) && 
                           (apt.status === 'pending' || apt.status === 'scheduled' || !apt.status))
            .map(apt => apt.appointmentTime || apt.time)
        })
        setCheckingAvailability(false)
        return
      }
      
      console.log('NO CONFLICT - Doctor is available!')

      // Doctor is available!
      setAvailabilityResult({
        available: true,
        type: 'success',
        doctor: selectedDoc,
        message: `Great news! Dr. ${selectedDoc.name} is available!`,
        confirmedDate: formData.appointmentDate,
        confirmedTime: formData.appointmentTime
      })
      setCheckingAvailability(false)
    }, 2000)
  }

  // Book appointment
  const proceedToBooking = () => {
    const selectedDoc = doctors.find(d => d._id === formData.selectedDoctor)
    
    // Save appointment
    const newAppointment = {
      id: Date.now(),
      patientName: formData.patientName,
      age: 0,
      problem: formData.problem,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      status: 'pending'
    }
    
    const allAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '{}')
    const doctorAppointments = allAppointments[selectedDoc._id] || []
    doctorAppointments.push(newAppointment)
    allAppointments[selectedDoc._id] = doctorAppointments
    localStorage.setItem('doctorAppointments', JSON.stringify(allAppointments))

    // Create notification
    const notification = {
      id: Date.now(),
      title: 'Appointment Confirmed',
      message: `Appointment booked with Dr. ${selectedDoc.name} on ${new Date(formData.appointmentDate).toLocaleDateString()} at ${formData.appointmentTime}`,
      timestamp: new Date().toISOString(),
      read: false
    }
    window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }))

    alert(`✅ Appointment Confirmed!\n\nPatient: ${formData.patientName}\nDoctor: Dr. ${selectedDoc.name}\nDate: ${new Date(formData.appointmentDate).toLocaleDateString()}\nTime: ${formData.appointmentTime}`)
    
    navigate('/appointment', { 
      state: { 
        selectedDoctor: selectedDoc,
        patientName: formData.patientName,
        problem: formData.problem,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime
      } 
    })
  }

  const resetForm = () => {
    setFormData({
      patientName: '',
      problem: '',
      problemCategory: '',
      selectedDoctor: '',
      appointmentDate: '',
      appointmentTime: ''
    })
    setAvailabilityResult(null)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12'>
      <div className='max-w-4xl mx-auto px-4'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-8'
        >
          <div className='inline-block p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl mb-4 shadow-xl'>
            <Stethoscope className='w-12 h-12 text-white' />
          </div>
          <h1 className='text-5xl font-extrabold text-gray-800 mb-3'>
            Check Doctor Availability
          </h1>
          <p className='text-xl text-gray-600'>
            Find the perfect time for your appointment
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='bg-white rounded-3xl shadow-2xl p-8 mb-6'
        >
          <div className='space-y-6'>
            {/* Patient Name */}
            <div>
              <label className='flex items-center gap-2 text-gray-700 font-bold mb-3 text-lg'>
                <User className='w-6 h-6 text-blue-600' />
                Patient Name
              </label>
              <input
                type='text'
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                placeholder='Enter your full name'
                className='w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg'
              />
            </div>

            {/* Problem Category */}
            <div>
              <label className='flex items-center gap-2 text-gray-700 font-bold mb-3 text-lg'>
                <AlertCircle className='w-6 h-6 text-blue-600' />
                What type of problem are you facing?
              </label>
              <select
                value={formData.problemCategory}
                onChange={(e) => setFormData({...formData, problemCategory: e.target.value, selectedDoctor: ''})}
                className='w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg font-medium'
              >
                <option value=''>-- Select Problem Category --</option>
                {problemCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Problem Description */}
            <div>
              <label className='flex items-center gap-2 text-gray-700 font-bold mb-3 text-lg'>
                <FileText className='w-6 h-6 text-blue-600' />
                Describe Your Problem
              </label>
              <textarea
                value={formData.problem}
                onChange={(e) => setFormData({...formData, problem: e.target.value})}
                placeholder='Please describe your symptoms and concerns in detail...'
                rows='4'
                className='w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg resize-none'
              />
            </div>

            {/* Doctor Selection */}
            {formData.problemCategory && (
              <div>
                <label className='flex items-center gap-2 text-gray-700 font-bold mb-3 text-lg'>
                  <Stethoscope className='w-6 h-6 text-blue-600' />
                  Select Expert Doctor
                </label>
                <select
                  value={formData.selectedDoctor}
                  onChange={(e) => setFormData({...formData, selectedDoctor: e.target.value})}
                  className='w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg font-medium'
                >
                  <option value=''>-- Select Doctor --</option>
                  {filteredDoctors.map(doc => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name} - {doc.specialization} ({doc.experience})
                    </option>
                  ))}
                </select>
                <p className='text-sm text-gray-500 mt-2'>
                  Showing {filteredDoctors.length} expert doctor(s) for your problem
                </p>
              </div>
            )}

            {/* Date Selection */}
            {formData.selectedDoctor && (
              <div>
                <label className='flex items-center gap-2 text-gray-700 font-bold mb-3 text-lg'>
                  <Calendar className='w-6 h-6 text-blue-600' />
                  Select Appointment Date
                </label>
                <input
                  type='date'
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]}
                  className='w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg font-medium'
                />
                <p className='text-sm text-gray-500 mt-2'>
                  You can book appointments up to 30 days in advance
                </p>
              </div>
            )}

            {/* Time Selection */}
            {formData.appointmentDate && (
              <div>
                <label className='flex items-center gap-2 text-gray-700 font-bold mb-3 text-lg'>
                  <Clock className='w-6 h-6 text-blue-600' />
                  Select Appointment Time
                </label>
                <select
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                  className='w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg font-medium'
                >
                  <option value=''>-- Select Time Slot --</option>
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
          </div>

          {/* Check Availability Button */}
          <button
            onClick={checkAvailability}
            disabled={!formData.patientName || !formData.problem || !formData.selectedDoctor || 
                     !formData.appointmentDate || !formData.appointmentTime || checkingAvailability}
            className={`w-full mt-8 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl transition-all font-bold text-xl shadow-lg ${
              formData.patientName && formData.problem && formData.selectedDoctor && 
              formData.appointmentDate && formData.appointmentTime && !checkingAvailability
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {checkingAvailability ? (
              <>
                <div className='w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin'></div>
                Checking Availability...
              </>
            ) : (
              <>
                <CheckCircle className='w-7 h-7' />
                Check Doctor Availability
              </>
            )}
          </button>
        </motion.div>

        {/* Availability Result */}
        {availabilityResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-3xl shadow-2xl p-8 border-4 ${
              availabilityResult.available
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'
                : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-400'
            }`}
          >
            {/* Result Header */}
            <div className='flex items-start gap-4 mb-6'>
              {availabilityResult.available ? (
                <div className='w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0'>
                  <CheckCircle className='w-10 h-10 text-white' />
                </div>
              ) : (
                <div className='w-16 h-16 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0'>
                  <X className='w-10 h-10 text-white' />
                </div>
              )}
              <div className='flex-1'>
                <h2 className={`text-3xl font-extrabold mb-2 ${
                  availabilityResult.available ? 'text-green-800' : 'text-red-800'
                }`}>
                  {availabilityResult.available ? '✅ Doctor is Available!' : '❌ Doctor Not Available'}
                </h2>
                <p className={`text-lg ${
                  availabilityResult.available ? 'text-green-700' : 'text-red-700'
                }`}>
                  {availabilityResult.message}
                </p>
              </div>
            </div>

            {/* Doctor Info */}
            <div className='bg-white rounded-2xl p-5 mb-6 border-2 border-gray-200'>
              <div className='flex items-center gap-4'>
                <img
                  src={availabilityResult.doctor.image}
                  alt={availabilityResult.doctor.name}
                  className='w-20 h-20 rounded-xl object-cover border-4 border-blue-200'
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(availabilityResult.doctor.name)}&size=200&background=0D8ABC&color=fff&bold=true`
                  }}
                />
                <div>
                  <h3 className='text-xl font-bold text-gray-800'>{availabilityResult.doctor.name}</h3>
                  <p className='text-blue-600 font-semibold'>{availabilityResult.doctor.specialization}</p>
                  <p className='text-gray-600 text-sm'>{availabilityResult.doctor.experience} experience</p>
                </div>
              </div>
            </div>

            {/* Success - Appointment Details */}
            {availabilityResult.available && (
              <div className='space-y-4'>
                <div className='bg-white rounded-xl p-5 border-2 border-green-300'>
                  <h4 className='font-bold text-green-800 mb-3 text-lg flex items-center gap-2'>
                    <Calendar className='w-5 h-5' />
                    Confirmed Appointment Details
                  </h4>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <span className='text-gray-600 font-semibold'>Date:</span>
                      <p className='text-gray-800 font-bold text-lg'>
                        {new Date(availabilityResult.confirmedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <span className='text-gray-600 font-semibold'>Time:</span>
                      <p className='text-gray-800 font-bold text-lg'>{availabilityResult.confirmedTime}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={proceedToBooking}
                  className='w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold text-xl shadow-lg hover:shadow-xl hover:-translate-y-1'
                >
                  <ArrowRight className='w-7 h-7' />
                  Proceed to Book Appointment
                </button>
              </div>
            )}

            {/* Not Available - Suggestions */}
            {!availabilityResult.available && (
              <div className='space-y-4'>
                <div className='bg-white rounded-xl p-5 border-2 border-red-300'>
                  <h4 className='font-bold text-red-800 mb-3 text-lg flex items-center gap-2'>
                    <AlertCircle className='w-5 h-5' />
                    {availabilityResult.suggestion}
                  </h4>

                  {/* Working Days */}
                  {availabilityResult.workingDays && availabilityResult.workingDays.length > 0 && (
                    <div className='mt-4'>
                      <p className='text-sm font-semibold text-gray-700 mb-2'>Doctor works on these days:</p>
                      <div className='flex flex-wrap gap-2'>
                        {availabilityResult.workingDays.map((day, idx) => (
                          <span key={idx} className='px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold border-2 border-red-300'>
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Time Slots */}
                  {availabilityResult.availableSlots && availabilityResult.availableSlots.length > 0 && (
                    <div className='mt-4'>
                      <p className='text-sm font-semibold text-gray-700 mb-2'>✅ Available time slots for reschedule:</p>
                      <div className='grid grid-cols-3 gap-2'>
                        {availabilityResult.availableSlots.map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setFormData({...formData, appointmentTime: slot})
                              setAvailabilityResult(null)
                            }}
                            className='px-4 py-3 bg-green-100 text-green-700 rounded-lg font-semibold border-2 border-green-300 hover:bg-green-200 transition-all'
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show booked slots if doctor is busy */}
                  {availabilityResult.type === 'busy' && availabilityResult.bookedSlots && availabilityResult.bookedSlots.length > 0 && (
                    <div className='mt-4 bg-red-50 rounded-lg p-3 border border-red-200'>
                      <p className='text-sm font-semibold text-red-700 mb-2'>❌ Already booked time slots on this date:</p>
                      <div className='flex flex-wrap gap-2'>
                        {availabilityResult.bookedSlots.map((slot, idx) => (
                          <span key={idx} className='px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-bold'>
                            {slot} (BUSY)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conflict message */}
                  {availabilityResult.conflictWith && (
                    <div className='mt-4 bg-orange-50 rounded-lg p-4 border-2 border-orange-300'>
                      <p className='text-orange-800 font-bold text-sm'>
                        ⚠️ <span className='text-red-700'>{availabilityResult.conflictWith}</span> has already booked this time slot.
                        Please reschedule to an available time.
                      </p>
                    </div>
                  )}

                  {availabilityResult.availableSlots && availabilityResult.availableSlots.length === 0 && (
                    <p className='text-red-600 font-semibold mt-3'>
                      All slots are booked for this date. Please select a different day.
                    </p>
                  )}
                </div>

                <button
                  onClick={resetForm}
                  className='w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all font-bold text-xl shadow-lg hover:shadow-xl'
                >
                  <RefreshCw className='w-7 h-7' />
                  Try Different Date/Time
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
