import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import axios from 'axios'
import { Users, Activity, Calendar, Home, LogOut, UserCircle, Stethoscope, Search, Clock, BookOpen, X, Pill, Package, TrendingUp, TrendingDown, Eye, AlertCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import Header from '../components/Header'

export default function PatientDashboard() {
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0 })
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [medicines, setMedicines] = useState([])
  const [pharmacyStats, setPharmacyStats] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [medicineSearch, setMedicineSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('Test Patient')
  const [viewMode, setViewMode] = useState(null) // 'doctors', 'patients', 'sessions', 'pharmacy'
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      nav('/login')
      return
    }
    API.setToken(token)
    fetchData()
    
    // Get user name from token if available
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUserName(payload.name || 'Test Patient')
    } catch (e) {
      console.log('Could not parse token')
    }
  }, [])

  // Update filtered doctors when search changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = doctors.filter(d => 
        d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.department?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredDoctors(filtered)
    } else {
      setFilteredDoctors(doctors)
    }
  }, [searchQuery, doctors])

  async function fetchData() {
    try {
      const [statsRes, doctorsRes, patientsRes, appointmentsRes, pharmacyStatsRes, medicinesRes] = await Promise.all([
        API.get('/dashboard/stats'),
        API.get('/doctors'),
        API.get('/patients'),
        API.get('/appointments'),
        axios.get('http://localhost:5000/api/medicines/stats'),
        axios.get(`http://localhost:5000/api/medicines?page=1&limit=${itemsPerPage}`)
      ])

      setStats(statsRes.data)
      setDoctors(doctorsRes.data)
      setPatients(patientsRes.data)
      setAppointments(appointmentsRes.data)
      
      if (pharmacyStatsRes.data.success) {
        setPharmacyStats(pharmacyStatsRes.data.data)
      }
      
      if (medicinesRes.data.success) {
        setMedicines(medicinesRes.data.data)
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    }
    setLoading(false)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    nav('/login')
  }

  function handleSearch() {
    if (searchQuery) {
      nav(`/doctors?search=${searchQuery}`)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-sky-600 mx-auto'></div>
          <p className='mt-4 text-slate-600 text-lg'>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      {/* Top Header */}
      <div className='bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm'>
          <div className='flex items-center gap-8'>
            <h1 className='text-2xl font-bold text-slate-800'>Home</h1>
          </div>
          <div className='flex items-center gap-4'>
            <div className='text-right'>
              <p className='text-sm text-slate-600 font-semibold'>Today's Date</p>
              <p className='text-lg font-bold text-slate-800'>{new Date().toISOString().split('T')[0]}</p>
            </div>
            <button
              onClick={() => nav('/')}
              className='flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition font-semibold shadow-md'
            >
              <Home className='w-4 h-4' />
              <span>Back to Home</span>
            </button>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-semibold shadow-md'
            >
              <LogOut className='w-4 h-4' />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className='p-8'>
          {/* Welcome Section */}
          <div className='bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 mb-8 relative overflow-hidden shadow-lg'>
            {/* Background Image - Medical Team */}
            <div className='absolute right-0 top-0 w-96 h-full'>
              <img 
                src='https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg' 
                alt='Medical Team' 
                className='w-full h-full object-cover rounded-r-2xl opacity-30'
              />
            </div>
            
            <div className='relative z-10'>
              <p className='text-xl text-slate-700 mb-2 font-semibold'>Welcome!</p>
              <h2 className='text-4xl font-bold text-slate-900 mb-4'>{userName}.</h2>
              <p className='text-slate-800 mb-2 font-medium text-lg'>
                Haven't any idea about doctors? no problem let's jumping to{' '}
                <button onClick={() => nav('/doctors')} className='font-bold text-blue-600 hover:underline'>"All Doctors"</button>{' '}
                section or{' '}
                <button onClick={() => nav('/appointment')} className='font-bold text-blue-600 hover:underline'>"Sessions"</button>
              </p>
              <p className='text-slate-800 mb-4 font-medium'>
                Track your past and future appointments history.<br />
                Also find out the expected arrival time of your doctor or medical consultant.
              </p>

              {/* Search Box */}
              <div className='mt-6'>
                <p className='font-bold text-slate-900 mb-3 text-lg'>Channel a Doctor Here</p>
                <div className='flex gap-3 max-w-2xl relative'>
                <div className='flex-1 relative'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10' />
                  <input
                    type='text'
                    placeholder='Search Doctor and We will Find The Session Available'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className='w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                  
                  {/* Search Results Dropdown */}
                  {searchQuery && filteredDoctors.length > 0 && (
                    <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 max-h-80 overflow-y-auto z-20'>
                      <div className='p-2'>
                        <p className='text-sm text-slate-600 px-3 py-2 font-semibold'>
                          Found {filteredDoctors.length} doctor(s)
                        </p>
                        {filteredDoctors.map((doctor) => (
                          <div
                            key={doctor._id}
                            onClick={() => {
                              setSearchQuery('')
                              nav('/doctors')
                            }}
                            className='p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition flex items-center gap-3'
                          >
                            <div className='w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0'>
                              {doctor.name?.charAt(0) || 'D'}
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='font-semibold text-slate-900 truncate'>{doctor.name}</p>
                              <p className='text-sm text-slate-600 truncate'>{doctor.specialization}</p>
                              <p className='text-xs text-slate-500'>{doctor.department}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {searchQuery && filteredDoctors.length === 0 && (
                    <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-20'>
                      <p className='text-slate-600 text-center'>No doctors found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg'
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Bookings Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Status Section */}
          <div>
            <h3 className='text-2xl font-bold text-slate-800 mb-6'>Status</h3>
            <div className='grid grid-cols-2 gap-4'>
              {/* All Doctors - Clickable */}
              <div 
                onClick={() => nav('/doctors')}
                className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer group'
              >
                <div className='flex items-start justify-between mb-4'>
                  <h4 className='text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition'>{doctors.length}</h4>
                  <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition'>
                    <Stethoscope className='w-6 h-6 text-blue-600 group-hover:text-white transition' />
                  </div>
                </div>
                <p className='text-slate-600 font-medium group-hover:text-blue-600 transition'>All Doctors</p>
              </div>

              {/* All Patients - Clickable */}
              <div 
                onClick={() => setViewMode('patients')}
                className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer group'
              >
                <div className='flex items-start justify-between mb-4'>
                  <h4 className='text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition'>{patients.length}</h4>
                  <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition'>
                    <Users className='w-6 h-6 text-blue-600 group-hover:text-white transition' />
                  </div>
                </div>
                <p className='text-slate-700 font-semibold group-hover:text-blue-600 transition'>All Patients</p>
              </div>

              {/* New Booking - Clickable */}
              <div 
                onClick={() => nav('/appointment')}
                className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer group'
              >
                <div className='flex items-start justify-between mb-4'>
                  <h4 className='text-3xl font-bold text-slate-900 group-hover:text-green-600 transition'>1</h4>
                  <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition'>
                    <BookOpen className='w-6 h-6 text-green-600 group-hover:text-white transition' />
                  </div>
                </div>
                <p className='text-slate-700 font-semibold group-hover:text-green-600 transition'>NewBooking</p>
              </div>

              {/* Today Sessions - Clickable */}
              <div 
                onClick={() => setViewMode('sessions')}
                className='bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer group'
              >
                <div className='flex items-start justify-between mb-4'>
                  <h4 className='text-3xl font-bold text-slate-900 group-hover:text-purple-600 transition'>
                    {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length}
                  </h4>
                  <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition'>
                    <Clock className='w-6 h-6 text-purple-600 group-hover:text-white transition' />
                  </div>
                </div>
                <p className='text-slate-700 font-semibold group-hover:text-purple-600 transition'>Today Sessions</p>
              </div>
            </div>

            {/* Pharmacy Button - Added Below */}
            <div className='mt-6'>
              <div 
                onClick={() => setViewMode('pharmacy')}
                className='bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer text-white'
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='text-2xl font-bold mb-2'>🏥 Pharmacy</h4>
                    <p className='text-green-50'>View available medicines</p>
                    <p className='text-sm text-green-100 mt-2'>{pharmacyStats.totalMedicines || 0} medicines available</p>
                  </div>
                  <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
                    <Pill className='w-8 h-8 text-white' />
                  </div>
                </div>
              </div>
            </div>
          </div>          {/* Your Upcoming Booking */}
          <div>
            <h3 className='text-2xl font-bold text-slate-800 mb-6'>Your Upcoming Booking</h3>
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <table className='w-full'>
                <thead className='bg-slate-50 border-b border-slate-200'>
                  <tr>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>Appoint. Number</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>Session Title</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>Doctor</th>
                    <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>Scheduled Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.slice(0, 5).map((apt, idx) => (
                      <tr key={apt._id || idx} className='border-b border-slate-100 hover:bg-blue-50 transition'>
                        <td className='px-4 py-4 text-sm text-slate-900 font-medium'>{idx + 1}</td>
                        <td className='px-4 py-4 text-sm text-slate-800'>{apt.reason || 'Test Session'}</td>
                        <td className='px-4 py-4 text-sm text-slate-800'>
                          {apt.doctor?.name || 'Test Doctor'}
                        </td>
                        <td className='px-4 py-4 text-sm text-slate-800'>
                          {apt.date && apt.time ? `${apt.date} ${apt.time}` : '2050-01-01 18:00'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='4' className='px-4 py-8 text-center text-slate-600 font-semibold'>
                        No upcoming appointments
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modals for Viewing Details */}
        {/* Patients Modal */}
        {viewMode === 'patients' && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setViewMode(null)}>
            <div className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden' onClick={(e) => e.stopPropagation()}>
              <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center'>
                <h3 className='text-2xl font-bold'>All Patients ({patients.length})</h3>
                <button onClick={() => setViewMode(null)} className='text-white hover:bg-white/20 rounded-lg p-2 transition'>
                  ✕
                </button>
              </div>
              <div className='p-6 overflow-y-auto max-h-[60vh]'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {patients.map((patient, idx) => (
                    <div key={patient._id || idx} className='bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition'>
                      <div className='flex items-start gap-4'>
                        <div className='w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0'>
                          {patient.name?.charAt(0) || 'P'}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h4 className='font-bold text-lg text-slate-900'>{patient.name}</h4>
                          <p className='text-sm text-slate-600'><strong>Age:</strong> {patient.age || 'N/A'}</p>
                          <p className='text-sm text-slate-600'><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
                          <p className='text-sm text-slate-600'><strong>Email:</strong> {patient.email || 'N/A'}</p>
                          <p className='text-sm text-slate-600'><strong>Address:</strong> {patient.address || 'N/A'}</p>
                          <p className='text-sm text-slate-600'><strong>Symptoms:</strong> {patient.symptoms || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Modal */}
        {viewMode === 'sessions' && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setViewMode(null)}>
            <div className='bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[80vh] overflow-hidden' onClick={(e) => e.stopPropagation()}>
              <div className='bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex justify-between items-center'>
                <h3 className='text-2xl font-bold'>Today's Sessions</h3>
                <button onClick={() => setViewMode(null)} className='text-white hover:bg-white/20 rounded-lg p-2 transition'>
                  ✕
                </button>
              </div>
              <div className='p-6 overflow-y-auto max-h-[60vh]'>
                {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length > 0 ? (
                  <div className='space-y-4'>
                    {appointments
                      .filter(apt => apt.date === new Date().toISOString().split('T')[0])
                      .map((apt, idx) => (
                        <div key={apt._id || idx} className='bg-slate-50 rounded-xl p-4 border border-slate-200'>
                          <div className='flex items-center justify-between'>
                            <div>
                              <h4 className='font-bold text-lg text-slate-900'>{apt.reason || 'Consultation'}</h4>
                              <p className='text-sm text-slate-600'>Patient: {apt.patient?.name || 'N/A'}</p>
                              <p className='text-sm text-slate-600'>Doctor: {apt.doctor?.name || 'N/A'}</p>
                            </div>
                            <div className='text-right'>
                              <p className='font-semibold text-blue-600'>{apt.time || 'N/A'}</p>
                              <span className='inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mt-2'>
                                {apt.status || 'Scheduled'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className='text-center py-12'>
                    <Clock className='w-16 h-16 text-slate-300 mx-auto mb-4' />
                    <p className='text-slate-600'>No sessions scheduled for today</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pharmacy Modal - READ ONLY */}
        {viewMode === 'pharmacy' && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setViewMode(null)}>
            <div className='bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden' onClick={(e) => e.stopPropagation()}>
              <div className='bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 flex justify-between items-center'>
                <div>
                  <h3 className='text-2xl font-bold flex items-center gap-2'>
                    <Pill className='w-7 h-7' />
                    Pharmacy - Medicines Catalog
                  </h3>
                  <p className='text-green-100 text-sm mt-1'>📖 View Only • No editing allowed</p>
                </div>
                <button onClick={() => setViewMode(null)} className='text-white hover:bg-white/20 rounded-lg p-2 transition'>
                  <X className='w-6 h-6' />
                </button>
              </div>

              {/* Search and Filter */}
              <div className='bg-slate-50 p-4 border-b border-slate-200 flex gap-4'>
                <div className='flex-1 relative'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
                  <input
                    type='text'
                    placeholder='Search medicines...'
                    value={medicineSearch}
                    onChange={(e) => setMedicineSearch(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className='px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                >
                  <option value='all'>All Categories</option>
                  <option value='Tablet'>Tablets</option>
                  <option value='Capsule'>Capsules</option>
                  <option value='Syrup'>Syrups</option>
                  <option value='Injection'>Injections</option>
                  <option value='Cream'>Creams</option>
                  <option value='Drops'>Drops</option>
                </select>
                <div className='flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg'>
                  <Package className='w-5 h-5 text-green-600' />
                  <span className='font-semibold text-slate-800'>{medicines.filter(m => 
                    (filterCategory === 'all' || m.category === filterCategory) &&
                    (!medicineSearch || m.name.toLowerCase().includes(medicineSearch.toLowerCase()))
                  ).length} items</span>
                </div>
              </div>

              {/* Medicines Table */}
              <div className='p-6 overflow-y-auto' style={{maxHeight: 'calc(85vh - 220px)'}}>
                <table className='w-full'>
                  <thead className='sticky top-0 bg-slate-100 z-10'>
                    <tr className='border-b-2 border-slate-300'>
                      <th className='text-left py-3 px-4 text-sm font-bold text-slate-700'>Medicine Name</th>
                      <th className='text-left py-3 px-4 text-sm font-bold text-slate-700'>Category</th>
                      <th className='text-left py-3 px-4 text-sm font-bold text-slate-700'>Manufacturer</th>
                      <th className='text-left py-3 px-4 text-sm font-bold text-slate-700'>Stock</th>
                      <th className='text-left py-3 px-4 text-sm font-bold text-slate-700'>Price</th>
                      <th className='text-left py-3 px-4 text-sm font-bold text-slate-700'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines
                      .filter(m => 
                        (filterCategory === 'all' || m.category === filterCategory) &&
                        (!medicineSearch || m.name.toLowerCase().includes(medicineSearch.toLowerCase()))
                      )
                      .length === 0 ? (
                      <tr>
                        <td colSpan='6' className='text-center py-12 text-slate-500'>
                          <Pill className='w-16 h-16 text-slate-300 mx-auto mb-4' />
                          <p>No medicines found</p>
                        </td>
                      </tr>
                    ) : (
                      medicines
                        .filter(m => 
                          (filterCategory === 'all' || m.category === filterCategory) &&
                          (!medicineSearch || m.name.toLowerCase().includes(medicineSearch.toLowerCase()))
                        )
                        .map((med, idx) => (
                        <tr key={med._id || idx} className='border-b border-slate-100 hover:bg-green-50 transition'>
                          <td className='py-4 px-4'>
                            <div className='flex items-center gap-3'>
                              <div className='w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <Pill className='w-6 h-6 text-green-700' />
                              </div>
                              <div>
                                <p className='font-bold text-slate-900'>{med.name}</p>
                                <p className='text-xs text-slate-500'>{med.dosage || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className='py-4 px-4'>
                            <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold'>
                              {med.category}
                            </span>
                          </td>
                          <td className='py-4 px-4'>
                            <p className='text-sm text-slate-700'>{med.manufacturer || 'N/A'}</p>
                            <p className='text-xs text-slate-500'>Batch: {med.batchNumber || 'N/A'}</p>
                          </td>
                          <td className='py-4 px-4'>
                            <p className={`font-bold text-lg ${med.stockQuantity < (med.minimumRequired || 10) ? 'text-red-600' : 'text-green-600'}`}>
                              {med.stockQuantity || 0}
                            </p>
                            <p className='text-xs text-slate-500'>units</p>
                          </td>
                          <td className='py-4 px-4'>
                            <p className='font-bold text-lg text-slate-900'>₹{med.pricePerUnit || 0}</p>
                            <p className='text-xs text-slate-500'>per unit</p>
                          </td>
                          <td className='py-4 px-4'>
                            {med.stockQuantity < (med.minimumRequired || 10) ? (
                              <div className='flex items-center gap-2'>
                                <AlertCircle className='w-5 h-5 text-red-600' />
                                <span className='px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold'>
                                  Low Stock
                                </span>
                              </div>
                            ) : (
                              <div className='flex items-center gap-2'>
                                <Eye className='w-5 h-5 text-green-600' />
                                <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold'>
                                  Available
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer with Stats */}
              <div className='bg-slate-50 p-4 border-t border-slate-200'>
                <div className='flex items-center justify-between text-sm'>
                  <p className='text-slate-600'>
                    Showing {medicines.filter(m => 
                      (filterCategory === 'all' || m.category === filterCategory) &&
                      (!medicineSearch || m.name.toLowerCase().includes(medicineSearch.toLowerCase()))
                    ).length} of {medicines.length} medicines
                  </p>
                  <div className='flex items-center gap-6'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      <span className='text-slate-700'>Available: {medicines.filter(m => m.stockQuantity >= (m.minimumRequired || 10)).length}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                      <span className='text-slate-700'>Low Stock: {medicines.filter(m => m.stockQuantity < (m.minimumRequired || 10)).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
