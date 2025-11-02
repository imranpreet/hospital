import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingCart, DollarSign, User, Phone, CreditCard } from 'lucide-react'
import axios from 'axios'

export default function BillingModal({ show, onClose, medicines, onSaleComplete }) {
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [discount, setDiscount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [notes, setNotes] = useState('')
  
  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    m.stockQuantity > 0
  )
  
  const addToCart = (medicine) => {
    const existing = cart.find(item => item.medicineId === medicine._id)
    
    if (existing) {
      if (existing.quantity < medicine.stockQuantity) {
        setCart(cart.map(item => 
          item.medicineId === medicine._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      } else {
        alert(`Only ${medicine.stockQuantity} units available`)
      }
    } else {
      setCart([...cart, {
        medicineId: medicine._id,
        medicineName: medicine.name,
        pricePerUnit: medicine.pricePerUnit,
        quantity: 1,
        maxStock: medicine.stockQuantity
      }])
    }
  }
  
  const updateQuantity = (medicineId, newQuantity) => {
    const item = cart.find(c => c.medicineId === medicineId)
    
    if (newQuantity > item.maxStock) {
      alert(`Only ${item.maxStock} units available`)
      return
    }
    
    if (newQuantity <= 0) {
      setCart(cart.filter(c => c.medicineId !== medicineId))
    } else {
      setCart(cart.map(c => 
        c.medicineId === medicineId ? { ...c, quantity: newQuantity } : c
      ))
    }
  }
  
  const removeFromCart = (medicineId) => {
    setCart(cart.filter(c => c.medicineId !== medicineId))
  }
  
  const subtotal = cart.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0)
  const total = subtotal - discount
  
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty')
      return
    }
    
    if (!customerName.trim()) {
      alert('Please enter customer name')
      return
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/sales', {
        items: cart,
        discount,
        customerName,
        customerPhone,
        paymentMethod,
        notes
      })
      
      if (response.data.success) {
        alert('Sale completed successfully!')
        setCart([])
        setCustomerName('')
        setCustomerPhone('')
        setDiscount(0)
        setNotes('')
        onSaleComplete()
        onClose()
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error.response?.data?.message || 'Failed to complete sale')
    }
  }
  
  if (!show) return null
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className='fixed inset-0 z-50 flex items-center justify-center p-4'
      >
        <div className='bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col'>
          {/* Header */}
          <div className='bg-gradient-to-r from-[#0D4D4D] to-[#1A6B6B] text-white p-6 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <ShoppingCart className='w-7 h-7' />
              <h2 className='text-2xl font-bold'>Point of Sale - Billing</h2>
            </div>
            <button onClick={onClose} className='p-2 hover:bg-white/20 rounded-lg transition-all'>
              <X className='w-6 h-6' />
            </button>
          </div>
          
          <div className='flex-1 overflow-auto p-6'>
            <div className='grid grid-cols-2 gap-6'>
              {/* Left: Medicine Selection */}
              <div>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>Select Medicines</h3>
                
                <input
                  type='text'
                  placeholder='Search medicines...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-teal-500'
                />
                
                <div className='space-y-2 max-h-[400px] overflow-y-auto'>
                  {filteredMedicines.map((med) => (
                    <div
                      key={med._id}
                      className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer'
                      onClick={() => addToCart(med)}
                    >
                      <div className='flex-1'>
                        <div className='font-medium text-gray-900'>{med.name}</div>
                        <div className='text-sm text-gray-500'>
                          ${med.pricePerUnit} | Stock: {med.stockQuantity}
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(med); }}
                        className='p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700'
                      >
                        <Plus className='w-4 h-4' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right: Cart & Billing */}
              <div>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>Cart ({cart.length} items)</h3>
                
                <div className='space-y-3 max-h-[300px] overflow-y-auto mb-4'>
                  {cart.map((item) => (
                    <div key={item.medicineId} className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                      <div className='flex-1'>
                        <div className='font-medium text-gray-900'>{item.medicineName}</div>
                        <div className='text-sm text-gray-500'>${item.pricePerUnit} each</div>
                      </div>
                      
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                          className='p-1 bg-gray-200 rounded hover:bg-gray-300'
                        >
                          <Minus className='w-4 h-4' />
                        </button>
                        <input
                          type='number'
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.medicineId, parseInt(e.target.value) || 0)}
                          className='w-16 text-center border border-gray-300 rounded px-2 py-1'
                        />
                        <button
                          onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                          className='p-1 bg-gray-200 rounded hover:bg-gray-300'
                        >
                          <Plus className='w-4 h-4' />
                        </button>
                      </div>
                      
                      <div className='text-right min-w-[80px]'>
                        <div className='font-bold text-gray-900'>${(item.pricePerUnit * item.quantity).toFixed(2)}</div>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.medicineId)}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  ))}
                  
                  {cart.length === 0 && (
                    <div className='text-center text-gray-500 py-8'>
                      Cart is empty. Add medicines to start billing.
                    </div>
                  )}
                </div>
                
                {/* Customer Info */}
                <div className='space-y-3 mb-4'>
                  <div className='relative'>
                    <User className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    <input
                      type='text'
                      placeholder='Customer Name *'
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
                    />
                  </div>
                  
                  <div className='relative'>
                    <Phone className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    <input
                      type='text'
                      placeholder='Customer Phone (optional)'
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
                    />
                  </div>
                  
                  <div className='relative'>
                    <CreditCard className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500'
                    >
                      <option value='Cash'>Cash</option>
                      <option value='Card'>Card</option>
                      <option value='UPI'>UPI</option>
                      <option value='Insurance'>Insurance</option>
                    </select>
                  </div>
                </div>
                
                {/* Totals */}
                <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                  <div className='flex justify-between text-gray-700'>
                    <span>Subtotal:</span>
                    <span className='font-semibold'>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className='flex justify-between items-center text-gray-700'>
                    <span>Discount:</span>
                    <input
                      type='number'
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className='w-24 text-right px-2 py-1 border border-gray-300 rounded'
                      placeholder='0.00'
                    />
                  </div>
                  
                  <div className='border-t border-gray-300 pt-2 flex justify-between text-xl font-bold text-gray-900'>
                    <span>Total:</span>
                    <span className='text-teal-600'>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className='border-t border-gray-200 p-6 flex gap-4'>
            <button
              onClick={onClose}
              className='flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all'
            >
              Cancel
            </button>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className='flex-1 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              <DollarSign className='w-5 h-5' />
              Complete Sale - ${total.toFixed(2)}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
