                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bed, Home, Search, Filter, Users, AlertCircle, 
  CheckCircle, Settings, TrendingUp, RefreshCw, Plus,
  Building2, Activity, DoorOpen
} from 'lucide-react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function WardManagement() {
  const navigate = useNavigate()
  const [beds, setBeds] = useState([])
  const [rooms, setRooms] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterRoomType, setFilterRoomType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ beds: [], patients: [] })
  const [showAddRoom, setShowAddRoom] = useState(false)

  const roomTypes = ['All', 'ICU', 'General', 'Private', 'Emergency', 'Maternity']

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    API.setToken(token)
    fetchData()
  }, [navigate, filterRoomType, filterStatus])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch beds with filters
      const params = new URLSearchParams()
      if (filterRoomType && filterRoomType !== 'All') params.append('roomType', filterRoomType)
      if (filterStatus) params.append('status', filterStatus)
      
      const [bedsRes, roomsRes, statsRes] = await Promise.all([
        API.get(`/wards/beds?${params.toString()}`),
        API.get('/wards/rooms'),
        API.get('/wards/stats')
      ])
      
      setBeds(bedsRes.data)
      setRooms(roomsRes.data)
      setStats(statsRes.data)
    } catch (err) {
      console.error('Error fetching ward data:', err)
    }
    setLoading(false)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    try {
      const res = await API.get(`/wards/search?query=${searchQuery}`)
      setSearchResults(res.data)
    } catch (err) {
      console.error('Search error:', err)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-300'
      case 'Occupied': return 'bg-red-100 text-red-700 border-red-300'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'Reserved': return 'bg-blue-100 text-blue-700 border-blue-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Available': return '🟢'
      case 'Occupied': return '🔴'
      case 'Maintenance': return '🟡'
      case 'Reserved': return '🔵'
      default: return '⚪'
    }
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

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center'>
        <div className='text-center'>
          <RefreshCw className='w-12 h-12 text-blue-600 animate-spin mx-auto mb-4' />
          <p className='text-slate-600 font-semibold'>Loading Ward Management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Header */}
      <div className='bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg'>
                <Building2 className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-slate-900'>Ward & Bed Management</h1>
                <p className='text-sm text-slate-600'>Monitor and manage hospital beds</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => navigate('/dashboard')}
                className='flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition font-semibold shadow-md'
              >
                <Home className='w-4 h-4' />
                <span>Back to Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/wards/admit')}
                className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-semibold shadow-md'
              >
                <Plus className='w-4 h-4' />
                <span>Admit Patient</span>
              </button>
              <button
                onClick={fetchData}
                className='p-2 hover:bg-slate-100 rounded-lg transition'
              >
                <RefreshCw className='w-5 h-5 text-slate-600' />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Statistics Cards */}
        {stats && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white rounded-xl p-6 shadow-lg border border-slate-100'
            >
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <p className='text-slate-600 text-sm font-medium mb-1'>Total Beds</p>
                  <h3 className='text-3xl font-bold text-slate-900'>{stats.totalBeds}</h3>
                </div>
                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <Bed className='w-6 h-6 text-blue-600' />
                </div>
              </div>
              <div className='flex items-center gap-2 text-xs text-slate-600'>
                <Activity className='w-3 h-3' />
                <span>All hospital beds</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='bg-white rounded-xl p-6 shadow-lg border border-slate-100'
            >
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <p className='text-slate-600 text-sm font-medium mb-1'>Occupied</p>
                  <h3 className='text-3xl font-bold text-red-600'>{stats.occupiedBeds}</h3>
                </div>
                <div className='w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center'>
                  <Users className='w-6 h-6 text-red-600' />
                </div>
              </div>
              <div className='flex items-center gap-2 text-xs text-slate-600'>
                <TrendingUp className='w-3 h-3' />
                <span>{stats.occupancyRate}% occupancy</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='bg-white rounded-xl p-6 shadow-lg border border-slate-100'
            >
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <p className='text-slate-600 text-sm font-medium mb-1'>Available</p>
                  <h3 className='text-3xl font-bold text-green-600'>{stats.availableBeds}</h3>
                </div>
                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                  <CheckCircle className='w-6 h-6 text-green-600' />
                </div>
              </div>
              <div className='flex items-center gap-2 text-xs text-slate-600'>
                <DoorOpen className='w-3 h-3' />
                <span>Ready for admission</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='bg-white rounded-xl p-6 shadow-lg border border-slate-100'
            >
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <p className='text-slate-600 text-sm font-medium mb-1'>Maintenance</p>
                  <h3 className='text-3xl font-bold text-yellow-600'>{stats.maintenanceBeds}</h3>
                </div>
                <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
                  <Settings className='w-6 h-6 text-yellow-600' />
                </div>
              </div>
              <div className='flex items-center gap-2 text-xs text-slate-600'>
                <AlertCircle className='w-3 h-3' />
                <span>Under maintenance</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Occupancy Chart by Room Type */}
        {stats && stats.bedsByType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='bg-white rounded-xl p-6 shadow-lg border border-slate-100 mb-8'
          >
            <h3 className='text-lg font-bold text-slate-900 mb-6 flex items-center gap-2'>
              <TrendingUp className='w-5 h-5 text-blue-600' />
              Bed Occupancy by Room Type
            </h3>
            <div className='space-y-4'>
              {Object.entries(stats.bedsByType).map(([type, data]) => (
                <div key={type}>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-3'>
                      <div className={`w-3 h-3 rounded-full ${getRoomTypeColor(type)}`}></div>
                      <span className='font-semibold text-slate-700'>{type}</span>
                    </div>
                    <span className='text-sm text-slate-600'>
                      {data.occupied} / {data.total} occupied
                    </span>
                  </div>
                  <div className='w-full bg-slate-200 rounded-full h-3 overflow-hidden'>
                    <div
                      className={`h-full ${getRoomTypeColor(type)} transition-all duration-500`}
                      style={{ width: `${(data.occupied / data.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <div className='bg-white rounded-xl p-6 shadow-lg border border-slate-100 mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Search */}
            <div className='col-span-1'>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>
                Search Bed or Patient
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder='Search by bed number or patient name...'
                  className='w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </div>

            {/* Room Type Filter */}
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>
                Room Type
              </label>
              <select
                value={filterRoomType}
                onChange={(e) => setFilterRoomType(e.target.value)}
                className='w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                {roomTypes.map(type => (
                  <option key={type} value={type === 'All' ? '' : type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>
                Bed Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>All Status</option>
                <option value='Available'>Available</option>
                <option value='Occupied'>Occupied</option>
                <option value='Maintenance'>Maintenance</option>
                <option value='Reserved'>Reserved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Beds Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden'
        >
          <div className='px-6 py-4 border-b border-slate-200 bg-slate-50'>
            <h3 className='text-lg font-bold text-slate-900 flex items-center gap-2'>
              <Bed className='w-5 h-5 text-blue-600' />
              All Beds ({beds.length})
            </h3>
          </div>
          
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-slate-50 border-b border-slate-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider'>
                    Bed Number
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider'>
                    Room Type
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider'>
                    Room Number
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider'>
                    Patient Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider'>
                    Admission Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {beds.length === 0 ? (
                  <tr>
                    <td colSpan={7} className='px-6 py-12 text-center'>
                      <AlertCircle className='w-12 h-12 text-slate-400 mx-auto mb-3' />
                      <p className='text-slate-600 font-medium'>No beds found</p>
                      <p className='text-sm text-slate-500 mt-1'>Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  beds.map((bed) => (
                    <motion.tr
                      key={bed._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='hover:bg-slate-50 transition'
                    >
                      <td className='px-6 py-4'>
                        <span className='font-semibold text-slate-900'>{bed.bedNumber}</span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white ${getRoomTypeColor(bed.room?.roomType)}`}>
                          {bed.room?.roomType || 'N/A'}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className='text-slate-700'>{bed.room?.roomNumber || 'N/A'}</span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bed.status)}`}>
                          {getStatusIcon(bed.status)}
                          {bed.status}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        {bed.patient ? (
                          <div>
                            <p className='font-medium text-slate-900'>{bed.patient.name}</p>
                            <p className='text-xs text-slate-500'>{bed.patient.age} yrs, {bed.patient.gender}</p>
                          </div>
                        ) : (
                          <span className='text-slate-400 text-sm'>—</span>
                        )}
                      </td>
                      <td className='px-6 py-4'>
                        {bed.assignedDate ? (
                          <span className='text-sm text-slate-700'>
                            {new Date(bed.assignedDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className='text-slate-400 text-sm'>—</span>
                        )}
                      </td>
                      <td className='px-6 py-4'>
                        {bed.status === 'Occupied' && bed.patient && (
                          <button
                            onClick={() => navigate(`/wards/discharge/${bed.patient._id}`)}
                            className='text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg transition font-medium'
                          >
                            Discharge
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
