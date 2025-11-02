import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer(){
  return (
    <footer className='bg-slate-900 text-white mt-auto'>
      <div className='max-w-6xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* About */}
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <Heart className='w-6 h-6 fill-current text-sky-400' />
              <span className='text-xl font-bold'>CityCare</span>
            </div>
            <p className='text-slate-400 text-sm mb-4'>
              Quality healthcare for everyone. Available 24/7 for emergency services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2 text-sm'>
              <li><Link to='/' className='text-slate-400 hover:text-sky-400 transition'>Home</Link></li>
              <li><Link to='/about' className='text-slate-400 hover:text-sky-400 transition'>About Us</Link></li>
              <li><Link to='/doctors' className='text-slate-400 hover:text-sky-400 transition'>Our Doctors</Link></li>
              <li><Link to='/appointment' className='text-slate-400 hover:text-sky-400 transition'>Book Appointment</Link></li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className='font-semibold mb-4'>Departments</h3>
            <ul className='space-y-2 text-sm text-slate-400'>
              <li>Cardiology</li>
              <li>Neurology</li>
              <li>Pediatrics</li>
              <li>Emergency Care</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='font-semibold mb-4'>Contact Us</h3>
            <ul className='space-y-3 text-sm'>
              <li className='flex items-start gap-2'>
                <Phone className='w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0' />
                <span className='text-slate-400'>+1 (555) 123-4567</span>
              </li>
              <li className='flex items-start gap-2'>
                <Mail className='w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0' />
                <span className='text-slate-400'>info@citycare.com</span>
              </li>
              <li className='flex items-start gap-2'>
                <MapPin className='w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0' />
                <span className='text-slate-400'>123 Healthcare Ave, Medical District</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400'>
          <p>© {new Date().getFullYear()} CityCare Hospital. All rights reserved. Quality healthcare for everyone.</p>
        </div>
      </div>
    </footer>
  )
}
