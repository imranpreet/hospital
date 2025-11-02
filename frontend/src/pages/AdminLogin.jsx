import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock } from 'lucide-react'

export default function AdminLogin(){
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
      
      // Check if user is actually an admin
      if (user.role !== 'admin') {
        setErr('Access Denied: Admin credentials required')
        setLoading(false)
        return
      }
      
      localStorage.setItem('token', token)
      localStorage.setItem('userRole', 'admin') // Store as admin
      API.setToken(token)
      
      // Always redirect to admin dashboard
      nav('/dashboard')
    }catch(e){
      setErr(e.response?.data?.msg || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12'>
      <div className='max-w-md mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white rounded-2xl shadow-xl p-8 border-t-4 border-red-600'
        >
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Shield className='w-8 h-8 text-red-600' />
            </div>
            <h1 className='text-3xl font-bold text-slate-900'>Admin Access</h1>
            <p className='text-slate-600 mt-2'>Secure login for administrators</p>
          </div>

          {err && (
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
                  className='w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent' 
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
                  className='w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent' 
                  placeholder='••••••••' 
                />
              </div>
            </div>

            <button 
              type='submit'
              disabled={loading}
              className='w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              <Shield className='w-5 h-5' />
              {loading ? 'Verifying...' : 'Admin Sign In'}
            </button>
          </form>

          <div className='mt-6 space-y-3'>
            <div className='text-center'>
              <p className='text-sm text-slate-600'>
                Don't have admin account?{' '}
                <button 
                  onClick={() => nav('/admin-register')}
                  className='text-red-600 hover:text-red-700 font-semibold'
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
  )
}
