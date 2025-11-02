import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function TestAvailability() {
  const navigate = useNavigate()

  const seedTestAppointments = () => {
    // Create test appointments for testing the availability system
    const testAppointments = {
      '1': [ // Dr. Asha Rao (Cardiologist)
        {
          id: 1001,
          patientName: 'John Smith',
          age: 45,
          problem: 'Chest pain and irregular heartbeat',
          appointmentDate: '2025-11-01',
          appointmentTime: '09:00 AM',
          status: 'pending'
        },
        {
          id: 1002,
          patientName: 'Emma Wilson',
          age: 38,
          problem: 'Routine cardiac checkup',
          appointmentDate: '2025-11-01',
          appointmentTime: '10:00 AM',
          status: 'pending'
        },
        {
          id: 1003,
          patientName: 'Michael Brown',
          age: 52,
          problem: 'High blood pressure',
          appointmentDate: '2025-11-04',
          appointmentTime: '09:00 AM',
          status: 'pending'
        }
      ],
      '2': [ // Dr. Priya Sharma (Neurologist)
        {
          id: 2001,
          patientName: 'Sarah Davis',
          age: 41,
          problem: 'Severe headaches and dizziness',
          appointmentDate: '2025-11-01',
          appointmentTime: '10:00 AM',
          status: 'pending'
        },
        {
          id: 2002,
          patientName: 'David Miller',
          age: 55,
          problem: 'Memory issues',
          appointmentDate: '2025-11-05',
          appointmentTime: '02:00 PM',
          status: 'pending'
        }
      ],
      '3': [ // Dr. Vikram Singh (Pediatrician)
        {
          id: 3001,
          patientName: 'Little Tommy',
          age: 5,
          problem: 'Fever and cough',
          appointmentDate: '2025-11-01',
          appointmentTime: '09:00 AM',
          status: 'pending'
        },
        {
          id: 3002,
          patientName: 'Baby Emma',
          age: 2,
          problem: 'Regular checkup',
          appointmentDate: '2025-11-01',
          appointmentTime: '10:00 AM',
          status: 'pending'
        },
        {
          id: 3003,
          patientName: 'Sophie Anderson',
          age: 8,
          problem: 'Vaccination',
          appointmentDate: '2025-11-01',
          appointmentTime: '11:00 AM',
          status: 'pending'
        }
      ]
    }

    localStorage.setItem('doctorAppointments', JSON.stringify(testAppointments))
    alert('✅ Test appointments created!\n\nTry booking:\n- Dr. Asha Rao on Nov 1 at 9:00 AM (BUSY)\n- Dr. Priya Sharma on Nov 1 at 10:00 AM (BUSY)\n- Dr. Vikram Singh on Nov 1 at 9:00 AM (BUSY)')
    navigate('/check-availability')
  }

  const clearAppointments = () => {
    localStorage.removeItem('doctorAppointments')
    localStorage.removeItem('appointments')
    alert('✅ All appointments cleared!')
  }

  const viewAppointments = () => {
    const appointments = JSON.parse(localStorage.getItem('doctorAppointments') || '{}')
    console.log('Current appointments:', appointments)
    alert('Check browser console for appointments data')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='bg-white rounded-3xl shadow-2xl p-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-6'>Test Availability System</h1>
          
          <div className='space-y-4'>
            <button
              onClick={seedTestAppointments}
              className='w-full px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-lg'
            >
              Create Test Appointments
            </button>

            <button
              onClick={viewAppointments}
              className='w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-bold text-lg'
            >
              View Current Appointments
            </button>

            <button
              onClick={clearAppointments}
              className='w-full px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold text-lg'
            >
              Clear All Appointments
            </button>

            <button
              onClick={() => navigate('/check-availability')}
              className='w-full px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold text-lg'
            >
              Go to Check Availability
            </button>
          </div>

          <div className='mt-8 bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300'>
            <h3 className='font-bold text-yellow-800 mb-2'>Instructions:</h3>
            <ol className='text-sm text-yellow-700 space-y-1 list-decimal list-inside'>
              <li>Click "Create Test Appointments" to add sample bookings</li>
              <li>Go to "Check Availability" page</li>
              <li>Try to book Dr. Asha Rao on November 1 at 9:00 AM</li>
              <li>You should see "Doctor is BUSY" message</li>
              <li>System will show alternative available time slots</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
