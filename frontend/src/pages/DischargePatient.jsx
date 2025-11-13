import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { UserMinus, CheckCircle, AlertCircle, ArrowLeft, Calendar, DollarSign, FileText } from 'lucide-react'
import API from '../api'
import { useNavigate, useParams } from 'react-router-dom'

export default function DischargePatient() {
  const navigate = useNavigate()
  const { patientId } = useParams()
  const [patient, setPatient] = useState(null)
  const [dischargeSummary, setDischargeSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [dischargeData, setDischargeData] = useState(null)

  const fetchPatient = useCallback(async () => {
    try {
      console.log('Fetching patient with ID:', patientId)
      const res = await API.get(`/patients/${patientId}`)
      console.log('Patient data received:', res.data)
      setPatient(res.data)
      
      if (res.data.admissionStatus !== 'Admitted') {
        setError('This patient is not currently admitted')
        console.log('Patient is not admitted:', res.data.admissionStatus)
      }
    } catch (err) {
      console.error('Error fetching patient:', err)
      setError('Failed to load patient details: ' + (err.response?.data?.msg || err.message))
    }
  }, [patientId])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    API.setToken(token)
    fetchPatient()
  }, [navigate, fetchPatient])

  const handleDischarge = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    console.log('Starting discharge for patient:', patientId)
    console.log('Discharge summary:', dischargeSummary)
    
    try {
      const res = await API.post('/wards/discharge', {
        patientId,
        dischargeSummary
      })
      
      console.log('Discharge successful:', res.data)
      setSuccess(true)
      setDischargeData(res.data)
      
      // Play success sound
      try {
        const sound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
        sound.volume = 0.5
        sound.play().catch(() => {})
      } catch (err) {}
      
    } catch (err) {
      console.error('Discharge error:', err)
      console.error('Error response:', err.response)
      setError(err.response?.data?.msg || 'Failed to discharge patient: ' + err.message)
    }
    
    setLoading(false)
  }

  if (!patient) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-slate-600 font-semibold'>Loading patient details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Header */}
      <div className='bg-white border-b border-slate-200 shadow-sm'>
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => navigate('/wards')}
              className='p-2 hover:bg-slate-100 rounded-lg transition'
            >
              <ArrowLeft className='w-5 h-5 text-slate-600' />
            </button>
            <div className='w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg'>
              <UserMinus className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-slate-900'>Discharge Patient</h1>
              <p className='text-sm text-slate-600'>Complete discharge process and free bed</p>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-6 py-8'>
        {/* Success Message */}
        {success && dischargeData && (
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
                <h3 className='text-lg font-bold text-green-900 mb-2'>Patient Discharged Successfully!</h3>
                <div className='space-y-2 text-sm text-green-800'>
                  <p><span className='font-semibold'>Patient:</span> {dischargeData.patient?.name}</p>
                  <p><span className='font-semibold'>Days Stayed:</span> {dischargeData.daysStayed} days</p>
                  <p><span className='font-semibold'>Total Bill:</span> ₹{dischargeData.totalBill?.toLocaleString()}</p>
                  <p><span className='font-semibold'>Discharge Date:</span> {new Date(dischargeData.patient?.dischargeDate).toLocaleString()}</p>
                </div>
                <div className='flex gap-3 mt-4'>
                  <button
                    onClick={() => navigate('/wards')}
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-semibold'
                  >
                    View Ward Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/billing', { state: { dischargeData } })}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-semibold'
                  >
                    Generate Bill
                  </button>
                </div>
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
                <h3 className='font-bold text-red-900 mb-1'>Discharge Failed</h3>
                <p className='text-sm text-red-800'>{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Patient Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden mb-6'
        >
          <div className='px-6 py-4 bg-slate-50 border-b border-slate-200'>
            <h2 className='text-lg font-bold text-slate-900'>Patient Information</h2>
          </div>
          <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-slate-600'>Patient Name</label>
              <p className='text-lg font-semibold text-slate-900'>{patient.name}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-slate-600'>Age & Gender</label>
              <p className='text-lg font-semibold text-slate-900'>{patient.age} years, {patient.gender}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-slate-600'>Contact</label>
              <p className='text-lg font-semibold text-slate-900'>{patient.contact}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-slate-600'>Admission Status</label>
              <p className='text-lg font-semibold text-green-600'>{patient.admissionStatus}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-slate-600 flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                Admission Date
              </label>
              <p className='text-lg font-semibold text-slate-900'>
                {patient.admissionDate ? new Date(patient.admissionDate).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-slate-600'>Bed Number</label>
              <p className='text-lg font-semibold text-slate-900'>{patient.bed?.bedNumber || 'N/A'}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-slate-600'>Room</label>
              <p className='text-lg font-semibold text-slate-900'>
                {patient.room?.roomNumber} ({patient.room?.roomType})
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-slate-600 flex items-center gap-1'>
                <DollarSign className='w-4 h-4' />
                Room Price/Day
              </label>
              <p className='text-lg font-semibold text-slate-900'>₹{patient.room?.pricePerDay?.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Discharge Form */}
        {!success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden'
          >
            <div className='px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white'>
              <h2 className='text-xl font-bold'>Discharge Summary</h2>
              <p className='text-sm text-red-100 mt-1'>Add final notes and discharge the patient</p>
            </div>

            <form onSubmit={handleDischarge} className='p-6 space-y-6'>
              {/* Discharge Summary */}
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2'>
                  <FileText className='w-4 h-4' />
                  Discharge Summary & Notes
                </label>
                <textarea
                  value={dischargeSummary}
                  onChange={(e) => setDischargeSummary(e.target.value)}
                  placeholder='Enter discharge summary, treatment completed, medications prescribed, follow-up instructions...'
                  rows={6}
                  className='w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none'
                />
              </div>

              {/* Estimated Bill Preview */}
              {patient.admissionDate && patient.room?.pricePerDay && (
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                  <h3 className='font-semibold text-blue-900 mb-3 flex items-center gap-2'>
                    <DollarSign className='w-5 h-5' />
                    Estimated Bill
                  </h3>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-blue-700'>Admission Date:</span>
                      <span className='text-blue-900 font-medium'>
                        {new Date(patient.admissionDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-blue-700'>Days Stayed:</span>
                      <span className='text-blue-900 font-medium'>
                        {Math.ceil((new Date() - new Date(patient.admissionDate)) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-blue-700'>Room Price/Day:</span>
                      <span className='text-blue-900 font-medium'>₹{patient.room.pricePerDay.toLocaleString()}</span>
                    </div>
                    <div className='border-t border-blue-300 mt-2 pt-2 flex justify-between'>
                      <span className='text-blue-900 font-bold'>Estimated Total:</span>
                      <span className='text-blue-900 font-bold text-lg'>
                        ₹{(Math.ceil((new Date() - new Date(patient.admissionDate)) / (1000 * 60 * 60 * 24)) * patient.room.pricePerDay).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning Box */}
              <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                <div className='flex items-start gap-3'>
                  <AlertCircle className='w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5' />
                  <div className='text-sm text-amber-800'>
                    <p className='font-semibold mb-1'>Discharge Confirmation</p>
                    <p>Once discharged, the bed will become available for new admissions. The patient's bill will be calculated based on the number of days stayed.</p>
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
                  disabled={loading || patient.admissionStatus !== 'Admitted'}
                  className='flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {loading ? (
                    <>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      <span>Discharging...</span>
                    </>
                  ) : (
                    <>
                      <UserMinus className='w-4 h-4' />
                      <span>Discharge Patient</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}
