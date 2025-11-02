import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileSpreadsheet, Users, Stethoscope, Calendar, CheckCircle, Clock, Download, Filter, Search, User, Activity, AlertCircle, ArrowLeft, Mail, MessageSquare, Bed, Building2 } from 'lucide-react'
import axios from 'axios'
import API from '../api'

export default function AllData() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('doctors')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // State for API data
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [rooms, setRooms] = useState([])
  const [beds, setBeds] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Load data from localStorage
  const [notifications, setNotifications] = useState([])
  const [contactMessages, setContactMessages] = useState([])
  const [contactStats, setContactStats] = useState({ total: 0, new: 0, resolved: 0 })

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await API.patch(`/appointments/${appointmentId}/status`, { status: newStatus })
      // Refresh data after update
      fetchAllData()
      alert(`Appointment marked as ${newStatus}!`)
    } catch (error) {
      console.error('Error updating appointment status:', error)
      alert('Failed to update appointment status')
    }
  }

  useEffect(() => {
    // Check if user has admin access
    const userRole = localStorage.getItem('userRole')
    if (userRole !== 'admin') {
      // Redirect non-admin users to user dashboard
      navigate('/user-dashboard')
      return
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    
    API.setToken(token)
    
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]')
    setNotifications(notifs)
    
    // Fetch all data from backend
    fetchAllData()
    fetchContactMessages()
  }, [navigate])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [appointmentsRes, patientsRes, doctorsRes, roomsRes, bedsRes] = await Promise.all([
        API.get('/appointments'),
        API.get('/patients'),
        API.get('/doctors'),
        API.get('/wards/rooms'),
        API.get('/wards/beds')
      ])
      
      console.log('Appointments:', appointmentsRes.data)
      console.log('Patients:', patientsRes.data)
      console.log('Doctors:', doctorsRes.data)
      console.log('Rooms:', roomsRes.data)
      console.log('Beds:', bedsRes.data)
      
      setAppointments(appointmentsRes.data)
      setPatients(patientsRes.data)
      setDoctors(doctorsRes.data)
      setRooms(roomsRes.data)
      setBeds(bedsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchContactMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      const [messagesRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/contact/all', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/contact/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      
      if (messagesRes.data.success) {
        setContactMessages(messagesRes.data.data.contacts)
      }
      if (statsRes.data.success) {
        setContactStats(statsRes.data.data)
      }
    } catch (error) {
      console.error('Error fetching contact messages:', error)
    }
  }

  // Get all patients with appointment and ward info
  const getAllPatientsWithDetails = () => {
    return appointments.map(appointment => {
      // Handle both populated and non-populated data
      const patientData = appointment.patientId?._id ? appointment.patientId : 
                         patients.find(p => p._id === appointment.patientId)
      const doctorData = appointment.doctorId?._id ? appointment.doctorId : 
                        doctors.find(d => d._id === appointment.doctorId)
      
      const patientId = patientData?._id || appointment.patientId
      const bed = beds.find(b => b.patient === patientId || b.patient?._id === patientId)
      const room = bed ? rooms.find(r => r._id === (bed.room?._id || bed.room)) : null
      
      return {
        id: appointment._id,
        patientName: patientData?.name || 'Unknown',
        age: patientData?.age || 'N/A',
        gender: patientData?.gender || 'N/A',
        contact: patientData?.contact || 'N/A',
        problem: appointment.reason || 'General Consultation',
        doctorName: doctorData?.name || 'Unknown',
        doctorSpecialization: doctorData?.specialization || 'N/A',
        appointmentDate: appointment.date,
        appointmentTime: appointment.time || 'N/A',
        status: appointment.status?.toLowerCase() || 'pending',
        // Ward Information
        admissionStatus: patientData?.admissionStatus || 'Not Admitted',
        bedNumber: bed?.bedNumber || 'N/A',
        roomNumber: room?.roomNumber || 'N/A',
        roomType: room?.roomType || 'N/A',
        admissionDate: patientData?.admissionDate || null,
        dischargeDate: patientData?.dischargeDate || null
      }
    })
  }

  // Get pending and checked up cases
  const getPendingCases = () => {
    const cases = getAllPatientsWithDetails().filter(p => p.status === 'scheduled' || p.status === 'pending')
    console.log('Pending Cases:', cases.length, cases)
    return cases
  }
  
  const getCheckedUpCases = () => {
    const cases = getAllPatientsWithDetails().filter(p => p.status === 'completed' || p.status === 'confirmed')
    console.log('Checked Up Cases:', cases.length, cases)
    return cases
  }

  // Get diseases/problems summary
  const getDiseasesSummary = () => {
    const allPatients = getAllPatientsWithDetails()
    const diseasesMap = {}
    
    allPatients.forEach(patient => {
      const disease = patient.problem || 'Not specified'
      if (diseasesMap[disease]) {
        diseasesMap[disease].count++
        diseasesMap[disease].patients.push({
          name: patient.patientName,
          age: patient.age,
          doctor: patient.doctorName,
          specialization: patient.doctorSpecialization,
          date: patient.appointmentDate
        })
      } else {
        diseasesMap[disease] = {
          disease,
          count: 1,
          patients: [{
            name: patient.patientName,
            age: patient.age,
            doctor: patient.doctorName,
            specialization: patient.doctorSpecialization,
            date: patient.appointmentDate
          }]
        }
      }
    })
    
    const summary = Object.values(diseasesMap).sort((a, b) => b.count - a.count)
    console.log('Diseases Summary:', summary)
    return summary
  }

  // Statistics
  const stats = {
    totalDoctors: doctors.length,
    totalPatients: getAllPatientsWithDetails().length,
    pendingCases: getPendingCases().length,
    checkedUpCases: getCheckedUpCases().length,
    totalNotifications: notifications.length,
    unreadNotifications: notifications.filter(n => !n.read).length
  }
  
  // Log stats for debugging
  console.log('Statistics:', stats)

  // Export to CSV function
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      alert('No data to export!')
      return
    }
    
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    const csv = [headers, ...rows].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Filter function
  const filterData = (data) => {
    let filtered = data

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => {
        if (filterStatus === 'pending') return item.status === 'scheduled' || item.status === 'pending'
        if (filterStatus === 'checked-up') return item.status === 'completed' || item.status === 'confirmed'
        return true
      })
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => navigate('/dashboard')}
                className='flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all font-semibold'
              >
                <ArrowLeft className='w-5 h-5' />
                Back to Dashboard
              </button>
              <div>
                <h1 className='text-4xl font-bold text-gray-900 flex items-center gap-3'>
                  <FileSpreadsheet className='w-10 h-10 text-blue-600' />
                  All Data Overview
                </h1>
                <p className='text-gray-600 mt-2'>Complete hospital management data in one place</p>
              </div>
            </div>
            <button
              onClick={() => {
                const allData = getAllPatientsWithDetails()
                exportToCSV(allData, 'hospital_all_data')
              }}
              className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold'
            >
              <Download className='w-5 h-5' />
              Export All Data
            </button>
          </div>

          {/* Statistics Cards */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6'>
            <div className='bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg'>
              <Stethoscope className='w-8 h-8 mb-2 opacity-80' />
              <div className='text-3xl font-bold'>{stats.totalDoctors}</div>
              <div className='text-sm opacity-90'>Total Doctors</div>
            </div>
            <div className='bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg'>
              <Users className='w-8 h-8 mb-2 opacity-80' />
              <div className='text-3xl font-bold'>{stats.totalPatients}</div>
              <div className='text-sm opacity-90'>Total Patients</div>
            </div>
            <div className='bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg'>
              <Clock className='w-8 h-8 mb-2 opacity-80' />
              <div className='text-3xl font-bold'>{stats.pendingCases}</div>
              <div className='text-sm opacity-90'>Pending Cases</div>
            </div>
            <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg'>
              <CheckCircle className='w-8 h-8 mb-2 opacity-80' />
              <div className='text-3xl font-bold'>{stats.checkedUpCases}</div>
              <div className='text-sm opacity-90'>Checked Up</div>
            </div>
            <div className='bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg'>
              <Activity className='w-8 h-8 mb-2 opacity-80' />
              <div className='text-3xl font-bold'>{stats.totalNotifications}</div>
              <div className='text-sm opacity-90'>Notifications</div>
            </div>
            <div className='bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white shadow-lg'>
              <AlertCircle className='w-8 h-8 mb-2 opacity-80' />
              <div className='text-3xl font-bold'>{stats.unreadNotifications}</div>
              <div className='text-sm opacity-90'>Unread</div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Search across all data...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all'
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('checked-up')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === 'checked-up' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Checked Up
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='border-b border-gray-200'>
            <div className='flex overflow-x-auto'>
              {[
                { id: 'doctors', label: 'Doctors', icon: Stethoscope },
                { id: 'patients', label: 'All Patients', icon: Users },
                { id: 'pending', label: 'Pending Cases', icon: Clock },
                { id: 'checkedup', label: 'Checked Up', icon: CheckCircle },
                { id: 'diseases', label: 'Diseases Summary', icon: Activity },
                { id: 'contact', label: 'Contact Messages', icon: MessageSquare },
                { id: 'notifications', label: 'Notifications', icon: AlertCircle }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all border-b-4 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className='w-5 h-5' />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {/* Doctors Tab */}
            {activeTab === 'doctors' && (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gradient-to-r from-blue-50 to-purple-50'>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Doctor Name</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Specialization</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Email</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Phone</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Experience</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Active Appointments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor, index) => {
                      const activeAppointments = appointments.filter(a => 
                        (a.doctorId?._id === doctor._id) || (a.doctorId === doctor._id)
                      ).length
                      return (
                        <tr key={doctor._id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className='px-4 py-3 font-semibold text-gray-800'>{doctor.name}</td>
                          <td className='px-4 py-3 text-gray-600'>{doctor.specialization}</td>
                          <td className='px-4 py-3 text-gray-600'>{doctor.email || 'N/A'}</td>
                          <td className='px-4 py-3 text-gray-600'>{doctor.phone || 'N/A'}</td>
                          <td className='px-4 py-3 text-gray-600'>{doctor.experience || 'N/A'}</td>
                          <td className='px-4 py-3'>
                            <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold'>
                              {activeAppointments} appointments
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {doctors.length === 0 && (
                  <div className='text-center py-12 text-gray-500'>
                    {loading ? 'Loading doctors data...' : 'No doctors found'}
                  </div>
                )}
              </div>
            )}

            {/* All Patients Tab */}
            {activeTab === 'patients' && (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gradient-to-r from-purple-50 to-pink-50'>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Patient Name</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Age</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Problem</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Doctor</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Appointment Date</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Time</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Ward Info</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Status</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterData(getAllPatientsWithDetails()).map((patient, index) => (
                      <tr key={patient.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className='px-4 py-3 font-semibold text-gray-800'>{patient.patientName}</td>
                        <td className='px-4 py-3 text-gray-600'>{patient.age}</td>
                        <td className='px-4 py-3 text-gray-600 max-w-xs truncate'>{patient.problem}</td>
                        <td className='px-4 py-3'>
                          <div className='text-gray-800 font-medium'>{patient.doctorName}</div>
                          <div className='text-xs text-gray-500'>{patient.doctorSpecialization}</div>
                        </td>
                        <td className='px-4 py-3 text-gray-600'>{new Date(patient.appointmentDate).toLocaleDateString()}</td>
                        <td className='px-4 py-3 text-gray-600'>{patient.appointmentTime}</td>
                        <td className='px-4 py-3'>
                          {patient.admissionStatus === 'Admitted' ? (
                            <div className='text-sm'>
                              <div className='flex items-center gap-1 text-blue-700 font-medium'>
                                <Bed className='w-3 h-3' />
                                Bed {patient.bedNumber}
                              </div>
                              <div className='flex items-center gap-1 text-gray-600 text-xs'>
                                <Building2 className='w-3 h-3' />
                                {patient.roomType} - Room {patient.roomNumber}
                              </div>
                            </div>
                          ) : (
                            <span className='text-xs text-gray-500 italic'>Not Admitted</span>
                          )}
                        </td>
                        <td className='px-4 py-3'>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            patient.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            patient.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {patient.status === 'completed' ? '✓ Completed' : 
                             patient.status === 'cancelled' ? '✗ Cancelled' : 
                             '⏳ Scheduled'}
                          </span>
                        </td>
                        <td className='px-4 py-3'>
                          {patient.status === 'scheduled' && (
                            <button
                              onClick={() => updateAppointmentStatus(patient.id, 'completed')}
                              className='px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition'
                            >
                              Mark Complete
                            </button>
                          )}
                          {patient.status === 'completed' && (
                            <span className='text-sm text-gray-400 italic'>Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filterData(getAllPatientsWithDetails()).length === 0 && (
                  <div className='text-center py-12 text-gray-500'>
                    {loading ? 'Loading patients data...' : 'No patients found'}
                  </div>
                )}
              </div>
            )}

            {/* Pending Cases Tab */}
            {activeTab === 'pending' && (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gradient-to-r from-orange-50 to-red-50'>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Patient Name</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Age</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Problem</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Doctor</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Appointment Date</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Time</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Ward Info</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getPendingCases().map((patient, index) => (
                      <tr key={patient.id} className={`border-b hover:bg-orange-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className='px-4 py-3 font-semibold text-gray-800'>{patient.patientName}</td>
                        <td className='px-4 py-3 text-gray-600'>{patient.age}</td>
                        <td className='px-4 py-3 text-gray-600 max-w-xs truncate'>{patient.problem}</td>
                        <td className='px-4 py-3'>
                          <div className='text-gray-800 font-medium'>{patient.doctorName}</div>
                          <div className='text-xs text-gray-500'>{patient.doctorSpecialization}</div>
                        </td>
                        <td className='px-4 py-3 text-gray-600'>{new Date(patient.appointmentDate).toLocaleDateString()}</td>
                        <td className='px-4 py-3 text-gray-600 font-semibold'>{patient.appointmentTime}</td>
                        <td className='px-4 py-3'>
                          {patient.admissionStatus === 'Admitted' ? (
                            <div className='text-sm'>
                              <div className='flex items-center gap-1 text-blue-700 font-medium'>
                                <Bed className='w-3 h-3' />
                                Bed {patient.bedNumber}
                              </div>
                              <div className='flex items-center gap-1 text-gray-600 text-xs'>
                                <Building2 className='w-3 h-3' />
                                {patient.roomType} - {patient.roomNumber}
                              </div>
                            </div>
                          ) : (
                            <span className='text-xs text-gray-500 italic'>Not Admitted</span>
                          )}
                        </td>
                        <td className='px-4 py-3'>
                          <button
                            onClick={() => updateAppointmentStatus(patient.id, 'completed')}
                            className='px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition'
                          >
                            ✓ Mark Complete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {getPendingCases().length === 0 && (
                  <div className='text-center py-12 text-gray-500'>
                    <CheckCircle className='w-16 h-16 mx-auto mb-4 text-green-400' />
                    <p className='text-lg font-semibold'>No pending cases! All patients confirmed.</p>
                  </div>
                )}
              </div>
            )}

            {/* Checked Up Tab */}
            {activeTab === 'checkedup' && (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gradient-to-r from-green-50 to-emerald-50'>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Patient Name</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Age</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Problem</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Doctor</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Appointment Date</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Ward Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCheckedUpCases().map((patient, index) => (
                      <tr key={patient.id} className={`border-b hover:bg-green-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className='px-4 py-3 font-semibold text-gray-800'>{patient.patientName}</td>
                        <td className='px-4 py-3 text-gray-600'>{patient.age}</td>
                        <td className='px-4 py-3 text-gray-600 max-w-xs truncate'>{patient.problem}</td>
                        <td className='px-4 py-3'>
                          <div className='text-gray-800 font-medium'>{patient.doctorName}</div>
                          <div className='text-xs text-gray-500'>{patient.doctorSpecialization}</div>
                        </td>
                        <td className='px-4 py-3 text-gray-600'>{new Date(patient.appointmentDate).toLocaleDateString()}</td>
                        <td className='px-4 py-3'>
                          {patient.admissionStatus === 'Admitted' ? (
                            <div className='text-sm'>
                              <div className='flex items-center gap-1 text-blue-700 font-medium'>
                                <Bed className='w-3 h-3' />
                                Bed {patient.bedNumber}
                              </div>
                              <div className='flex items-center gap-1 text-gray-600 text-xs'>
                                <Building2 className='w-3 h-3' />
                                {patient.roomType} - {patient.roomNumber}
                              </div>
                            </div>
                          ) : (
                            <span className='text-xs text-gray-500 italic'>Not Admitted</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {getCheckedUpCases().length === 0 && (
                  <div className='text-center py-12 text-gray-500'>No confirmed appointments</div>
                )}
              </div>
            )}

            {/* Diseases Summary Tab */}
            {activeTab === 'diseases' && (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gradient-to-r from-blue-50 to-cyan-50'>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Disease/Problem</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Patient Name</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Age</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Doctor</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Appointment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDiseasesSummary().map((disease, diseaseIndex) => (
                      disease.patients.map((patientData, patientIndex) => (
                        <tr key={`${diseaseIndex}-${patientIndex}`} className={`border-b hover:bg-blue-50 ${(diseaseIndex + patientIndex) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className='px-4 py-3 font-semibold text-blue-700 bg-blue-50'>{disease.disease}</td>
                          <td className='px-4 py-3 font-medium text-gray-800'>{patientData.name}</td>
                          <td className='px-4 py-3 text-gray-600'>{patientData.age}</td>
                          <td className='px-4 py-3'>
                            <div className='text-gray-800 font-medium'>{patientData.doctor}</div>
                            <div className='text-xs text-gray-500'>{patientData.specialization}</div>
                          </td>
                          <td className='px-4 py-3 text-gray-600'>{new Date(patientData.date).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
                {getDiseasesSummary().length === 0 && (
                  <div className='text-center py-12 text-gray-500'>No disease data available</div>
                )}
              </div>
            )}

            {/* Contact Messages Tab */}
            {activeTab === 'contact' && (
              <div className='p-6'>
                {/* Statistics Cards */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                  <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm opacity-90'>Total Messages</p>
                        <p className='text-3xl font-bold'>{contactStats.total}</p>
                      </div>
                      <MessageSquare className='w-10 h-10 opacity-80' />
                    </div>
                  </div>
                  <div className='bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm opacity-90'>New/Unread</p>
                        <p className='text-3xl font-bold'>{contactStats.new}</p>
                      </div>
                      <Mail className='w-10 h-10 opacity-80' />
                    </div>
                  </div>
                  <div className='bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4 shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm opacity-90'>Resolved</p>
                        <p className='text-3xl font-bold'>{contactStats.resolved}</p>
                      </div>
                      <CheckCircle className='w-10 h-10 opacity-80' />
                    </div>
                  </div>
                  <div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm opacity-90'>Today</p>
                        <p className='text-3xl font-bold'>{contactStats.today}</p>
                      </div>
                      <Clock className='w-10 h-10 opacity-80' />
                    </div>
                  </div>
                </div>

                {/* Messages Table */}
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='bg-gradient-to-r from-purple-50 to-pink-50'>
                        <th className='px-4 py-3 text-left font-bold text-gray-700'>Name</th>
                        <th className='px-4 py-3 text-left font-bold text-gray-700'>Email</th>
                        <th className='px-4 py-3 text-left font-bold text-gray-700'>Phone</th>
                        <th className='px-4 py-3 text-left font-bold text-gray-700'>Message</th>
                        <th className='px-4 py-3 text-left font-bold text-gray-700'>Date</th>
                        <th className='px-4 py-3 text-left font-bold text-gray-700'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactMessages.map((message, index) => (
                        <tr key={message._id} className={`border-b hover:bg-purple-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className='px-4 py-3 font-semibold text-gray-800'>{message.name}</td>
                          <td className='px-4 py-3 text-gray-600'>{message.email}</td>
                          <td className='px-4 py-3 text-gray-600'>{message.phone}</td>
                          <td className='px-4 py-3 text-gray-600 max-w-xs truncate' title={message.message}>
                            {message.message}
                          </td>
                          <td className='px-4 py-3 text-gray-600'>
                            {new Date(message.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className='px-4 py-3'>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              message.status === 'new' ? 'bg-orange-100 text-orange-800' :
                              message.status === 'read' ? 'bg-blue-100 text-blue-800' :
                              message.status === 'replied' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {contactMessages.length === 0 && (
                    <div className='text-center py-12 text-gray-500'>
                      <MessageSquare className='w-16 h-16 mx-auto mb-4 text-gray-300' />
                      <p className='text-lg'>No contact messages yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='bg-gradient-to-r from-red-50 to-pink-50'>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Title</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Message</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Timestamp</th>
                      <th className='px-4 py-3 text-left font-bold text-gray-700'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notification, index) => (
                      <tr key={notification.id} className={`border-b hover:bg-pink-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className='px-4 py-3 font-semibold text-gray-800'>{notification.title}</td>
                        <td className='px-4 py-3 text-gray-600 max-w-md'>{notification.message}</td>
                        <td className='px-4 py-3 text-gray-600'>{new Date(notification.timestamp).toLocaleString()}</td>
                        <td className='px-4 py-3'>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            notification.read ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {notification.read ? 'Read' : 'Unread'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {notifications.length === 0 && (
                  <div className='text-center py-12 text-gray-500'>No notifications yet</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
