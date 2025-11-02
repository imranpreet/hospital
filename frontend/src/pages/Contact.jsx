import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle, Loader } from 'lucide-react'
import axios from 'axios'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('http://localhost:5000/api/contact/submit', formData)
      
      if (response.data.success) {
        setSuccess(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Hero Section with Background Image */}
      <section className='relative h-[500px] overflow-hidden'>
        {/* Background Image - Doctors Team */}
        <div 
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1600&q=80)',
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-slate-900/70 to-blue-900/70'></div>
        </div>

        {/* Hero Content */}
        <div className='relative z-10 h-full flex items-center'>
          <div className='max-w-6xl mx-auto px-4 w-full'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='text-center text-white'
            >
              <h1 className='text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl shadow-black tracking-tight'>
                Contact Us
              </h1>
              <p className='text-xl md:text-2xl font-medium max-w-3xl mx-auto drop-shadow-lg leading-relaxed'>
                We're here to help! Get in touch with our medical team for appointments, inquiries, or emergency assistance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className='py-16 relative -mt-32 z-20'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Side - Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className='space-y-6'
            >
              {/* Phone Card */}
              <div className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow'>
                <div className='w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center mb-4'>
                  <Phone className='w-7 h-7 text-sky-600' />
                </div>
                <h3 className='text-xl font-bold text-slate-900 mb-2'>Phone</h3>
                <p className='text-slate-600'>+1 (555) 123-4567</p>
                <p className='text-slate-600'>+1 (555) 987-6543</p>
              </div>

              {/* Email Card */}
              <div className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow'>
                <div className='w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                  <Mail className='w-7 h-7 text-green-600' />
                </div>
                <h3 className='text-xl font-bold text-slate-900 mb-2'>Email</h3>
                <p className='text-slate-600'>info@citycare.com</p>
                <p className='text-slate-600'>support@citycare.com</p>
              </div>

              {/* Address Card */}
              <div className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow'>
                <div className='w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4'>
                  <MapPin className='w-7 h-7 text-purple-600' />
                </div>
                <h3 className='text-xl font-bold text-slate-900 mb-2'>Address</h3>
                <p className='text-slate-600'>123 Medical Center Drive</p>
                <p className='text-slate-600'>New York, NY 10001</p>
              </div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='lg:col-span-2'
            >
              <div className='bg-white rounded-2xl shadow-2xl p-8 md:p-10'>
                <h2 className='text-3xl font-bold text-slate-900 mb-2 text-center'>Send Us A Message</h2>
                <p className='text-slate-600 text-center mb-8'>We'll get back to you as soon as possible</p>

                {/* Success Message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3'
                    >
                      <CheckCircle className='w-6 h-6 text-green-600 flex-shrink-0' />
                      <div>
                        <p className='text-green-800 font-semibold'>Message sent successfully!</p>
                        <p className='text-green-700 text-sm'>Thank you for contacting us. We'll get back to you soon.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'
                  >
                    <p className='text-red-800'>{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Name Input */}
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                      Full Name *
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder='Enter your name'
                      className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all'
                    />
                  </div>

                  {/* Email and Phone Row */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>
                        Email Address *
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder='Enter a valid email address'
                        className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>
                        Telephone Number *
                      </label>
                      <input
                        type='tel'
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder='Telephone Number'
                        className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all'
                      />
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                      Your Message *
                    </label>
                    <textarea
                      name='message'
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows='6'
                      placeholder='Enter your message'
                      className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all resize-none'
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type='submit'
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className='w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
                  >
                    {loading ? (
                      <>
                        <Loader className='w-5 h-5 animate-spin' />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className='w-5 h-5' />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>

                <p className='text-center text-sm text-slate-500 mt-6'>
                  Image from <a href='https://freepik.com' target='_blank' rel='noopener noreferrer' className='text-sky-600 hover:underline'>Freepik</a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-6xl mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-10'
          >
            <h2 className='text-4xl font-bold text-slate-900 mb-4'>Visit Our Hospital</h2>
            <p className='text-lg text-slate-600'>We're conveniently located in the heart of the city</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='rounded-2xl overflow-hidden shadow-xl h-[400px]'
          >
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215205646539!2d-73.98823492346444!3d40.75889097138684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1698765432100!5m2!1sen!2sus'
              width='100%'
              height='100%'
              style={{ border: 0 }}
              allowFullScreen=''
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              title='Hospital Location'
            ></iframe>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
