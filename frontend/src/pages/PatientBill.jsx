import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  FileText, Download, Printer, CheckCircle, Building, 
  User, Calendar, DollarSign, Phone, Mail, MapPin, ArrowLeft 
} from 'lucide-react'

export default function PatientBill() {
  const navigate = useNavigate()
  const location = useLocation()
  const [billData, setBillData] = useState(null)

  useEffect(() => {
    // Get discharge data from navigation state or localStorage
    const data = location.state?.dischargeData || JSON.parse(localStorage.getItem('latestDischargeData') || 'null')
    
    if (data) {
      setBillData(data)
      // Save to localStorage for persistence
      localStorage.setItem('latestDischargeData', JSON.stringify(data))
    } else {
      // If no data, redirect back to wards
      navigate('/wards')
    }
  }, [location.state, navigate])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Create a simple text/HTML version for download
    const billContent = document.getElementById('bill-content')
    const printWindow = window.open('', '', 'width=800,height=600')
    printWindow.document.write(billContent.innerHTML)
    printWindow.document.close()
    printWindow.print()
  }

  if (!billData) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-slate-600 font-semibold'>Loading bill details...</p>
        </div>
      </div>
    )
  }

  const { patient, daysStayed, totalBill } = billData

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 print:bg-white'>
      {/* Header - Hidden in print */}
      <div className='bg-white border-b border-slate-200 shadow-sm print:hidden'>
        <div className='max-w-5xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => navigate('/wards')}
                className='p-2 hover:bg-slate-100 rounded-lg transition'
              >
                <ArrowLeft className='w-5 h-5 text-slate-600' />
              </button>
              <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg'>
                <FileText className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-slate-900'>Patient Bill</h1>
                <p className='text-sm text-slate-600'>Discharge Invoice & Payment Summary</p>
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={handleDownload}
                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold flex items-center gap-2'
              >
                <Download className='w-4 h-4' />
                Download
              </button>
              <button
                onClick={handlePrint}
                className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold flex items-center gap-2'
              >
                <Printer className='w-4 h-4' />
                Print Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Content */}
      <div className='max-w-5xl mx-auto px-6 py-8 print:px-0'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          id='bill-content'
          className='bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden print:shadow-none print:border-0'
        >
          {/* Hospital Header */}
          <div className='bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8'>
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center'>
                  <Building className='w-8 h-8' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold mb-1'>City Care Hospital</h1>
                  <p className='text-blue-100'>Advanced Healthcare Services</p>
                </div>
              </div>
              <div className='text-right text-sm'>
                <p className='flex items-center gap-2 justify-end mb-1'>
                  <Phone className='w-4 h-4' />
                  +91 1234567890
                </p>
                <p className='flex items-center gap-2 justify-end mb-1'>
                  <Mail className='w-4 h-4' />
                  info@citycarehospital.com
                </p>
                <p className='flex items-center gap-2 justify-end'>
                  <MapPin className='w-4 h-4' />
                  123 Health Street, Medical City
                </p>
              </div>
            </div>
          </div>

          {/* Success Badge */}
          <div className='bg-green-50 border-b border-green-200 p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-14 h-14 bg-green-500 rounded-full flex items-center justify-center'>
                <CheckCircle className='w-7 h-7 text-white' />
              </div>
              <div>
                <h2 className='text-2xl font-bold text-green-900'>Discharge Completed Successfully</h2>
                <p className='text-green-700'>Payment invoice generated on {new Date(patient.dischargeDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Bill Information */}
          <div className='p-8'>
            {/* Bill Header Info */}
            <div className='grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-200'>
              <div>
                <h3 className='text-sm font-semibold text-slate-500 uppercase mb-3'>Bill To</h3>
                <div className='space-y-2'>
                  <p className='flex items-center gap-2 text-slate-900'>
                    <User className='w-4 h-4 text-slate-400' />
                    <span className='font-semibold text-lg'>{patient.name}</span>
                  </p>
                  <p className='text-slate-600'>Age: {patient.age} years | Gender: {patient.gender}</p>
                  <p className='flex items-center gap-2 text-slate-600'>
                    <Phone className='w-4 h-4 text-slate-400' />
                    {patient.contact}
                  </p>
                  {patient.email && (
                    <p className='flex items-center gap-2 text-slate-600'>
                      <Mail className='w-4 h-4 text-slate-400' />
                      {patient.email}
                    </p>
                  )}
                </div>
              </div>

              <div className='text-right'>
                <h3 className='text-sm font-semibold text-slate-500 uppercase mb-3'>Invoice Details</h3>
                <div className='space-y-2'>
                  <div>
                    <span className='text-slate-600'>Invoice #:</span>
                    <p className='font-bold text-lg text-slate-900'>INV-{Date.now().toString().slice(-8)}</p>
                  </div>
                  <div>
                    <span className='text-slate-600'>Invoice Date:</span>
                    <p className='font-semibold text-slate-900'>{new Date(patient.dischargeDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className='text-slate-600'>Status:</span>
                    <p className='inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold ml-2'>
                      Discharged
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admission Details */}
            <div className='mb-8 pb-8 border-b border-slate-200'>
              <h3 className='text-lg font-bold text-slate-900 mb-4'>Admission Details</h3>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='bg-blue-50 rounded-lg p-4'>
                  <p className='text-sm text-blue-600 mb-1'>Admission Date</p>
                  <p className='font-semibold text-slate-900'>{new Date(patient.admissionDate).toLocaleDateString()}</p>
                </div>
                <div className='bg-green-50 rounded-lg p-4'>
                  <p className='text-sm text-green-600 mb-1'>Discharge Date</p>
                  <p className='font-semibold text-slate-900'>{new Date(patient.dischargeDate).toLocaleDateString()}</p>
                </div>
                <div className='bg-purple-50 rounded-lg p-4'>
                  <p className='text-sm text-purple-600 mb-1'>Days Stayed</p>
                  <p className='font-semibold text-slate-900'>{daysStayed} days</p>
                </div>
                <div className='bg-orange-50 rounded-lg p-4'>
                  <p className='text-sm text-orange-600 mb-1'>Room Type</p>
                  <p className='font-semibold text-slate-900'>{patient.room?.roomType || 'General'}</p>
                </div>
              </div>
            </div>

            {/* Bill Breakdown */}
            <div className='mb-8'>
              <h3 className='text-lg font-bold text-slate-900 mb-4'>Bill Breakdown</h3>
              <table className='w-full'>
                <thead>
                  <tr className='border-b-2 border-slate-300'>
                    <th className='text-left py-3 text-slate-700 font-semibold'>Description</th>
                    <th className='text-center py-3 text-slate-700 font-semibold'>Quantity</th>
                    <th className='text-right py-3 text-slate-700 font-semibold'>Rate</th>
                    <th className='text-right py-3 text-slate-700 font-semibold'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className='border-b border-slate-200'>
                    <td className='py-4 text-slate-900'>Room Charges ({patient.room?.roomType || 'General'})</td>
                    <td className='py-4 text-center text-slate-600'>{daysStayed} days</td>
                    <td className='py-4 text-right text-slate-600'>₹{patient.room?.pricePerDay?.toLocaleString() || '1,000'}</td>
                    <td className='py-4 text-right font-semibold text-slate-900'>₹{totalBill.toLocaleString()}</td>
                  </tr>
                  <tr className='border-b border-slate-200'>
                    <td className='py-4 text-slate-900'>Nursing & Care Services</td>
                    <td className='py-4 text-center text-slate-600'>{daysStayed} days</td>
                    <td className='py-4 text-right text-slate-600'>Included</td>
                    <td className='py-4 text-right font-semibold text-slate-900'>₹0</td>
                  </tr>
                  <tr className='border-b border-slate-200'>
                    <td className='py-4 text-slate-900'>Doctor Consultation</td>
                    <td className='py-4 text-center text-slate-600'>-</td>
                    <td className='py-4 text-right text-slate-600'>Included</td>
                    <td className='py-4 text-right font-semibold text-slate-900'>₹0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className='bg-slate-50 rounded-lg p-6'>
              <div className='space-y-3'>
                <div className='flex justify-between text-slate-600'>
                  <span>Subtotal:</span>
                  <span className='font-semibold'>₹{totalBill.toLocaleString()}</span>
                </div>
                <div className='flex justify-between text-slate-600'>
                  <span>Tax (0%):</span>
                  <span className='font-semibold'>₹0</span>
                </div>
                <div className='flex justify-between text-slate-600'>
                  <span>Discount:</span>
                  <span className='font-semibold'>₹0</span>
                </div>
                <div className='border-t-2 border-slate-300 pt-3 flex justify-between items-center'>
                  <span className='text-xl font-bold text-slate-900'>Total Amount:</span>
                  <span className='text-3xl font-bold text-green-600'>₹{totalBill.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className='mt-8 bg-green-50 border border-green-200 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-6 h-6 text-green-600' />
                  <div>
                    <p className='font-bold text-green-900'>Payment Status: Pending</p>
                    <p className='text-sm text-green-700'>Please complete payment at the billing counter</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-green-600'>Amount Due</p>
                  <p className='text-2xl font-bold text-green-900'>₹{totalBill.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className='mt-8 pt-8 border-t border-slate-200'>
              <h4 className='font-bold text-slate-900 mb-2'>Notes:</h4>
              <p className='text-sm text-slate-600'>
                • Payment can be made via Cash, Card, UPI, or Insurance<br />
                • Please retain this invoice for insurance claims<br />
                • For any queries, contact our billing department<br />
                • Thank you for choosing City Care Hospital
              </p>
            </div>

            {/* Signature Section */}
            <div className='mt-8 grid grid-cols-2 gap-8'>
              <div className='text-center pt-8 border-t border-slate-300'>
                <p className='font-semibold text-slate-900'>Authorized Signature</p>
                <p className='text-sm text-slate-500 mt-1'>Billing Department</p>
              </div>
              <div className='text-center pt-8 border-t border-slate-300'>
                <p className='font-semibold text-slate-900'>Patient/Guardian Signature</p>
                <p className='text-sm text-slate-500 mt-1'>Acknowledgment</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='bg-slate-100 text-center py-4 text-sm text-slate-600 border-t border-slate-200'>
            <p>This is a computer-generated invoice and doesn't require a signature</p>
            <p className='mt-1'>City Care Hospital | 123 Health Street, Medical City | +91 1234567890</p>
          </div>
        </motion.div>

        {/* Action Buttons - Hidden in print */}
        <div className='mt-6 flex gap-4 print:hidden'>
          <button
            onClick={() => navigate('/wards')}
            className='flex-1 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold'
          >
            Back to Wards
          </button>
          <button
            onClick={handlePrint}
            className='flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2'
          >
            <Printer className='w-5 h-5' />
            Print Bill
          </button>
        </div>
      </div>
    </div>
  )
}
