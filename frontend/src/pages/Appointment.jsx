import React, { useEffect, useState } from 'react'
import API from '../api'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Stethoscope, CheckCircle, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Appointment(){
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [patientName, setPatientName] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [patientGender, setPatientGender] = useState('male')
  const [patientContact, setPatientContact] = useState('')
  const [patientProblem, setPatientProblem] = useState('')
  const [patientId, setPatientId] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(()=>{
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/appointment')
      alert('Please login to book an appointment')
      navigate('/login')
      return
    }
    
    API.setToken(token)
    
    API.get('/doctors').then(res=>{
      setDoctors(res.data)
      // Don't auto-select, let user choose
    }).catch((err)=>{
      console.error('Error fetching doctors:', err)
      setError('Failed to load doctors. Please refresh the page.')
    })
  },[navigate])

  const handleCreatePatient = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const res = await API.post('/patients', {
        name: patientName,
        age: parseInt(patientAge),
        gender: patientGender,
        contact: patientContact
      })
      setPatientId(res.data._id)
      setStep(2)
      setMsg('Patient registered successfully!')
    } catch(e) {
      setError('Failed to register patient. Please try again.')
    }
    setLoading(false)
  }

  const handleBookAppointment = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    
    // STEP 1: Check doctor availability BEFORE booking
    console.log('🔍 Checking doctor availability...')
    console.log('Selected Doctor ID:', doctorId)
    console.log('Selected Date:', date)
    console.log('Selected Time:', time)
    
    const selectedDoctor = doctors.find(d => d._id === doctorId)
    if (!selectedDoctor) {
      setError('Please select a doctor')
      return
    }
    
    // Get all existing appointments from localStorage
    const allAppointments = JSON.parse(localStorage.getItem('doctorAppointments') || '{}')
    const doctorAppointments = allAppointments[doctorId] || []
    
    // Also check main appointments list for compatibility
    const mainAppointments = JSON.parse(localStorage.getItem('appointments') || '[]')
    
    // Combine all appointments for this doctor
    const combinedAppointments = [
      ...doctorAppointments,
      ...mainAppointments.filter(apt => 
        apt.doctorId === doctorId || 
        apt.doctor === selectedDoctor.name ||
        apt.doctorName === selectedDoctor.name
      )
    ]
    
    console.log('📋 Total appointments for this doctor:', combinedAppointments.length)
    console.log('All appointments:', combinedAppointments)
    
    // Check if there's a conflicting appointment
    const conflictingAppointment = combinedAppointments.find(apt => {
      const isSameDate = apt.appointmentDate === date || apt.date === date
      const isSameTime = apt.appointmentTime === time || apt.time === time
      const isPending = apt.status === 'pending' || apt.status === 'scheduled' || !apt.status
      
      console.log('Checking appointment:', {
        patient: apt.patientName || apt.patient,
        date: apt.appointmentDate || apt.date,
        time: apt.appointmentTime || apt.time,
        isSameDate,
        isSameTime,
        isPending
      })
      
      return isSameDate && isSameTime && isPending
    })
    
    if (conflictingAppointment) {
      console.log('❌ CONFLICT FOUND!', conflictingAppointment)
      const conflictPatientName = conflictingAppointment.patientName || conflictingAppointment.patient || 'Another patient'
      
      setError(
        `❌ Doctor Not Available!\n\n` +
        `Dr. ${selectedDoctor.name} is already booked at ${time} on ${new Date(date).toLocaleDateString()}.\n\n` +
        `Patient "${conflictPatientName}" has an appointment at this time.\n\n` +
        `⚠️ Please reschedule by selecting a different date or time.`
      )
      return
    }
    
    console.log('✅ No conflict - Doctor is available!')
    
    // STEP 2: Proceed with booking if available
    setLoading(true)
    
    try {
      const res = await API.post('/appointments', { 
        patientId, 
        doctorId, 
        date, 
        time,
        reason: patientProblem
      })
      setMsg('✅ Appointment booked successfully! You will receive a confirmation shortly.')
      
      // Add patient to doctor's patient list
      const newPatient = {
        id: Date.now(),
        patientName: patientName,
        age: parseInt(patientAge) || 0,
        problem: patientProblem,
        appointmentDate: date,
        appointmentTime: time,
        status: 'pending'
      }
      
      doctorAppointments.push(newPatient)
      allAppointments[doctorId] = doctorAppointments
      localStorage.setItem('doctorAppointments', JSON.stringify(allAppointments))
      
      // Play notification sound - Better approach
      try {
        // Use a reliable notification sound
        const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
        notificationSound.volume = 0.7
        
        // Request permission and play
        const playPromise = notificationSound.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Notification sound played successfully')
            })
            .catch(err => {
              console.log('⚠️ Sound autoplay blocked by browser:', err)
              // Fallback: Try browser notification with sound
              if ('Notification' in window) {
                if (Notification.permission === 'granted') {
                  new Notification('🏥 Appointment Booked!', {
                    body: `Successfully booked with Dr. ${selectedDoctor?.name}`,
                    tag: 'appointment',
                    requireInteraction: false
                  })
                } else if (Notification.permission !== 'denied') {
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      new Notification('🏥 Appointment Booked!', {
                        body: `Successfully booked with Dr. ${selectedDoctor?.name}`
                      })
                    }
                  })
                }
              }
            })
        }
      } catch (err) {
        console.log('Notification error:', err)
      }
      
      // Create notification
      const notification = {
        id: Date.now(),
        title: 'New Appointment Booked',
        message: `${patientName} has booked an appointment with Dr. ${selectedDoctor?.name} on ${new Date(date).toLocaleDateString()} at ${time}`,
        timestamp: new Date().toISOString(),
        read: false
      }
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }))
      
      setStep(3)
    } catch(e) {
      setError(e.response?.data?.msg || 'Failed to book appointment. Please try again.')
    }
    setLoading(false)
  }

  const resetForm = () => {
    setStep(1)
    setPatientName('')
    setPatientAge('')
    setPatientGender('male')
    setPatientContact('')
    setPatientId('')
    setDate('')
    setTime('')
    setMsg('')
    setError('')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 py-12'>
      <div className='max-w-3xl mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold text-slate-900 mb-3'>Book Your Appointment</h1>
            <p className='text-lg text-slate-600'>Quick and easy appointment booking in 2 simple steps</p>
          </div>

          {/* Progress Steps */}
          <div className='flex items-center justify-center mb-8'>
            <div className='flex items-center gap-4'>
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-sky-600' : 'text-slate-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>1</div>
                <span className='font-medium hidden sm:inline'>Patient Info</span>
              </div>
              <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-sky-600' : 'bg-slate-200'}`}></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-sky-600' : 'text-slate-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>2</div>
                <span className='font-medium hidden sm:inline'>Schedule</span>
              </div>
              <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-sky-600' : 'bg-slate-200'}`}></div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-sky-600' : 'text-slate-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-sky-600 text-white' : 'bg-slate-200'}`}>3</div>
                <span className='font-medium hidden sm:inline'>Confirm</span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow-xl p-8 border border-slate-100'>
            {/* Messages */}
            {msg && (
              <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3'>
                <CheckCircle className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0' />
                <p className='text-green-800'>{msg}</p>
              </div>
            )}
            {error && (
              <div className='mb-6 p-5 bg-red-50 border-2 border-red-300 rounded-xl'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='w-6 h-6 text-red-600 mt-0.5 flex-shrink-0' />
                  <div className='flex-1'>
                    <h4 className='font-bold text-red-800 mb-2 text-lg'>Appointment Conflict</h4>
                    <p className='text-red-700 whitespace-pre-line leading-relaxed'>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Patient Information */}
            {step === 1 && (
              <form onSubmit={handleCreatePatient} className='space-y-6'>
                <h2 className='text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2'>
                  <User className='w-6 h-6 text-sky-600' />
                  Patient Information
                </h2>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>Full Name *</label>
                  <input 
                    required
                    value={patientName}
                    onChange={e=>setPatientName(e.target.value)}
                    className='w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-transparent' 
                    placeholder='Enter patient name' 
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Age *</label>
                    <input 
                      type='number'
                      required
                      value={patientAge}
                      onChange={e=>setPatientAge(e.target.value)}
                      className='w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-transparent' 
                      placeholder='Age' 
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Gender *</label>
                    <select 
                      value={patientGender}
                      onChange={e=>setPatientGender(e.target.value)}
                      className='w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-transparent'
                    >
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>Contact Number *</label>
                  <input 
                    type='tel'
                    required
                    value={patientContact}
                    onChange={e=>setPatientContact(e.target.value)}
                    className='w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-transparent' 
                    placeholder='Phone or email' 
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>Reason for Visit *</label>
                  <textarea 
                    required
                    value={patientProblem}
                    onChange={e=>setPatientProblem(e.target.value)}
                    rows={3}
                    className='w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-transparent resize-none' 
                    placeholder='Enter reason for visit (e.g., Headache, Throat pain, Fever, Stomach ache)' 
                  />
                  <p className='text-sm text-slate-500 mt-1'>Please describe your symptoms or health concern</p>
                </div>

                <button 
                  type='submit'
                  disabled={loading}
                  className='w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Processing...' : 'Continue to Schedule'}
                </button>
              </form>
            )}

            {/* Step 2: Schedule Appointment */}
            {step === 2 && (
              <form onSubmit={handleBookAppointment} className='space-y-6'>
                <h2 className='text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2'>
                  <Calendar className='w-6 h-6 text-sky-600' />
                  Schedule Appointment
                </h2>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2'>
                    <Stethoscope className='w-4 h-4' />
                    Choose Doctor *
                  </label>
                  <select 
                    value={doctorId} 
                    onChange={e=>setDoctorId(e.target.value)} 
                    className='w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-transparent bg-white cursor-pointer hover:border-slate-400 transition-colors'
                    required
                  >
                    <option value='' disabled>Select a doctor</option>
                    {doctors.length === 0 ? (
                      <option value='' disabled>Loading doctors...</option>
                    ) : (
                      doctors.map(d=> (
                        <option key={d._id} value={d._id}>
                          Dr. {d.name} — {d.specialization} ({d.department})
                        </option>
                      ))
                    )}
                  </select>
                  {doctors.length === 0 && (
                    <p className='text-sm text-amber-600 mt-1'>Loading available doctors...</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    Appointment Date *
                  </label>
                  <input 
                    type='date' 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date} 
                    onChange={e=>setDate(e.target.value)} 
                    className='w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-transparent' 
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2'>
                    <Clock className='w-4 h-4' />
                    Appointment Time *
                  </label>
                  <input 
                    type='time'
                    required
                    value={time} 
                    onChange={e=>setTime(e.target.value)} 
                    className='w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:border-transparent' 
                    placeholder='e.g., 09:30' 
                  />
                </div>

                <div className='flex gap-3'>
                  <button 
                    type='button'
                    onClick={() => setStep(1)}
                    className='flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition'
                  >
                    Back
                  </button>
                  <button 
                    type='submit'
                    disabled={loading}
                    className='flex-1 bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {loading ? 'Booking...' : 'Confirm Appointment'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className='text-center py-8'>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                >
                  <CheckCircle className='w-20 h-20 text-green-500 mx-auto mb-4' />
                </motion.div>
                <h2 className='text-2xl font-bold text-slate-900 mb-3'>Appointment Confirmed!</h2>
                <p className='text-slate-600 mb-2'>Your appointment has been successfully booked.</p>
                <p className='text-sm text-slate-500 mb-6'>You will receive a confirmation email/SMS shortly.</p>
                
                <div className='bg-sky-50 rounded-lg p-4 mb-6 text-left'>
                  <h3 className='font-semibold text-slate-900 mb-2'>Appointment Details:</h3>
                  <div className='space-y-1 text-sm text-slate-700'>
                    <p><strong>Patient:</strong> {patientName}</p>
                    <p><strong>Doctor:</strong> {doctors.find(d => d._id === doctorId)?.name}</p>
                    <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {time}</p>
                  </div>
                </div>

                <button 
                  onClick={resetForm}
                  className='w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 transition'
                >
                  Book Another Appointment
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
