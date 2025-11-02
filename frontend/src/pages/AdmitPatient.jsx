import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Building2, Calendar, Stethoscope, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function AdmitPatient() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [roomType, setRoomType] = useState('General')
  const [admissionReason, setAdmissionReason] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [admittedData, setAdmittedData] = useState(null)
  const [patientAppointments, setPatientAppointments] = useState([])
  const [loadingAppointments, setLoadingAppointments] = useState(false)

  const roomTypes = ['ICU', 'General', 'Private', 'Emergency', 'Maternity']

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    API.setToken(token)
    fetchData()
  }, [navigate])

  const fetchData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        API.get('/patients'),
        API.get('/doctors')
      ])
      
      // Filter only non-admitted patients
      const nonAdmittedPatients = patientsRes.data.filter(
        p => p.admissionStatus !== 'Admitted'
      )
      
      setPatients(nonAdmittedPatients)
      setDoctors(doctorsRes.data)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data')
    }
  }

  const fetchPatientAppointments = async (patientId) => {
    setLoadingAppointments(true)
    try {
      const res = await API.get(`/appointments?patientId=${patientId}`)
      // Get appointments and populate doctor details
      const appointmentsWithDoctors = await Promise.all(
        res.data.map(async (appointment) => {
          try {
            const doctorRes = await API.get(`/doctors/${appointment.doctor}`)
            return {
              ...appointment,
              doctorDetails: doctorRes.data
            }
          } catch (err) {
            return {
              ...appointment,
              doctorDetails: null
            }
          }
        })
      )
      setPatientAppointments(appointmentsWithDoctors)
    } catch (err) {
      console.error('Error fetching appointments:', err)
      setPatientAppointments([])
    }
    setLoadingAppointments(false)
  }

  const handlePatientChange = (patientId) => {
    setSelectedPatient(patientId)
    if (patientId) {
      fetchPatientAppointments(patientId)
    } else {
      setPatientAppointments([])
    }
  }

  const handleAdmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!selectedPatient || !roomType) {
      setError('Please select a patient and room type')
      return
    }

    setLoading(true)
    
    try {
      const res = await API.post('/wards/admit', {
        patientId: selectedPatient,
        roomType,
        admissionReason,
        doctorId: doctorId || undefined
      })
      
      setSuccess(res.data.msg)
      setAdmittedData(res.data)
      
      // Play success sound
      try {
        const sound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
        sound.volume = 0.5
        sound.play().catch(() => {})
      } catch (err) {}
      
      // Refresh patients list
      setTimeout(() => {
        fetchData()
        setSelectedPatient('')
        setRoomType('General')
        setAdmissionReason('')
        setDoctorId('')
      }, 3000)
      
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to admit patient')
      if (err.response?.data?.suggestion) {
        setError(prev => prev + '\n\n' + err.response.data.suggestion)
      }
    }
    
    setLoading(false)
  }

  const getRoomTypeColor = (type) => {
    switch(type) {
      case 'ICU': return 'bg-red-500'
      case 'General': return 'bg-blue-500'
      case 'Private': return 'bg-purple-500'
      case 'Emergency': return 'bg-orange-500'
      case 'Maternity': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const selectedPatientData = patients.find(p => p._id === selectedPatient)

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Page Header */}
      <div className='bg-white border-b border-slate-200 shadow-sm'>
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => navigate('/wards')}
              className='p-2 hover:bg-slate-100 rounded-lg transition'
            >
              <ArrowLeft className='w-5 h-5 text-slate-600' />
            </button>
            <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg'>
              <UserPlus className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-slate-900'>Admit Patient</h1>
              <p className='text-sm text-slate-600'>Assign bed automatically based on room type</p>
            </div>
          </div>
          </div>
      </div>

      <div className='max-w-4xl mx-auto px-6 py-8'>
        {/* Success Message */}
        {success && admittedData && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-green-50 border border-green-200 rounded-xl p-6 mb-6'
          >
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0'>
                <CheckCircle className='w-6 h-6 text-white' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-green-900 mb-2'>Patient Admitted Successfully!</h3>
                <div className='space-y-2 text-sm text-green-800'>
                  <p><span className='font-semibold'>Patient:</span> {admittedData.patient?.name}</p>
                  <p><span className='font-semibold'>Bed Number:</span> {admittedData.bed?.bedNumber}</p>
                  <p><span className='font-semibold'>Room:</span> {admittedData.room?.roomNumber} ({admittedData.room?.roomType})</p>
                  <p><span className='font-semibold'>Admission Date:</span> {new Date(admittedData.patient?.admissionDate).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => navigate('/wards')}
                  className='mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-semibold'
                >
                  View Ward Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-red-50 border border-red-200 rounded-xl p-4 mb-6'
          >
            <div className='flex items-start gap-3'>
              <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
              <div>
                <h3 className='font-bold text-red-900 mb-1'>Admission Failed</h3>
                <p className='text-sm text-red-800 whitespace-pre-line'>{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Admission Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden'
        >
          <div className='px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
            <h2 className='text-xl font-bold'>Patient Admission Form</h2>
            <p className='text-sm text-blue-100 mt-1'>Fill in the details to admit a patient</p>
          </div>

          <form onSubmit={handleAdmit} className='p-6 space-y-6'>
            {/* Select Patient */}
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>
                Select Patient *
              </label>
              <select
                value={selectedPatient}
                onChange={(e) => handlePatientChange(e.target.value)}
                className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              >
                <option value=''>Choose a patient...</option>
                {patients.map(patient => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} - {patient.age} yrs, {patient.gender}
                  </option>
                ))}
              </select>
              {patients.length === 0 && (
                <p className='text-sm text-slate-500 mt-2'>
                  No patients available for admission. All patients are either admitted or no patients registered.
                </p>
              )}
            </div>

            {/* Patient Details Preview */}
            {selectedPatientData && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4'>
                <div>
                  <h3 className='font-semibold text-blue-900 mb-3'>Patient Details</h3>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div>
                      <span className='text-blue-700 font-medium'>Name:</span>
                      <span className='text-blue-900 ml-2'>{selectedPatientData.name}</span>
                    </div>
                    <div>
                      <span className='text-blue-700 font-medium'>Age:</span>
                      <span className='text-blue-900 ml-2'>{selectedPatientData.age} years</span>
                    </div>
                    <div>
                      <span className='text-blue-700 font-medium'>Gender:</span>
                      <span className='text-blue-900 ml-2'>{selectedPatientData.gender}</span>
                    </div>
                    <div>
                      <span className='text-blue-700 font-medium'>Contact:</span>
                      <span className='text-blue-900 ml-2'>{selectedPatientData.contact}</span>
                    </div>
                  </div>
                </div>

                {/* Appointment Information */}
                <div className='border-t border-blue-300 pt-3'>
                  <h3 className='font-semibold text-blue-900 mb-2 flex items-center gap-2'>
                    <Stethoscope className='w-4 h-4' />
                    Appointment History
                  </h3>
                  {loadingAppointments ? (
                    <div className='text-sm text-blue-600'>Loading appointments...</div>
                  ) : patientAppointments.length > 0 ? (
                    <div className='space-y-2 max-h-40 overflow-y-auto'>
                      {patientAppointments.map((appointment, idx) => (
                        <div key={idx} className='bg-white rounded p-3 text-sm border border-blue-200'>
                          <div className='grid grid-cols-2 gap-2'>
                            {appointment.doctorDetails && (
                              <>
                                <div>
                                  <span className='text-blue-700 font-medium'>Doctor:</span>
                                  <span className='text-blue-900 ml-1'>{appointment.doctorDetails.name}</span>
                                </div>
                                <div>
                                  <span className='text-blue-700 font-medium'>Specialization:</span>
                                  <span className='text-blue-900 ml-1'>{appointment.doctorDetails.specialization}</span>
                                </div>
                              </>
                            )}
                            <div>
                              <span className='text-blue-700 font-medium'>Date:</span>
                              <span className='text-blue-900 ml-1'>
                                {new Date(appointment.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className='text-blue-700 font-medium'>Status:</span>
                              <span className={`ml-1 font-medium ${
                                appointment.status === 'Confirmed' ? 'text-green-600' : 
                                appointment.status === 'Pending' ? 'text-yellow-600' : 
                                'text-gray-600'
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                            {appointment.reason && (
                              <div className='col-span-2'>
                                <span className='text-blue-700 font-medium'>Reason:</span>
                                <span className='text-blue-900 ml-1'>{appointment.reason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-sm text-slate-500 italic'>No appointments found for this patient</div>
                  )}
                </div>
              </div>
            )}

            {/* Room Type Selection */}
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-3'>
                Select Room Type *
              </label>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                {roomTypes.map(type => (
                  <button
                    key={type}
                    type='button'
                    onClick={() => setRoomType(type)}
                    className={`p-4 border-2 rounded-xl transition ${
                      roomType === type
                        ? `${getRoomTypeColor(type)} text-white border-transparent`
                        : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                    }`}
                  >
                    <Building2 className='w-6 h-6 mx-auto mb-2' />
                    <span className='font-semibold text-sm'>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Admission Reason */}
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>
                Reason for Admission
              </label>
              <textarea
                value={admissionReason}
                onChange={(e) => setAdmissionReason(e.target.value)}
                placeholder='Enter reason for admission (e.g., Surgery, Treatment, Observation)...'
                rows={3}
                className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
              />
            </div>

            {/* Assign Doctor */}
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>
                Assign Doctor (Optional)
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>No doctor assigned</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Info Box */}
            <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
              <div className='flex items-start gap-3'>
                <AlertCircle className='w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5' />
                <div className='text-sm text-amber-800'>
                  <p className='font-semibold mb-1'>Automatic Bed Assignment</p>
                  <p>The system will automatically find and assign the first available bed in a {roomType} room. If no beds are available, you'll be notified.</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={() => navigate('/wards')}
                className='flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading || !selectedPatient || !roomType}
                className='flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {loading ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Admitting...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className='w-4 h-4' />
                    <span>Admit Patient</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
