import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, Heart, ShieldCheck, Clock3, Stethoscope } from 'lucide-react'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setErr(null)
    setLoading(true)

    try{
      const res = await API.post('/auth/login', { email, password })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('userRole', user?.role || 'patient')
      API.setToken(token)

      // Check if there's a redirect URL stored
      const redirectUrl = localStorage.getItem('redirectAfterLogin')
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin')
        nav(redirectUrl)
      } else {
        const targetPath = user?.role === 'doctor' ? '/doctor-dashboard' : '/user-dashboard'
        nav(targetPath)
      }
    }catch(e){
      setErr(e.response?.data?.msg || 'Login failed')
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
            <div className='flex items-center gap-3 text-xl font-bold'>
              <Heart className='h-7 w-7 fill-current text-[#55afd0]' />
              <span>CityCare Hospital</span>
            </div>
            <div className='mt-24 max-w-xl'>
              <div className='mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#087bb8] shadow-xl'>
                <Stethoscope className='h-10 w-10' />
              </div>
              <h2 className='text-5xl leading-[1.05] text-white'>Care that keeps you moving forward.</h2>
              <p className='mt-6 max-w-md text-lg leading-relaxed text-white/75'>Access appointments, medical records, and trusted care from one secure hospital portal.</p>
              <div className='mt-10 space-y-5 text-white/85'>
                <div className='flex items-center gap-4'><ShieldCheck className='h-6 w-6 text-[#55afd0]' /><span>Secure patient information</span></div>
                <div className='flex items-center gap-4'><Clock3 className='h-6 w-6 text-[#55afd0]' /><span>Care available around the clock</span></div>
              </div>
            </div>
          </div>
          <p className='relative z-10 text-sm text-white/55'>Your health, our priority.</p>
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
              <LogIn className='h-7 w-7 text-[#087bb8]' />
            </div>
            <h1 className='text-4xl text-slate-900'>Welcome Back</h1>
            <p className='mt-3 text-slate-600'>Sign in to your CityCare Hospital account</p>
          </div>

          {err && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm'>
              {err}
            </div>
          )}

          <form onSubmit={submit} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Email Address</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
                <input
                  type='email'
                  required
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  className='w-full rounded-xl border border-slate-200 bg-[#fbfdfd] py-4 pl-11 pr-4 focus:border-[#087bb8] focus:ring-2 focus:ring-[#bfe3f1]'
                  placeholder='john@example.com'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-700 mb-2'>Password</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400' />
                <input
                  type='password'
                  required
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  className='w-full rounded-xl border border-slate-200 bg-[#fbfdfd] py-4 pl-11 pr-4 focus:border-[#087bb8] focus:ring-2 focus:ring-[#bfe3f1]'
                  placeholder='••••••••'
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-xl bg-[#087bb8] py-4 font-semibold text-white shadow-lg shadow-[#087bb8]/20 transition hover:bg-[#066896] disabled:cursor-not-allowed disabled:opacity-50'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-slate-600'>
              Don't have an account?{' '}
              <button
                onClick={() => nav('/register')}
                className='font-semibold text-[#087bb8] hover:text-[#066896]'
              >
                Create account
              </button>
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}
