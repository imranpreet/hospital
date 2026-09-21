import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, User, Key, Info, Heart, ShieldCheck, Clock3, Stethoscope } from 'lucide-react'

export default function AdminRegister(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passkey, setPasskey] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setErr(null)

    // Validate passkey
    if (passkey !== 'HM@Admin2025$Secure') {
      setErr('Invalid admin passkey! Please contact system administrator for the correct passkey.')
      return
    }

    setLoading(true)

    try{
      const res = await API.post('/auth/admin-register', {
        name,
        email,
        password,
        passkey
      })
      const { token, user } = res.data

      localStorage.setItem('token', token)
      localStorage.setItem('userRole', 'admin')
      API.setToken(token)

      alert('Admin account created successfully!')
      nav('/dashboard')
    }catch(e){
      setErr(e.response?.data?.msg || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className='min-h-[100dvh] bg-[#f7fbfc] px-3 py-3 sm:px-4 sm:py-6 md:px-8 lg:px-12'>
      <div className='mx-auto grid min-h-[calc(100dvh-1.5rem)] max-w-7xl overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_80px_rgba(4,61,88,0.12)] sm:min-h-[calc(100dvh-3rem)] sm:rounded-[2rem] lg:grid-cols-[1.05fr_0.95fr]'>
        <div className='relative hidden overflow-hidden bg-[#043d58] p-10 text-white lg:flex lg:flex-col lg:justify-between lg:p-12'>
          <div className='absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#087bb8]/20 blur-2xl' />
          <div className='absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-[#087bb8]/25 blur-3xl' />
          <div className='relative z-10'>
            <div className='flex items-center gap-3 text-xl font-bold'><Heart className='h-7 w-7 fill-current text-[#55afd0]' /><span>CityCare Hospital</span></div>
            <div className='mt-24 max-w-xl'>
              <div className='mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#087bb8] shadow-xl'><Stethoscope className='h-10 w-10' /></div>
              <h2 className='text-5xl leading-[1.05] text-white'>Build a stronger care team.</h2>
              <p className='mt-6 max-w-md text-lg leading-relaxed text-white/75'>Create a protected administrator account for smooth, connected hospital operations.</p>
              <div className='mt-10 space-y-5 text-white/85'>
                <div className='flex items-center gap-4'><ShieldCheck className='h-6 w-6 text-[#55afd0]' /><span>Verified administrator access</span></div>
                <div className='flex items-center gap-4'><Clock3 className='h-6 w-6 text-[#55afd0]' /><span>Everything organized in one place</span></div>
              </div>
            </div>
          </div>
          <p className='relative z-10 text-sm text-white/55'>CityCare Hospital administration.</p>
        </div>

        <div className='flex items-center justify-center px-5 py-10 sm:px-12 lg:px-16'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md'
        >
          <div className='mb-10'>
            <div className='mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff1f9]'>
              <Shield className='h-7 w-7 text-[#087bb8]' />
            </div>
            <h1 className='text-4xl text-slate-900'>Admin Registration</h1>
            <p className='mt-3 text-slate-600'>Create a CityCare administrator account</p>
          </div>

          {/* Info Box */}
          <div className='mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <div className='flex items-start gap-3'>
              <Info className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
              <div className='text-sm text-blue-800'>
                <p className='font-semibold mb-1'>Admin Passkey Required</p>
                <p>You need the system admin passkey to create an admin account. Contact your system administrator if you don't have it.</p>
              </div>
            </div>
          </div>

          {err && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm'>
              {err}
            </div>
          )}

          <form onSubmit={submit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Full Name</label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
                <input
                  type='text'
                  required
                  value={name}
                  onChange={e=>setName(e.target.value)}
                  className='w-full rounded-xl border border-slate-200 bg-[#fbfdfd] py-4 pl-11 pr-4 focus:border-[#087bb8] focus:ring-2 focus:ring-[#bfe3f1]'
                  placeholder='John Doe'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Admin Email</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
                <input
                  type='email'
                  required
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  className='w-full rounded-xl border border-slate-200 bg-[#fbfdfd] py-4 pl-11 pr-4 focus:border-[#087bb8] focus:ring-2 focus:ring-[#bfe3f1]'
                  placeholder='admin@citycare.com'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Admin Password</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
                <input
                  type='password'
                  required
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  className='w-full rounded-xl border border-slate-200 bg-[#fbfdfd] py-4 pl-11 pr-4 focus:border-[#087bb8] focus:ring-2 focus:ring-[#bfe3f1]'
                  placeholder='••••••••'
                  minLength={6}
                />
              </div>
              <p className='text-xs text-slate-500 mt-1'>Minimum 6 characters</p>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                Admin Passkey <span className='text-red-600'>*</span>
              </label>
              <div className='relative'>
                <Key className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
                <input
                  type='password'
                  required
                  value={passkey}
                  onChange={e=>setPasskey(e.target.value)}
                  className='w-full rounded-xl border border-slate-200 bg-[#fbfdfd] py-4 pl-11 pr-4 focus:border-[#087bb8] focus:ring-2 focus:ring-[#bfe3f1]'
                  placeholder='Enter system admin passkey'
                />
              </div>
              <p className='text-xs text-slate-500 mt-1'>
                Required to verify admin registration authorization
              </p>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-[#087bb8] py-4 font-semibold text-white shadow-lg shadow-[#087bb8]/20 transition hover:bg-[#066896] disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Shield className='w-5 h-5' />
              {loading ? 'Creating Account...' : 'Register as Admin'}
            </button>
          </form>

          <div className='mt-6 space-y-3'>
            <div className='text-center'>
              <p className='text-sm text-slate-600'>
                Already have admin account?{' '}
                <button
                  onClick={() => nav('/admin-login')}
                  className='font-semibold text-[#087bb8] hover:text-[#066896]'
                >
                  Admin Login
                </button>
              </p>
            </div>
            <div className='text-center pt-3 border-t border-slate-200'>
              <p className='text-sm text-slate-600'>
                Not an admin?{' '}
                <button
                  onClick={() => nav('/register')}
                  className='text-sky-600 hover:text-sky-700 font-semibold'
                >
                  Regular registration
                </button>
              </p>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}
