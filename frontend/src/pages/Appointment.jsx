import React, { useEffect, useState } from 'react'
import API from '../api'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Stethoscope, CheckCircle, AlertCircle, ArrowRight, BrainCircuit, Send, Sparkles } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const buildDynamicAiQuestions = (reason = '') => {
  const text = (reason || '').toLowerCase()

  if (text.includes('chest pain') || text.includes('heart') || text.includes('breath') || text.includes('shortness')) {
    return [
      'How long have you had the chest discomfort or breathing issue?',
      'Is the pain pressure-like, sharp, or severe enough to limit movement?',
      'Are you feeling shortness of breath, dizziness, or unusual weakness?',
      'Has this been triggered by activity, stress, or a recent infection?'
    ]
  }

  if (text.includes('fever') || text.includes('cough') || text.includes('cold') || text.includes('sore throat') || text.includes('flu')) {
    return [
      'How long have the fever, cough, or throat symptoms been present?',
      'Are you also having body ache, fatigue, or breathing difficulty?',
      'Has the fever been rising or are the symptoms becoming more severe?',
      'Is there any chest discomfort, wheezing, or trouble breathing?'
    ]
  }

  if (text.includes('headache') || text.includes('migraine') || text.includes('dizziness')) {
    return [
      'How long have the headaches or dizziness been ongoing?',
      'Are they mild, moderate, or severe and are they affecting your daily activities?',
      'Do you have nausea, vomiting, light sensitivity, or weakness with it?',
      'Has there been a recent injury, high stress, or worsening pattern?'
    ]
  }

  if (text.includes('rash') || text.includes('skin') || text.includes('itching') || text.includes('allergy')) {
    return [
      'When did the rash or skin irritation start?',
      'Is it spreading, painful, itchy, or associated with swelling?',
      'Have you used any new products, foods, or medications recently?',
      'Are you also having fever or general illness with it?'
    ]
  }

  if (text.includes('joint') || text.includes('knee') || text.includes('back pain') || text.includes('bone') || text.includes('ankle')) {
    return [
      'Which area is hurting most: knee, back, joint, or ankle?',
      'Did it start after an injury, strain, or sudden movement?',
      'Is there swelling, stiffness, numbness, or difficulty walking?',
      'How much is it limiting your movement or daily work?'
    ]
  }

  if (text.includes('stomach') || text.includes('abdominal') || text.includes('vomit') || text.includes('nausea')) {
    return [
      'How long have the stomach symptoms been going on?',
      'Are you having pain, nausea, vomiting, diarrhea, or fever?',
      'Is the pain constant or does it come and go?',
      'Have there been any changes in food, hydration, or bowel habits?'
    ]
  }

  return [
    'How long have these symptoms been happening?',
    'How severe are they and how are they affecting your routine?',
    'Any fever, pain, swelling, breathing issue, or worsening pattern?',
    'Do you need urgent care or is it stable and manageable for routine review?'
  ]
}

export default function Appointment(){
  const navigate = useNavigate()
  const location = useLocation()
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
  const [aiLoading, setAiLoading] = useState(false)
  const [aiAssessment, setAiAssessment] = useState(null)
  const [aiError, setAiError] = useState('')
  const [showAiAssistant, setShowAiAssistant] = useState(false)
  const [aiChatStarted, setAiChatStarted] = useState(false)
  const [aiQuestionIndex, setAiQuestionIndex] = useState(0)
  const [aiChatMessages, setAiChatMessages] = useState([])
  const [aiChatInput, setAiChatInput] = useState('')
  const [aiFollowUps, setAiFollowUps] = useState([])
  const [aiQuestions, setAiQuestions] = useState(() => buildDynamicAiQuestions(''))
  const [step, setStep] = useState(1)
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false)

  const openAiAssistant = () => {
    const nextQuestions = buildDynamicAiQuestions(patientProblem)
    setAiQuestions(nextQuestions)
    setShowAiAssistant(true)
    setAiError('')
    setAiAssessment(null)
    setAiFollowUps([])
    setAiChatInput('')

    if (!aiChatStarted) {
      setAiChatMessages([{ from: 'ai', text: nextQuestions[0] }])
      setAiQuestionIndex(0)
      setAiChatStarted(true)
    }
  }

  const reopenAiAssistant = () => {
    setShowAiAssistant(true)
    if (!aiAssessment) {
      const nextQuestions = buildDynamicAiQuestions(patientProblem)
      setAiQuestions(nextQuestions)
      setAiChatMessages(prev => {
        if (prev.length === 0) {
          return [{ from: 'ai', text: nextQuestions[0] }]
        }
        return prev
      })
    }
  }

  const handleAiQuestionSubmit = async (e) => {
    e.preventDefault()

    if (!aiChatInput.trim()) {
      setAiError('Please answer the question first.')
      return
    }

    const answer = aiChatInput.trim()
    const updatedAnswers = [...aiFollowUps, answer]
    const nextIndex = aiQuestionIndex + 1
    const currentQuestions = buildDynamicAiQuestions(patientProblem)

    setAiFollowUps(updatedAnswers)
    setAiChatMessages(prev => [...prev, { from: 'user', text: answer }])
    setAiChatInput('')

    if (nextIndex < currentQuestions.length) {
      setAiQuestions(currentQuestions)
      setAiQuestionIndex(nextIndex)
      setAiChatMessages(prev => [...prev, { from: 'ai', text: currentQuestions[nextIndex] }])
      return
    }

    const combinedSymptoms = [patientProblem, ...updatedAnswers].join(' ')
    setAiLoading(true)
    setAiError('')

    try {
      const res = await API.post('/ai/assess', {
        symptoms: combinedSymptoms,
        patientName: patientName || 'Patient'
      })

      setAiAssessment(res.data)
      setAiChatMessages(prev => [
        ...prev,
        { from: 'ai', text: `${res.data.summary} ${res.data.advice}` }
      ])

      if (res.data?.suggestedDoctor?.id) {
        setDoctorId(res.data.suggestedDoctor.id)
      }
    } catch (e) {
      const fallbackError = e.response?.data?.msg || 'Medical assistant is unavailable right now. Please consult a doctor directly.'
      setAiError(fallbackError)
      setAiChatMessages(prev => [...prev, { from: 'ai', text: fallbackError }])
    } finally {
      setAiLoading(false)
      setAiQuestionIndex(currentQuestions.length)
    }
  }

  const handleProceedToAvailability = () => {
    navigate('/check-availability', {
      state: {
        patientName,
        problem: patientProblem,
        selectedDoctor: doctors.find(d => d._id === doctorId) || aiAssessment?.suggestedDoctor || null,
        aiSummary: aiAssessment?.summary || '',
        recommendedDepartment: aiAssessment?.recommendedDepartment || ''
      }
    })
  }

  useEffect(()=>{
    const availabilityData = location.state

    if (availabilityData && availabilityData.selectedDoctor) {
      setHasCheckedAvailability(true)
      setDoctorId(availabilityData.selectedDoctor._id)
      setDate(availabilityData.appointmentDate)
      setTime(availabilityData.appointmentTime)
      setPatientName(availabilityData.patientName)
      setPatientProblem(availabilityData.problem)
    }

    const token = localStorage.getItem('token')
    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/appointment')
      alert('Please login to book an appointment')
      navigate('/login')
      return
    }

    API.setToken(token)

    API.get('/doctors').then(res=>{
      if (res.data && res.data.length > 0) {
        setDoctors(res.data)
        setError('')
      } else {
        setError('No doctors available at the moment. Please try again later.')
      }
    }).catch((err)=>{
      console.error('Error fetching doctors:', err)
      if (err.response) {
        setError(`Server Error: ${err.response.data.message || 'Failed to load doctors'}`)
      } else if (err.request) {
        setError('Cannot connect to server. Please make sure the backend is running on port 5000.')
      } else {
        setError('Failed to load doctors. Please refresh the page.')
      }
    })
  },[navigate, location])

  useEffect(() => {
    if (patientProblem.trim() && !aiAssessment && !hasCheckedAvailability) {
      const nextQuestions = buildDynamicAiQuestions(patientProblem)
      setAiQuestions(nextQuestions)
      setShowAiAssistant(true)
      if (!aiChatStarted) {
        setAiChatMessages([{ from: 'ai', text: nextQuestions[0] }])
        setAiQuestionIndex(0)
        setAiChatStarted(true)
      }
    }
  }, [patientProblem, aiAssessment, aiChatStarted, hasCheckedAvailability])

  const handleAiHealthCheck = () => {
    if (!patientProblem.trim()) {
      setAiError('Please describe your symptoms before asking the AI assistant.')
      return
    }

    openAiAssistant()
  }

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
        reason: patientProblem,
        symptoms: patientProblem,
        aiSummary: aiAssessment?.summary || '',
        recommendedDepartment: aiAssessment?.recommendedDepartment || '',
        recommendedDoctor: aiAssessment?.suggestedDoctor?.name || doctors.find(d => d._id === doctorId)?.name || ''
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
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fbff_35%,_#edf6ff_100%)] py-8 md:py-12'>
      <div className='max-w-7xl mx-auto px-4 md:px-6'>
        {!hasCheckedAvailability && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className='mx-auto max-w-5xl bg-gradient-to-r from-amber-50 to-orange-50 border-[3px] border-orange-400 rounded-[28px] shadow-[0_12px_30px_rgba(251,146,60,0.12)] p-6 md:p-8 mb-7'
          >
            <div className='flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-5 mb-6'>
              <div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-md'>
                <AlertCircle className='w-8 h-8 text-white' />
              </div>
              <div className='text-center md:text-left'>
                <h2 className='text-2xl md:text-3xl font-extrabold text-orange-900 mb-2'>
                  Availability Check Required
                </h2>
                <p className='text-base md:text-lg text-orange-800'>
                  Complete the AI symptom review first, then check doctor availability before final booking.
                </p>
              </div>
            </div>

            <div className='bg-white/90 rounded-2xl p-5 md:p-6 border border-orange-200 shadow-sm'>
              <h3 className='text-xl font-bold text-slate-800 mb-4'>Flow of the process</h3>
              <ul className='space-y-3 text-slate-700'>
                <li className='flex items-start gap-3'>
                  <CheckCircle className='w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5' />
                  <span><strong className='text-slate-900'>Step 1:</strong> Describe your symptoms and let the AI assistant ask follow-up questions.</span>
                </li>
                <li className='flex items-start gap-3'>
                  <CheckCircle className='w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5' />
                  <span><strong className='text-slate-900'>Step 2:</strong> Review the summary and recommended doctor for your condition.</span>
                </li>
                <li className='flex items-start gap-3'>
                  <CheckCircle className='w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5' />
                  <span><strong className='text-slate-900'>Step 3:</strong> Continue to doctor availability check and confirm your slot.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        <div className='grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_420px] gap-8 items-start justify-center'>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='mx-auto w-full max-w-3xl'
          >
            <div className='text-center mb-8'>
              <h1 className='text-3xl md:text-4xl font-extrabold text-slate-900 mb-3'>Book Your Appointment</h1>
              <p className='text-base md:text-lg text-slate-600'>Quick and easy appointment booking in 2 simple steps</p>
            </div>

            <div className='flex items-center justify-center mb-8'>
              <div className='flex items-center gap-4'>
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-sky-600' : 'text-slate-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-200'}`}>1</div>
                  <span className='font-medium hidden sm:inline'>Patient Info</span>
                </div>
                <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-sky-600' : 'bg-slate-200'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-sky-600' : 'text-slate-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-200'}`}>2</div>
                  <span className='font-medium hidden sm:inline'>Schedule</span>
                </div>
                <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-sky-600' : 'bg-slate-200'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-sky-600' : 'text-slate-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-sky-600 text-white shadow-md' : 'bg-slate-200'}`}>3</div>
                  <span className='font-medium hidden sm:inline'>Confirm</span>
                </div>
              </div>
            </div>

            <div className='bg-white/95 rounded-[28px] shadow-[0_16px_40px_rgba(14,116,144,0.08)] p-6 md:p-8 border border-sky-100'>
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
                      <h4 className='font-bold text-red-800 mb-2 text-lg'>
                        {error.includes('Cannot connect') || error.includes('Failed to load doctors') ? 'Connection Error' : 'Appointment Conflict'}
                      </h4>
                      <p className='text-red-700 whitespace-pre-line leading-relaxed mb-3'>{error}</p>
                      {(error.includes('Cannot connect') || error.includes('Failed to load doctors')) && (
                        <button
                          onClick={() => window.location.reload()}
                          className='px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all text-sm flex items-center gap-2'
                        >
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                          </svg>
                          Retry
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

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

                    <div className='mt-3 flex items-center justify-between gap-3'>
                      <button
                        type='button'
                        onClick={handleAiHealthCheck}
                        disabled={aiLoading || !patientProblem.trim()}
                        className='inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        {aiLoading ? 'Checking...' : 'Ask AI Medical Assistant'}
                      </button>
                      {aiAssessment && (
                        <button
                          type='button'
                          onClick={handleProceedToAvailability}
                          className='inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition'
                        >
                          Continue to Availability Check
                          <ArrowRight className='w-4 h-4' />
                        </button>
                      )}
                    </div>

                    {aiError && (
                      <div className='mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
                        {aiError}
                      </div>
                    )}

                    {aiAssessment && (
                      <div className='mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4'>
                        <div className='flex items-center justify-between gap-3 mb-2'>
                          <h3 className='text-base font-bold text-sky-900'>AI Medical Guidance</h3>
                          <span className='text-xs font-semibold uppercase tracking-wide bg-sky-100 text-sky-700 px-2 py-1 rounded-full'>
                            {aiAssessment.severity}
                          </span>
                        </div>
                        <p className='text-sm text-slate-700 mb-2'><strong>Summary:</strong> {aiAssessment.summary}</p>
                        <p className='text-sm text-slate-700 mb-2'><strong>Advice:</strong> {aiAssessment.advice}</p>
                        <p className='text-sm text-slate-700 mb-2'><strong>Suggested department:</strong> {aiAssessment.recommendedDepartment}</p>
                        <p className='text-sm text-slate-700'><strong>Recommended doctor:</strong> {aiAssessment.suggestedDoctor?.name || 'General consultation'}</p>
                      </div>
                    )}
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

                  {aiAssessment?.doctorSuggestions?.length > 0 && (
                    <div className='rounded-xl border border-sky-200 bg-sky-50 p-4'>
                      <h3 className='font-bold text-sky-900 mb-3'>AI Recommended Doctors</h3>
                      <div className='space-y-2'>
                        {aiAssessment.doctorSuggestions.map((doctor) => (
                          <button
                            key={doctor.id || doctor.name}
                            type='button'
                            onClick={() => doctor.id && setDoctorId(doctor.id)}
                            className={`w-full text-left rounded-lg border px-3 py-2 transition ${doctorId === doctor.id ? 'border-sky-600 bg-sky-100' : 'border-sky-200 bg-white hover:border-sky-400'}`}
                          >
                            <div className='font-semibold text-slate-900'>{doctor.name}</div>
                            <div className='text-sm text-slate-600'>{doctor.specialization} • {doctor.department}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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

          {showAiAssistant && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className='sticky top-6 rounded-[28px] border border-sky-100 bg-white shadow-[0_18px_45px_rgba(14,116,144,0.11)] overflow-hidden mx-auto w-full max-w-[420px]'
            >
              <div className='bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-500 px-5 py-4 text-white'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-white/15 p-2 rounded-xl'>
                      <BrainCircuit className='w-5 h-5' />
                    </div>
                    <div>
                      <p className='text-[10px] uppercase tracking-[0.18em] font-semibold opacity-80'>AI Medical Assistant</p>
                      <h3 className='text-lg font-bold'>Symptom review</h3>
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => setShowAiAssistant(false)}
                    className='text-white/90 hover:text-white text-xs font-semibold border border-white/35 rounded-full px-2.5 py-1'
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className='p-4 space-y-3 max-h-[620px] overflow-y-auto bg-slate-50'>
                {aiChatMessages.length === 0 ? (
                  <div className='rounded-2xl bg-white border border-sky-100 p-3 text-sm text-slate-600'>
                    Describe your health concern and I’ll guide the next steps.
                  </div>
                ) : (
                  aiChatMessages.map((message, index) => (
                    <div
                      key={`${message.from}-${index}`}
                      className={`rounded-2xl p-3 text-sm leading-relaxed ${message.from === 'ai' ? 'bg-white border border-sky-100 text-slate-700' : 'bg-sky-600 text-white ml-auto max-w-[90%]'}`}
                    >
                      {message.text}
                    </div>
                  ))
                )}

                {aiAssessment && (
                  <div className='rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-900'>
                    <div className='flex items-center gap-2 font-semibold mb-1'>
                      <Sparkles className='w-4 h-4' />
                      Summary ready
                    </div>
                    <p>{aiAssessment.recommendedDepartment}</p>
                  </div>
                )}
              </div>

              {!aiAssessment && (
                <form onSubmit={handleAiQuestionSubmit} className='border-t border-sky-100 p-4 bg-white'>
                  <label className='block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2'>Current question</label>
                  <div className='mb-3 rounded-2xl bg-sky-50 border border-sky-100 p-3 text-sm text-slate-700'>
                    {aiChatMessages.length === 0 ? 'Describe your health concern.' : aiQuestions[Math.min(aiQuestionIndex, aiQuestions.length - 1)] || 'We will ask a few clarifying questions to understand the issue better.'}
                  </div>
                  <div className='flex gap-2'>
                    <input
                      value={aiChatInput}
                      onChange={(e) => setAiChatInput(e.target.value)}
                      className='flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      placeholder='Type your answer...'
                      disabled={aiLoading}
                    />
                    <button
                      type='submit'
                      disabled={aiLoading || !aiChatInput.trim()}
                      className='bg-sky-600 hover:bg-sky-700 text-white rounded-xl p-2.5 disabled:opacity-50'
                    >
                      <Send className='w-4 h-4' />
                    </button>
                  </div>
                </form>
              )}

              {aiAssessment && (
                <div className='border-t border-sky-100 p-4 bg-white'>
                  <button
                    type='button'
                    onClick={handleProceedToAvailability}
                    className='w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl py-3 font-semibold shadow-md hover:shadow-lg transition'
                  >
                    Proceed to availability check
                    <ArrowRight className='w-4 h-4' />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
