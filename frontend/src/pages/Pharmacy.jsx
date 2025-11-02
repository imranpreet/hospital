import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Pill, Search, Filter, Plus, Edit, Trash2, Eye, AlertCircle, 
  TrendingUp, TrendingDown, Package, DollarSign, Calendar,
  ChevronLeft, ChevronRight, X, ShoppingCart, FileText,
  Home, Users, Settings, CreditCard, BarChart3, Grid, List, LogOut
} from 'lucide-react'
import { 
  PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend
} from 'recharts'
import axios from 'axios'
import Header from '../components/Header'
import BillingModal from '../components/BillingModal'

export default function Pharmacy() {
  const nav = useNavigate()
  const [medicines, setMedicines] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showBillingModal, setShowBillingModal] = useState(false)
  const [showExpiryModal, setShowExpiryModal] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const userRole = localStorage.getItem('userRole')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState('name')
  const [lowStockAlert, setLowStockAlert] = useState([])
  const [expiringAlert, setExpiringAlert] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalMedicines, setTotalMedicines] = useState(0)
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    nav('/login')
  }
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tablet',
    batchNumber: '',
    manufacturer: '',
    supplier: '',
    purchaseDate: '',
    expiryDate: '',
    pricePerUnit: '',
    stockQuantity: '',
    minimumRequired: '10',
    location: 'Main Pharmacy',
    addedBy: 'Admin',
    description: '',
    dosage: '',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
  })

  useEffect(() => {
    fetchMedicines()
    fetchStats()
    fetchAlerts()
  }, [filterCategory, filterStatus, searchTerm, sortBy, currentPage])
  
  const fetchAlerts = async () => {
    try {
      const [lowStockRes, expiringRes] = await Promise.all([
        axios.get('http://localhost:5000/api/medicines/low-stock'),
        axios.get('http://localhost:5000/api/medicines/expiring-soon')
      ])
      
      if (lowStockRes.data.success) setLowStockAlert(lowStockRes.data.data)
      if (expiringRes.data.success) setExpiringAlert(expiringRes.data.data)
    } catch (error) {
      console.error('Error fetching alerts:', error)
    }
  }

  const fetchMedicines = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        sortBy
      })
      
      if (filterCategory !== 'all') params.append('category', filterCategory)
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await axios.get(`http://localhost:5000/api/medicines?${params}`)
      if (response.data.success) {
        setMedicines(response.data.data)
        // Set pagination data from backend response
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages)
          setTotalMedicines(response.data.pagination.total)
        }
      }
    } catch (error) {
      console.error('Error fetching medicines:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/medicines/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleAddMedicine = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.pricePerUnit || !formData.stockQuantity) {
      alert('❌ Please fill all required fields')
      return
    }
    
    // Validate positive numbers
    if (formData.pricePerUnit <= 0) {
      alert('❌ Price must be greater than 0')
      return
    }
    
    if (formData.stockQuantity < 0) {
      alert('❌ Stock quantity cannot be negative')
      return
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/medicines', formData)
      if (response.data.success) {
        alert('✅ Medicine added successfully!')
        setShowAddModal(false)
        resetForm()
        // Refresh the medicines list and stats
        await fetchMedicines()
        await fetchStats()
        await fetchAlerts()
      }
    } catch (error) {
      console.error('Error adding medicine:', error)
      alert('❌ Failed to add medicine: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleUpdateMedicine = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`http://localhost:5000/api/medicines/${selectedMedicine._id}`, formData)
      if (response.data.success) {
        alert('✅ Medicine updated successfully!')
        setShowEditModal(false)
        resetForm()
        // Refresh the medicines list and stats
        await fetchMedicines()
        await fetchStats()
        await fetchAlerts()
      }
    } catch (error) {
      console.error('Error updating medicine:', error)
      alert('❌ Failed to update medicine: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return
    
    try {
      const response = await axios.delete(`http://localhost:5000/api/medicines/${id}`)
      if (response.data.success) {
        alert('✅ Medicine deleted successfully!')
        // Refresh the medicines list and stats
        await fetchMedicines()
        await fetchStats()
        await fetchAlerts()
      }
    } catch (error) {
      console.error('Error deleting medicine:', error)
      alert('❌ Failed to delete medicine: ' + (error.response?.data?.message || error.message))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Tablet',
      batchNumber: '',
      manufacturer: '',
      supplier: '',
      purchaseDate: '',
      expiryDate: '',
      pricePerUnit: '',
      stockQuantity: '',
      minimumRequired: '10',
      location: 'Main Pharmacy',
      addedBy: 'Admin',
      description: '',
      dosage: '',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'
    })
    setSelectedMedicine(null)
  }

  const openEditModal = (medicine) => {
    setSelectedMedicine(medicine)
    setFormData({
      name: medicine.name,
      category: medicine.category,
      batchNumber: medicine.batchNumber,
      manufacturer: medicine.manufacturer,
      supplier: medicine.supplier,
      purchaseDate: new Date(medicine.purchaseDate).toISOString().split('T')[0],
      expiryDate: new Date(medicine.expiryDate).toISOString().split('T')[0],
      pricePerUnit: medicine.pricePerUnit,
      stockQuantity: medicine.stockQuantity,
      minimumRequired: medicine.minimumRequired,
      location: medicine.location,
      addedBy: medicine.addedBy,
      description: medicine.description || '',
      dosage: medicine.dosage || '',
      image: medicine.image
    })
    setShowEditModal(true)
  }

  // Category distribution data for radar chart
  const categoryData = stats.categoryStats?.map(cat => ({
    category: cat._id,
    medicines: cat.count,
    stock: cat.totalStock
  })) || []

  // Product distribution data
  const distributionData = stats.categoryStats?.slice(0, 5).map(cat => ({
    name: cat._id,
    value: cat.count
  })) || []

  // Sales trend data (mock for now)
  const salesData = [
    { day: 'Mon', sales: 15000 },
    { day: 'Tue', sales: 22000 },
    { day: 'Wed', sales: 18000 },
    { day: 'Thu', sales: 28000 },
    { day: 'Fri', sales: 25000 },
    { day: 'Sat', sales: 30000 },
    { day: 'Sun', sales: 20000 }
  ]

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800'
      case 'Low Stock': return 'bg-orange-100 text-orange-800'
      case 'Out of Stock': return 'bg-red-100 text-red-800'
      case 'Expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  // No need for client-side pagination since backend handles it
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-slate-600'>Loading Pharmacy...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#E8F4F8]'>
      {/* Header/Navbar */}
      <Header />
      
      <div className='flex'>
        {/* Sidebar */}
        <div className='w-64 bg-[#0D4D4D] min-h-screen p-6 text-white'>
          {/* Logo */}
          <div className='flex items-center gap-3 mb-10'>
            <div className='w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center'>
              <Pill className='w-6 h-6' />
            </div>
            <span className='text-xl font-bold'>Pharmacy</span>
          </div>

          {/* Menu */}
          <div className='space-y-1'>
            <div className='text-xs text-white/50 uppercase tracking-wide mb-3 font-semibold'>Main Menu</div>
            
            <button 
              onClick={() => nav('/dashboard')}
              className='w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-xl transition-all text-sm'
            >
              <Home className='w-4 h-4' />
              <span>Dashboard</span>
            </button>
            
            <button 
              onClick={() => nav('/pharmacy')}
              className='w-full flex items-center gap-3 px-4 py-2.5 bg-[#0A3D3D] text-white rounded-xl transition-all text-sm font-medium'
            >
              <Package className='w-4 h-4' />
              <span>Products</span>
            </button>
            
            <button 
              onClick={() => setFilterCategory(filterCategory === 'all' ? 'Tablet' : 'all')}
              className='w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-xl transition-all text-sm'
            >
              <Grid className='w-4 h-4' />
              <span>Categories</span>
            </button>

            <div className='text-xs text-white/50 uppercase tracking-wide mb-3 mt-6 font-semibold'>Leads</div>
            
            <button 
              onClick={() => alert('Orders feature coming soon!')}
              className='w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-xl transition-all text-sm'
            >
              <ShoppingCart className='w-4 h-4' />
              <span>Orders</span>
            </button>
            
            <button 
              onClick={() => setShowBillingModal(true)}
              className='w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-xl transition-all text-sm'
            >
              <BarChart3 className='w-4 h-4' />
              <span>Sales</span>
            </button>
            
            <button 
              onClick={() => alert('Customer management coming soon!')}
              className='w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-xl transition-all text-sm'
            >
              <Users className='w-4 h-4' />
              <span>Customers</span>
            </button>

            <div className='text-xs text-white/50 uppercase tracking-wide mb-3 mt-6 font-semibold'>Comms</div>
            
            <button 
              onClick={() => alert('Payments feature coming soon!')}
              className='w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-xl transition-all text-sm'
            >
              <CreditCard className='w-4 h-4' />
              <span>Payments</span>
            </button>
            
            <button 
              onClick={() => alert('Reports feature coming soon!')}
              className='w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-xl transition-all text-sm'
            >
              <FileText className='w-4 h-4' />
              <span>Reports</span>
            </button>
            
            <button 
              onClick={() => alert('Settings feature coming soon!')}
              className='w-full flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 rounded-xl transition-all text-sm'
            >
              <Settings className='w-4 h-4' />
              <span>Settings</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className='w-full flex items-center gap-3 px-4 py-2.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl transition-all mt-4 text-sm font-medium'
            >
              <LogOut className='w-4 h-4' />
              <span>Logout</span>
            </button>
          </div>

          {/* Profile Card */}
          <div className='mt-auto pt-8'>
            <div className='bg-[#1A6B6B] rounded-2xl p-4'>
              <div className='flex items-center gap-3 mb-3'>
                <img 
                  src='https://ui-avatars.com/api/?name=Admin&background=0EA5E9&color=fff'
                  alt='Admin'
                  className='w-12 h-12 rounded-full'
                />
                <div className='flex-1'>
                  <div className='text-xs text-emerald-300'>75%</div>
                  <div className='text-sm font-semibold'>Complete Profile</div>
                </div>
              </div>
              <p className='text-xs text-white/70 mb-3'>Complete Your Profile to unlock features</p>
              <button className='w-full py-2 bg-[#0D4D4D] rounded-xl text-sm font-semibold hover:bg-[#0A3D3D] transition-all'>
                Verify Identity
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 p-8 bg-[#F5F9FA]'>
          {/* Header */}
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 mb-1'>Products Inventory</h1>
            </div>
            
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <Search className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm w-64'
                />
              </div>
              
              <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2'>
                <span className='text-sm font-medium text-gray-600'>EN</span>
              </div>
              
              <div className='flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-2'>
                <img 
                  src='https://ui-avatars.com/api/?name=Budiono+Siregar&background=0D4D4D&color=fff'
                  alt='User'
                  className='w-8 h-8 rounded-full'
                />
                <div>
                  <div className='text-sm font-semibold text-gray-900'>Budiono Siregar</div>
                  <div className='text-xs text-gray-500'>budiono@gmail.com</div>
                </div>
              </div>
              
              <button
                onClick={() => setShowBillingModal(true)}
                className='flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium text-sm'
              >
                <ShoppingCart className='w-5 h-5' />
                New Sale
              </button>
              
              <button
                onClick={() => setShowExpiryModal(true)}
                className='flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium text-sm relative'
              >
                <AlertCircle className='w-5 h-5' />
                Expiry
                {expiringAlert.length > 0 && (
                  <span className='absolute -top-2 -right-2 bg-white text-red-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-red-600'>
                    {expiringAlert.length}
                  </span>
                )}
              </button>
              
              {userRole === 'admin' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className='flex items-center gap-2 px-5 py-2 bg-[#0D4D4D] text-white rounded-lg hover:bg-[#0A3D3D] transition-all font-medium text-sm'
                >
                  <Plus className='w-5 h-5' />
                  Add Product
                </button>
              )}
            </div>
          </div>
          
          {/* Alert Banners */}
          {(lowStockAlert.length > 0 || expiringAlert.length > 0) && (
            <div className='space-y-3 mb-6'>
              {lowStockAlert.length > 0 && (
                <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <AlertCircle className='w-5 h-5 text-red-600' />
                    <div>
                      <div className='font-semibold text-red-900'>Low Stock Alert!</div>
                      <div className='text-sm text-red-700'>
                        {lowStockAlert.length} medicine(s) are running low or out of stock
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {expiringAlert.length > 0 && (
                <div className='bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg'>
                  <div className='flex items-center gap-3'>
                    <Calendar className='w-5 h-5 text-amber-600' />
                    <div>
                      <div className='font-semibold text-amber-900'>Expiry Alert!</div>
                      <div className='text-sm text-amber-700'>
                        {expiringAlert.length} medicine(s) expiring within 30 days
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats Cards & Charts Row */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6'>
            {/* Product Distribution */}
            <div className='bg-white rounded-2xl shadow-sm p-5 border border-gray-100'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-base font-bold text-gray-900'>Product Distribution</h3>
                <button className='text-gray-400 hover:text-gray-600'>
                  <Filter className='w-4 h-4' />
                </button>
              </div>
              <div className='text-xs text-gray-500 mb-3'>Categories</div>
              <ResponsiveContainer width='100%' height={180}>
                <RadarChart data={categoryData.slice(0, 6)}>
                  <PolarGrid stroke='#d1d5db' />
                  <PolarAngleAxis dataKey='category' tick={{ fontSize: 9, fill: '#6b7280' }} />
                  <PolarRadiusAxis tick={{ fontSize: 9 }} />
                  <Radar name='Medicines' dataKey='medicines' stroke='#14b8a6' fill='#14b8a6' fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
              <div className='text-center text-xs text-gray-500 mt-2'>Categories</div>
            </div>

            {/* Top-Selling Products */}
            <div className='bg-white rounded-2xl shadow-sm p-5 border border-gray-100'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-base font-bold text-gray-900'>Top-Selling Products</h3>
                <button className='text-gray-400 hover:text-gray-600'>
                  <Filter className='w-4 h-4' />
                </button>
              </div>
              <div className='grid grid-cols-4 gap-2 mb-3'>
                {stats.topSelling?.slice(0, 4).map((med, idx) => (
                  <div key={idx} className='aspect-square rounded-lg overflow-hidden border border-gray-100'>
                    <img 
                      src={med.image} 
                      alt={med.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                ))}
              </div>
              <div className='bg-gray-50 rounded-xl p-3 mt-3'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-xs font-semibold text-gray-900'>Out of Stock Products</span>
                  <button className='text-gray-400'>
                    <AlertCircle className='w-3.5 h-3.5' />
                  </button>
                </div>
                <div className='space-y-1.5'>
                  {medicines.filter(m => m.status === 'Out of Stock').slice(0, 5).map((med, idx) => (
                    <div key={idx} className='flex items-center justify-between text-xs'>
                      <div>
                        <div className='font-medium text-gray-900'>{med.medicineId}</div>
                        <div className='text-gray-500 text-[10px]'>{med.name}</div>
                      </div>
                      <div className='text-right'>
                        <div className='font-semibold text-gray-900 text-[10px]'>{med.name}</div>
                        <div className='text-gray-500 text-[10px]'>{new Date(med.expiryDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Product Sales */}
            <div className='bg-white rounded-2xl shadow-sm p-5 border border-gray-100'>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-base font-bold text-gray-900'>Total Product Sales</h3>
                <button className='text-gray-400 hover:text-gray-600'>
                  <Filter className='w-4 h-4' />
                </button>
              </div>
              <ResponsiveContainer width='100%' height={180}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id='colorSales' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#14b8a6' stopOpacity={0.3}/>
                      <stop offset='95%' stopColor='#14b8a6' stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                  <XAxis dataKey='day' tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Area type='monotone' dataKey='sales' stroke='#14b8a6' strokeWidth={2} fillOpacity={1} fill='url(#colorSales)' />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Products List */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            {/* List Header with Filters */}
            <div className='p-5 border-b border-gray-100'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <h2 className='text-lg font-bold text-gray-900'>Products List</h2>
                </div>
                
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <Search className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    <input
                      type='text'
                      placeholder='Search...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500'
                    />
                  </div>
                  
                  <button className='flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all'>
                    <Filter className='w-3.5 h-3.5' />
                    Filter
                  </button>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className='px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500'
                  >
                    <option value='name'>Sort By</option>
                    <option value='pricePerUnit'>Price</option>
                    <option value='stockQuantity'>Stock</option>
                    <option value='expiryDate'>Expiry</option>
                  </select>
                  
                  <button className='text-gray-400 hover:text-gray-600'>
                    <Filter className='w-4 h-4' />
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='bg-gray-50/50 border-b border-gray-100'>
                    <th className='px-5 py-3 text-left'>
                      <input type='checkbox' className='rounded border-gray-300' />
                    </th>
                    <th className='px-5 py-3 text-left text-xs font-semibold text-gray-600'>Name</th>
                    <th className='px-5 py-3 text-left text-xs font-semibold text-gray-600'>Product Name</th>
                    <th className='px-5 py-3 text-left text-xs font-semibold text-gray-600'>Category</th>
                    <th className='px-5 py-3 text-left text-xs font-semibold text-gray-600'>Quantity</th>
                    <th className='px-5 py-3 text-left text-xs font-semibold text-gray-600'>Total Price</th>
                    <th className='px-5 py-3 text-left text-xs font-semibold text-gray-600'>Expiry Date</th>
                    <th className='px-5 py-3 text-left text-xs font-semibold text-gray-600'></th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine, idx) => (
                    <tr key={medicine._id} className='border-b border-gray-50 hover:bg-gray-50/50 transition-colors'>
                      <td className='px-5 py-3'>
                        <input type='checkbox' className='rounded border-gray-300' />
                      </td>
                      <td className='px-5 py-3'>
                        <div className='flex items-center gap-3'>
                          <img 
                            src={medicine.image || 'https://ui-avatars.com/api/?name=' + medicine.name}
                            alt={medicine.name}
                            className='w-9 h-9 rounded-full object-cover'
                          />
                          <span className='text-sm font-medium text-gray-900'>{medicine.manufacturer}</span>
                        </div>
                      </td>
                      <td className='px-5 py-3'>
                        <div className='text-sm font-medium text-gray-900'>{medicine.name}</div>
                        <div className='text-xs text-gray-500'>{medicine.medicineId}</div>
                      </td>
                      <td className='px-5 py-3'>
                        <span className='text-sm text-gray-700'>{medicine.category}</span>
                      </td>
                      <td className='px-5 py-3'>
                        <div className='flex items-center gap-2'>
                          <span className={`w-2 h-2 rounded-full ${
                            medicine.stockQuantity > medicine.minimumRequired ? 'bg-emerald-500' :
                            medicine.stockQuantity > 0 ? 'bg-amber-500' : 'bg-red-500'
                          }`}></span>
                          <span className='text-sm font-semibold text-gray-900'>{medicine.stockQuantity}</span>
                        </div>
                      </td>
                      <td className='px-5 py-3'>
                        <span className='text-sm font-semibold text-gray-900'>${(medicine.pricePerUnit * medicine.stockQuantity).toFixed(2)}</span>
                      </td>
                      <td className='px-5 py-3'>
                        <div className='text-sm text-gray-700'>
                          {new Date(medicine.expiryDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className='px-5 py-3'>
                        <div className='flex items-center gap-1'>
                          {userRole === 'admin' && (
                            <button
                              onClick={() => openEditModal(medicine)}
                              className='p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all'
                            >
                              <Edit className='w-4 h-4' />
                            </button>
                          )}
                          <button
                            onClick={() => alert('View details')}
                            className='p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all'
                          >
                            <Eye className='w-4 h-4' />
                          </button>
                          {userRole === 'admin' && (
                            <button
                              onClick={() => handleDeleteMedicine(medicine._id)}
                              className='p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className='px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30'>
              <div className='text-sm text-gray-600'>
                Showing {startIndex + 1} to {Math.min(endIndex, totalMedicines)} of {totalMedicines} Entries
              </div>
              
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className='px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white'
                >
                  Prev
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  const pageNum = idx + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 text-sm rounded-lg transition-all ${
                        currentPage === pageNum 
                          ? 'bg-[#0D4D4D] text-white font-medium' 
                          : 'border border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                {totalPages > 5 && <span className='px-2 text-gray-400'>...</span>}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className='px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white'
                >
                  Next
                </button>
                
                <select
                  value={itemsPerPage}
                  className='px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white'
                >
                  <option value='3'>Show: 3</option>
                  <option value='5'>Show: 5</option>
                  <option value='10'>Show: 10</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Medicine Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className='fixed inset-0 z-50 flex items-center justify-center p-4'
            >
              <div className='bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
                <div className='sticky top-0 bg-gradient-to-r from-[#0D4D4D] to-[#1A6B6B] text-white p-6 flex items-center justify-between'>
                  <h2 className='text-2xl font-bold'>Add New Medicine</h2>
                  <button onClick={() => setShowAddModal(false)} className='p-2 hover:bg-white/20 rounded-lg'>
                    <X className='w-6 h-6' />
                  </button>
                </div>
                
                <form onSubmit={handleAddMedicine} className='p-6 space-y-6'>
                  <div className='grid grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Medicine Name *</label>
                      <input
                        type='text'
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      >
                        <option value='Tablet'>Tablet</option>
                        <option value='Capsule'>Capsule</option>
                        <option value='Syrup'>Syrup</option>
                        <option value='Injection'>Injection</option>
                        <option value='Ointment'>Ointment</option>
                        <option value='Drops'>Drops</option>
                        <option value='Inhaler'>Inhaler</option>
                        <option value='Cream'>Cream</option>
                        <option value='Other'>Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Batch Number *</label>
                      <input
                        type='text'
                        required
                        value={formData.batchNumber}
                        onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Manufacturer *</label>
                      <input
                        type='text'
                        required
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Supplier *</label>
                      <input
                        type='text'
                        required
                        value={formData.supplier}
                        onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Purchase Date *</label>
                      <input
                        type='date'
                        required
                        value={formData.purchaseDate}
                        onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Expiry Date *</label>
                      <input
                        type='date'
                        required
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Price Per Unit *</label>
                      <input
                        type='number'
                        required
                        step='0.01'
                        value={formData.pricePerUnit}
                        onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Stock Quantity *</label>
                      <input
                        type='number'
                        required
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Minimum Required *</label>
                      <input
                        type='number'
                        required
                        value={formData.minimumRequired}
                        onChange={(e) => setFormData({...formData, minimumRequired: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Location</label>
                      <input
                        type='text'
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Dosage</label>
                      <input
                        type='text'
                        value={formData.dosage}
                        onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                        placeholder='e.g., 500mg, 2x daily'
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows='3'
                      className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                    ></textarea>
                  </div>
                  
                  <div className='flex gap-4'>
                    <button
                      type='button'
                      onClick={() => setShowAddModal(false)}
                      className='flex-1 py-3 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-all'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='flex-1 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-all'
                    >
                      Add Medicine
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Medicine Modal (similar to Add Modal) */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className='fixed inset-0 z-50 flex items-center justify-center p-4'
            >
              <div className='bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
                <div className='sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between'>
                  <h2 className='text-2xl font-bold'>Edit Medicine</h2>
                  <button onClick={() => setShowEditModal(false)} className='p-2 hover:bg-white/20 rounded-lg'>
                    <X className='w-6 h-6' />
                  </button>
                </div>
                
                <form onSubmit={handleUpdateMedicine} className='p-6 space-y-6'>
                  {/* Same form fields as Add Modal */}
                  <div className='grid grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Medicine Name *</label>
                      <input
                        type='text'
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      >
                        <option value='Tablet'>Tablet</option>
                        <option value='Capsule'>Capsule</option>
                        <option value='Syrup'>Syrup</option>
                        <option value='Injection'>Injection</option>
                        <option value='Ointment'>Ointment</option>
                        <option value='Drops'>Drops</option>
                        <option value='Inhaler'>Inhaler</option>
                        <option value='Cream'>Cream</option>
                        <option value='Other'>Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Stock Quantity *</label>
                      <input
                        type='number'
                        required
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      />
                    </div>
                    
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>Price Per Unit *</label>
                      <input
                        type='number'
                        required
                        step='0.01'
                        value={formData.pricePerUnit}
                        onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                        className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                      />
                    </div>
                  </div>
                  
                  <div className='flex gap-4'>
                    <button
                      type='button'
                      onClick={() => setShowEditModal(false)}
                      className='flex-1 py-3 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-all'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all'
                    >
                      Update Medicine
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Billing Modal */}
      <BillingModal
        show={showBillingModal}
        onClose={() => setShowBillingModal(false)}
        medicines={medicines}
        onSaleComplete={() => {
          fetchMedicines()
          fetchStats()
          fetchAlerts()
        }}
      />
      
      {/* Expiry Modal */}
      <AnimatePresence>
        {showExpiryModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExpiryModal(false)}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className='fixed inset-0 z-50 flex items-center justify-center p-4'
            >
              <div className='bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col'>
                <div className='bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 flex items-center justify-between'>
                  <div>
                    <h2 className='text-2xl font-bold flex items-center gap-3'>
                      <AlertCircle className='w-8 h-8' />
                      Medicine Expiry Alert
                    </h2>
                    <p className='text-red-100 text-sm mt-1'>Expired and Soon-to-Expire Medicines</p>
                  </div>
                  <button 
                    onClick={() => setShowExpiryModal(false)} 
                    className='p-2 hover:bg-white/20 rounded-lg transition-all'
                  >
                    <X className='w-6 h-6' />
                  </button>
                </div>
                
                <div className='flex-1 overflow-y-auto p-6'>
                  {/* Already Expired Medicines */}
                  {medicines.filter(m => new Date(m.expiryDate) < new Date()).length > 0 && (
                    <div className='mb-8'>
                      <div className='flex items-center gap-3 mb-4'>
                        <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center'>
                          <X className='w-6 h-6 text-red-600' />
                        </div>
                        <div>
                          <h3 className='text-lg font-bold text-gray-900'>Expired Medicines</h3>
                          <p className='text-sm text-red-600'>
                            {medicines.filter(m => new Date(m.expiryDate) < new Date()).length} medicine(s) have already expired
                          </p>
                        </div>
                      </div>
                      
                      <div className='space-y-3'>
                        {medicines
                          .filter(m => new Date(m.expiryDate) < new Date())
                          .map((medicine) => {
                            const daysExpired = Math.floor((new Date() - new Date(medicine.expiryDate)) / (1000 * 60 * 60 * 24))
                            return (
                              <div key={medicine._id} className='bg-red-50 border-2 border-red-200 rounded-xl p-4 hover:shadow-md transition-all'>
                                <div className='flex items-center gap-4'>
                                  <img 
                                    src={medicine.image || 'https://ui-avatars.com/api/?name=' + medicine.name}
                                    alt={medicine.name}
                                    className='w-16 h-16 rounded-lg object-cover'
                                  />
                                  <div className='flex-1'>
                                    <div className='flex items-start justify-between'>
                                      <div>
                                        <h4 className='font-bold text-gray-900 text-lg'>{medicine.name}</h4>
                                        <p className='text-sm text-gray-600'>
                                          {medicine.category} • Batch: {medicine.batchNumber}
                                        </p>
                                      </div>
                                      <div className='text-right'>
                                        <div className='text-xs font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full'>
                                          EXPIRED
                                        </div>
                                      </div>
                                    </div>
                                    <div className='mt-3 grid grid-cols-4 gap-3 text-sm'>
                                      <div>
                                        <div className='text-gray-500 text-xs'>Expiry Date</div>
                                        <div className='font-semibold text-red-600'>
                                          {new Date(medicine.expiryDate).toLocaleDateString()}
                                        </div>
                                      </div>
                                      <div>
                                        <div className='text-gray-500 text-xs'>Days Expired</div>
                                        <div className='font-semibold text-red-600'>{daysExpired} days ago</div>
                                      </div>
                                      <div>
                                        <div className='text-gray-500 text-xs'>Stock Quantity</div>
                                        <div className='font-semibold text-gray-900'>{medicine.stockQuantity} units</div>
                                      </div>
                                      <div>
                                        <div className='text-gray-500 text-xs'>Total Value</div>
                                        <div className='font-semibold text-gray-900'>
                                          ${(medicine.stockQuantity * medicine.pricePerUnit).toFixed(2)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}
                  
                  {/* Soon to Expire Medicines (Next 30 Days) */}
                  {expiringAlert.length > 0 && (
                    <div>
                      <div className='flex items-center gap-3 mb-4'>
                        <div className='w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center'>
                          <AlertCircle className='w-6 h-6 text-amber-600' />
                        </div>
                        <div>
                          <h3 className='text-lg font-bold text-gray-900'>Soon to Expire</h3>
                          <p className='text-sm text-amber-600'>
                            {expiringAlert.length} medicine(s) expiring within 30 days
                          </p>
                        </div>
                      </div>
                      
                      <div className='space-y-3'>
                        {expiringAlert.map((medicine) => {
                          const daysLeft = Math.ceil((new Date(medicine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
                          return (
                            <div key={medicine._id} className='bg-amber-50 border-2 border-amber-200 rounded-xl p-4 hover:shadow-md transition-all'>
                              <div className='flex items-center gap-4'>
                                <img 
                                  src={medicine.image || 'https://ui-avatars.com/api/?name=' + medicine.name}
                                  alt={medicine.name}
                                  className='w-16 h-16 rounded-lg object-cover'
                                />
                                <div className='flex-1'>
                                  <div className='flex items-start justify-between'>
                                    <div>
                                      <h4 className='font-bold text-gray-900 text-lg'>{medicine.name}</h4>
                                      <p className='text-sm text-gray-600'>
                                        {medicine.category} • Batch: {medicine.batchNumber}
                                      </p>
                                    </div>
                                    <div className='text-right'>
                                      <div className='text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full'>
                                        {daysLeft} DAYS LEFT
                                      </div>
                                    </div>
                                  </div>
                                  <div className='mt-3 grid grid-cols-4 gap-3 text-sm'>
                                    <div>
                                      <div className='text-gray-500 text-xs'>Expiry Date</div>
                                      <div className='font-semibold text-amber-600'>
                                        {new Date(medicine.expiryDate).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div>
                                      <div className='text-gray-500 text-xs'>Days Left</div>
                                      <div className='font-semibold text-amber-600'>{daysLeft} days</div>
                                    </div>
                                    <div>
                                      <div className='text-gray-500 text-xs'>Stock Quantity</div>
                                      <div className='font-semibold text-gray-900'>{medicine.stockQuantity} units</div>
                                    </div>
                                    <div>
                                      <div className='text-gray-500 text-xs'>Total Value</div>
                                      <div className='font-semibold text-gray-900'>
                                        ${(medicine.stockQuantity * medicine.pricePerUnit).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* No Expiry Issues */}
                  {medicines.filter(m => new Date(m.expiryDate) < new Date()).length === 0 && 
                   expiringAlert.length === 0 && (
                    <div className='text-center py-12'>
                      <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <CheckCircle className='w-10 h-10 text-green-600' />
                      </div>
                      <h3 className='text-xl font-bold text-gray-900 mb-2'>All Clear!</h3>
                      <p className='text-gray-600'>No medicines are expired or expiring soon.</p>
                    </div>
                  )}
                </div>
                
                <div className='p-6 bg-gray-50 border-t border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <div className='text-sm text-gray-600'>
                      <strong>Total Medicines at Risk:</strong> {
                        medicines.filter(m => new Date(m.expiryDate) < new Date()).length + 
                        expiringAlert.length
                      }
                    </div>
                    <button
                      onClick={() => setShowExpiryModal(false)}
                      className='px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all'
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
