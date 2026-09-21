import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, Key, AlertTriangle, Heart, ShieldCheck, Clock3, Stethoscope } from 'lucide-react'

export default function AdminLogin(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passkey, setPasskey] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const [warningMsg, setWarningMsg] = useState(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setErr(null)
    setWarningMsg(null)
    setLoading(true)

    try{
      const res = await API.post('/auth/admin-login', { email, password, passkey })
      const { token, user } = res.data

      localStorage.setItem('token', token)
      localStorage.setItem('userRole', 'admin')
      API.setToken(token)

      // Show success message
      alert('Admin login successful!')
      nav('/dashboard')
    }catch(e){
      const errorData = e.response?.data

      if (errorData?.isBlocked) {
        setIsBlocked(true)
        setErr(errorData.msg)
      } else if (errorData?.remainingAttempts !== undefined) {
        setWarningMsg(errorData.msg)
        setErr(null)
      } else {
        setErr(errorData?.msg || 'Login failed')
        setWarningMsg(null)
      }
    }
    setLoading(false)
  }

  return (
    <div className='min-h-[100dvh] bg-[#f7fbfc] px-3 py-3 sm:px-4 sm:py-6 md:px-8 lg:px-12'>
      <div className='mx-auto grid min-h-[calc(100dvh-1.5rem)] max-w-7xl overflow-hidden rounded-[1.5rem] bg-white shadow-[0_24px_80px_rgba(4,61,88,0.12)] sm:min-h-[calc(100dvh-3rem)] sm:rounded-[2rem] lg:grid-cols-[1.05fr_0.95fr]'>
        <div className='relative hidden overflow-hidden bg-red-950 p-10 text-white lg:flex lg:flex-col lg:justify-between lg:p-12'>
          <div className='absolute -left-24 -top-24 h-80 w-80 rounded-full bg-red-400/20 blur-2xl' />
          <div className='absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-red-500/25 blur-3xl' />
          <div className='relative z-10'>
            <div className='flex items-center gap-3 text-xl font-bold'><Heart className='h-7 w-7 fill-current text-red-300' /><span>CityCare Hospital</span></div>
            <div className='mt-24 max-w-xl'>
              <div className='mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-600 shadow-xl'><Stethoscope className='h-10 w-10' /></div>
              <h2 className='text-5xl leading-[1.05] text-white'>Run better care, securely.</h2>
              <p className='mt-6 max-w-md text-lg leading-relaxed text-white/75'>Use the administrator portal to coordinate hospital operations and protect every patient record.</p>
              <div className='mt-10 space-y-5 text-white/85'>
                <div className='flex items-center gap-4'><ShieldCheck className='h-6 w-6 text-red-300' /><span>Protected administrative access</span></div>
                <div className='flex items-center gap-4'><Clock3 className='h-6 w-6 text-red-300' /><span>Operations in one clear workspace</span></div>
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
            <div className='mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50'>
              <Shield className='h-7 w-7 text-red-600' />
            </div>
            <h1 className='text-4xl text-slate-900'>Admin Access</h1>
            <p className='mt-3 text-slate-600'>Secure login for CityCare administrators</p>
          </div>

          {/* Blocked Account Message */}
          {isBlocked && (
            <div className='mb-6 p-4 bg-red-100 border-2 border-red-600 rounded-lg'>
              <div className='flex items-start gap-3'>
                <AlertTriangle className='w-6 h-6 text-red-600 flex-shrink-0 mt-0.5' />
                <div>
                  <h3 className='font-bold text-red-900 mb-1'>Account Blocked!</h3>
                  <p className='text-sm text-red-800'>{err}</p>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message (wrong passkey attempts) */}
          {warningMsg && !isBlocked && (
            <div className='mb-6 p-4 bg-orange-50 border-2 border-orange-400 rounded-lg'>
              <div className='flex items-start gap-3'>
                <AlertTriangle className='w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5' />
                <div>
                  <h3 className='font-bold text-orange-900 mb-1'>Warning!</h3>
                  <p className='text-sm text-orange-800'>{warningMsg}</p>
                </div>
              </div>
            </div>
          )}

          {/* Regular Error Message */}
          {err && !isBlocked && !warningMsg && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm'>
              {err}
            </div>
          )}

          <form onSubmit={submit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Admin Email</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
                <input
                  type='email'
                  required
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  disabled={isBlocked}
                  className='w-full rounded-xl border border-slate-200 bg-[#fbfdfd] py-4 pl-11 pr-4 focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100'
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
                  disabled={isBlocked}
                  className='w-full rounded-xl border border-slate-200 bg-[#fbfdfd] py-4 pl-11 pr-4 focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100'
                  placeholder='••••••••'
                />
              </div>
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
                  disabled={isBlocked}
                  className='w-full rounded-xl border border-slate-200 bg-[#fbfdfd] py-4 pl-11 pr-4 focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100'
                  placeholder='Enter admin passkey'
                />
              </div>
              <p className='text-xs text-slate-500 mt-1'>
                ⚠️ You have 3 attempts. Account will be blocked after 3 failed attempts.
              </p>
            </div>

            <button
              type='submit'
              disabled={loading || isBlocked}
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-4 font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <Shield className='w-5 h-5' />
              {loading ? 'Verifying...' : isBlocked ? 'Account Blocked' : 'Admin Sign In'}
            </button>
          </form>

          <div className='mt-6 space-y-3'>
            <div className='text-center'>
              <p className='text-sm text-slate-600'>
                Don't have admin account?{' '}
                <button
                  onClick={() => nav('/admin-register')}
                  className='font-semibold text-red-600 hover:text-red-700'
                >
                  Register as Admin
                </button>
              </p>
            </div>
            <div className='text-center pt-3 border-t border-slate-200'>
              <p className='text-sm text-slate-600'>
                Not an admin?{' '}
                <button
                  onClick={() => nav('/login')}
                  className='text-sky-600 hover:text-sky-700 font-semibold'
                >
                  Regular login
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
