import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Award, Building } from 'lucide-react'

export default function DoctorCard({ doctor }){
  const navigate = useNavigate()

  return (
    <div className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-slate-100 overflow-hidden group'>
      <div className='h-48 bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center relative overflow-hidden'>
        {doctor.image ? (
          <img src={doctor.image} alt={doctor.name} className='w-full h-full object-cover' />
        ) : (
          <div className='w-24 h-24 bg-sky-200 rounded-full flex items-center justify-center text-4xl font-bold text-sky-700'>
            {doctor.name?.charAt(0) || 'D'}
          </div>
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
      </div>
      
      <div className='p-5'>
        <h3 className='text-xl font-bold text-slate-900 mb-1'>{doctor.name}</h3>
        
        <div className='flex items-center gap-2 text-sky-600 mb-2'>
          <Award className='w-4 h-4' />
          <span className='text-sm font-medium'>{doctor.specialization}</span>
        </div>
        
        <div className='flex items-center gap-2 text-slate-600 mb-3'>
          <Building className='w-4 h-4' />
          <span className='text-sm'>{doctor.department}</span>
        </div>

        {doctor.bio && (
          <p className='text-sm text-slate-600 mb-4 line-clamp-2'>{doctor.bio}</p>
        )}

        <button 
          onClick={() => navigate('/appointment')}
          className='w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium'
        >
          <Calendar className='w-4 h-4' />
          Book Appointment
        </button>
      </div>
    </div>
  )
}
