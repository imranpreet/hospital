import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Heart, Activity, Users, Calendar, Pill, FileText, Clock, Shield, X, CheckCircle, ArrowRight } from 'lucide-react'

export default function Home(){
  const navigate = useNavigate()
  const [selectedFeature, setSelectedFeature] = useState(null)

  const handleMakeAppointment = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      // Store the intended destination
      localStorage.setItem('redirectAfterLogin', '/appointment')
      alert('Please login to book an appointment')
      navigate('/login')
    } else {
      navigate('/appointment')
    }
  }

  const features = [
    { 
      icon: Calendar, 
      title: 'Easy Appointment Booking', 
      desc: 'Book appointments online 24/7 with your preferred doctor',
      detailedInfo: {
        overview: 'Our advanced appointment booking system makes scheduling healthcare visits effortless. Book appointments anytime, anywhere with just a few clicks.',
        benefits: [
          'Real-time availability of doctors across all departments',
          'Instant confirmation via email and SMS',
          'Flexible rescheduling and cancellation options',
          'Automated reminders before your appointment',
          'View doctor profiles, ratings, and patient reviews',
          'Book follow-up appointments with ease'
        ],
        howItWorks: [
          'Browse through our list of specialized doctors',
          'Select your preferred date and time slot',
          'Fill in your basic information and symptoms',
          'Receive instant confirmation and appointment details',
          'Get reminders 24 hours before your visit'
        ]
      }
    },
    { 
      icon: Users, 
      title: 'Expert Doctors', 
      desc: '100+ specialized doctors across multiple departments',
      detailedInfo: {
        overview: 'Our hospital houses over 100 highly qualified and experienced doctors across 20+ medical specialties, ensuring comprehensive healthcare for all your needs.',
        benefits: [
          'Board-certified specialists in every major field',
          'Average 15+ years of experience per doctor',
          'Trained at top medical institutions worldwide',
          'Continuous medical education and training',
          'Multilingual doctors available',
          'Patient-centered care approach'
        ],
        howItWorks: [
          'Browse doctors by specialty or department',
          'View detailed profiles with qualifications and experience',
          'Read verified patient reviews and ratings',
          'Check real-time availability and schedule',
          'Book video or in-person consultations'
        ]
      }
    },
    { 
      icon: Activity, 
      title: 'Health Records', 
      desc: 'Access your medical history and reports anytime, anywhere',
      detailedInfo: {
        overview: 'Keep all your medical records in one secure digital location. Access your complete health history, prescriptions, and test results from anywhere in the world.',
        benefits: [
          'Lifetime storage of all medical records',
          'Secure cloud-based access from any device',
          'Share records instantly with any healthcare provider',
          'Track health trends and vitals over time',
          'Digital prescriptions and medication history',
          'Family health records management'
        ],
        howItWorks: [
          'All consultations automatically saved to your account',
          'Lab reports uploaded directly after testing',
          'Download or print records anytime',
          'Share secure links with other doctors',
          'Set up health tracking and monitoring'
        ]
      }
    },
    { 
      icon: Pill, 
      title: 'Online Pharmacy', 
      desc: 'Order medicines online with home delivery service',
      detailedInfo: {
        overview: 'Skip the pharmacy queue! Order all your prescribed and over-the-counter medicines online and get them delivered to your doorstep within hours.',
        benefits: [
          'Verified and genuine medicines from licensed pharmacies',
          'Fast delivery within 2-4 hours in city limits',
          'Prescription medicines with valid Rx',
          'Automated refill reminders',
          'Compare prices and save up to 30%',
          'Easy returns and 24/7 customer support'
        ],
        howItWorks: [
          'Upload your prescription or select OTC medicines',
          'Add items to cart and proceed to checkout',
          'Choose delivery time slot',
          'Make secure payment online',
          'Track your order in real-time'
        ]
      }
    },
    { 
      icon: FileText, 
      title: 'Lab Reports', 
      desc: 'Get your lab results digitally with easy download',
      detailedInfo: {
        overview: 'Access all your laboratory test results online as soon as they\'re ready. No more waiting in queues or losing paper reports.',
        benefits: [
          'Results available within 24-48 hours of testing',
          'Instant notifications when reports are ready',
          'Download in multiple formats (PDF, print-ready)',
          'Historical comparison of test results',
          'Expert interpretation and normal range indicators',
          'Direct consultation option if values are abnormal'
        ],
        howItWorks: [
          'Book lab tests online or walk-in',
          'Give samples at our collection centers',
          'Receive notification when results are ready',
          'Access reports through your patient portal',
          'Schedule consultation if needed'
        ]
      }
    },
    { 
      icon: Shield, 
      title: 'Secure & Private', 
      desc: 'Your health data is encrypted and completely confidential',
      detailedInfo: {
        overview: 'We take your privacy seriously. All your medical data is protected with bank-level encryption and complies with international healthcare data protection standards.',
        benefits: [
          '256-bit SSL encryption for all data',
          'HIPAA and GDPR compliant systems',
          'Role-based access control',
          'Regular security audits and updates',
          'No data sharing without explicit consent',
          'Secure backup and disaster recovery'
        ],
        howItWorks: [
          'Data encrypted in transit and at rest',
          'Multi-factor authentication for login',
          'Activity logs for all data access',
          'You control who sees your information',
          'Right to delete your data anytime'
        ]
      }
    },
    { 
      icon: Clock, 
      title: '24/7 Emergency', 
      desc: 'Round-the-clock emergency services with ambulance facility',
      detailedInfo: {
        overview: 'Medical emergencies don\'t wait for business hours. Our 24/7 emergency department is always ready with specialized trauma care and rapid response ambulance services.',
        benefits: [
          'Emergency department open 24/7/365',
          'Advanced life support (ALS) ambulances',
          'Average response time: 15 minutes',
          'Fully equipped trauma center',
          'ICU and critical care facilities',
          'Direct admission without waiting'
        ],
        howItWorks: [
          'Call our emergency hotline: 911 or hospital number',
          'Ambulance dispatched with GPS tracking',
          'Paramedics provide first aid en route',
          'Direct admission to emergency department',
          'Immediate triage and treatment'
        ]
      }
    },
    { 
      icon: Heart, 
      title: 'Patient Care', 
      desc: 'Compassionate care with modern medical facilities',
      detailedInfo: {
        overview: 'Experience healthcare that combines cutting-edge medical technology with compassionate, patient-centered care. Your comfort and well-being are our top priorities.',
        benefits: [
          'State-of-the-art medical equipment',
          'Comfortable private and shared rooms',
          'Personalized care plans for each patient',
          'Nutritious meals tailored to dietary needs',
          'Family involvement in care decisions',
          'Post-discharge support and follow-up'
        ],
        howItWorks: [
          'Admission process made simple and fast',
          'Dedicated care team assigned to you',
          'Regular updates to family members',
          'Comfortable recovery environment',
          'Comprehensive discharge planning'
        ]
      }
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-sky-50 via-white to-blue-50 py-20 overflow-hidden'>
        <div className='absolute inset-0 bg-[url("https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1600")] bg-cover bg-center opacity-10'></div>
        <div className='max-w-6xl mx-auto px-4 relative z-10'>
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className='text-center'
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className='inline-block mb-4'
            >
              <button 
                onClick={() => navigate('/patient-dashboard')}
                className='px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-medium hover:bg-sky-200 hover:scale-105 transition-all cursor-pointer'
              >
                Your Health, Our Priority →
              </button>
            </motion.div>
            
            <h1 className='text-5xl md:text-6xl font-bold text-slate-900 mb-6'>
              Avoid Hassles & Delays
            </h1>
            <p className='text-xl text-slate-600 mb-4 max-w-2xl mx-auto'>
              Don't worry. Find your doctor & make an appointment online with ease.
            </p>
            <p className='text-lg text-slate-500 mb-8 max-w-xl mx-auto'>
              We offer you a free thought for finding the cure. Book your appointment now!
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMakeAppointment}
              className='px-8 py-4 bg-sky-600 text-white rounded-lg text-lg font-semibold hover:bg-sky-700 shadow-lg hover:shadow-xl transition-all'
            >
              Make Appointment
            </motion.button>

            <div className='mt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto'>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='text-center'
              >
                <div className='text-4xl font-bold text-sky-600'>100+</div>
                <div className='text-slate-600 mt-1'>Expert Doctors</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='text-center'
              >
                <div className='text-4xl font-bold text-sky-600'>10k+</div>
                <div className='text-slate-600 mt-1'>Happy Patients</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className='text-center'
              >
                <div className='text-4xl font-bold text-sky-600'>24/7</div>
                <div className='text-slate-600 mt-1'>Emergency Care</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-slate-900 mb-4'>How Hospital Management Works</h2>
            <p className='text-lg text-slate-600 max-w-2xl mx-auto'>
              Our comprehensive system streamlines every aspect of healthcare management for patients, doctors, and administrators
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setSelectedFeature(feature)}
                className='bg-gradient-to-br from-sky-50 to-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-sky-100 group hover:border-sky-300 cursor-pointer'
              >
                <div className='w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-sky-600 transition-colors'>
                  <feature.icon className='w-6 h-6 text-sky-600 group-hover:text-white transition-colors' />
                </div>
                <h3 className='text-lg font-semibold text-slate-900 mb-2'>{feature.title}</h3>
                <p className='text-slate-600 text-sm'>{feature.desc}</p>
                <div className='mt-3 text-sky-600 text-sm font-medium group-hover:text-sky-700 flex items-center gap-1'>
                  Learn more →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className='relative py-20 overflow-hidden'>
        {/* Background Image with Overlay */}
        <div className='absolute inset-0 z-0'>
          <img 
            src='https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=800&fit=crop' 
            alt='Hospital Background'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-br from-blue-900/95 via-slate-900/90 to-cyan-900/95'></div>
          <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'></div>
        </div>

        <div className='relative z-10 max-w-6xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-5xl font-bold text-white mb-4 drop-shadow-lg'
            >
              Access Your Portal
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-xl text-blue-100 drop-shadow'
            >
              Choose your role to continue
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              onClick={() => navigate('/dashboard')}
              className='group cursor-pointer'
            >
              <div className='bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-center border-2 border-transparent hover:border-sky-500'>
                <div className='w-24 h-24 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform'>
                  <Shield className='w-12 h-12 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-slate-900 mb-3'>Admin</h3>
                <p className='text-slate-600 mb-4'>Manage hospital operations, approve doctors, and view all records</p>
                <div className='text-sky-600 font-semibold group-hover:text-sky-700'>Access Dashboard →</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              onClick={() => navigate('/doctors')}
              className='group cursor-pointer'
            >
              <div className='bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-center border-2 border-transparent hover:border-green-500'>
                <div className='w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform'>
                  <Activity className='w-12 h-12 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-slate-900 mb-3'>Doctor</h3>
                <p className='text-slate-600 mb-4'>View appointments, manage patients, and update medical records</p>
                <div className='text-green-600 font-semibold group-hover:text-green-700'>View Portal →</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              onClick={() => {
                const token = localStorage.getItem('token')
                if (!token) {
                  localStorage.setItem('redirectAfterLogin', '/appointment')
                  alert('Please login to book an appointment')
                  navigate('/login')
                } else {
                  navigate('/appointment')
                }
              }}
              className='group cursor-pointer'
            >
              <div className='bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-center border-2 border-transparent hover:border-purple-500'>
                <div className='w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform'>
                  <Users className='w-12 h-12 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-slate-900 mb-3'>Patient</h3>
                <p className='text-slate-600 mb-4'>Book appointments, view reports, and track medical history</p>
                <div className='text-purple-600 font-semibold group-hover:text-purple-700'>Book Appointment →</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='relative py-20 overflow-hidden'>
        {/* Background Image with Overlay */}
        <div className='absolute inset-0 z-0'>
          <img 
            src='https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1920&h=800&fit=crop' 
            alt='Medical Background'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-br from-white/98 via-blue-50/95 to-cyan-50/98'></div>
        </div>

        <div className='relative z-10 max-w-6xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-5xl font-bold text-slate-900 mb-4'
            >
              Simple Steps to Get Started
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-xl text-slate-600'
            >
              Book your appointment in 3 easy steps
            </motion.p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className='text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition'
            >
              <div className='w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg'>1</div>
              <h3 className='text-2xl font-bold text-slate-900 mb-3'>Register Account</h3>
              <p className='text-slate-600 leading-relaxed'>Create your account with basic details in under 2 minutes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className='text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition'
            >
              <div className='w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg'>2</div>
              <h3 className='text-2xl font-bold text-slate-900 mb-3'>Choose Doctor</h3>
              <p className='text-slate-600 leading-relaxed'>Browse specialists and select your preferred doctor</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className='text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition'
            >
              <div className='w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg'>3</div>
              <h3 className='text-2xl font-bold text-slate-900 mb-3'>Book Appointment</h3>
              <p className='text-slate-600 leading-relaxed'>Select date & time, confirm booking and get instant confirmation</p>
            </motion.div>
          </div>

          <div className='text-center mt-12'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className='px-8 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 shadow-md'
            >
              Get Started Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gradient-to-r from-sky-600 to-blue-600'>
        <div className='max-w-6xl mx-auto px-4 text-center text-white'>
          <h2 className='text-3xl font-bold mb-4'>Need Emergency Medical Care?</h2>
          <p className='text-xl mb-6 opacity-90'>We're available 24/7 for emergency services</p>
          <div className='flex gap-4 justify-center'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMakeAppointment}
              className='px-8 py-3 bg-white text-sky-600 rounded-lg font-semibold hover:bg-gray-50 shadow-lg'
            >
              Book Appointment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/doctors')}
              className='px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-sky-600'
            >
              View Doctors
            </motion.button>
                    </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50'
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='fixed inset-0 z-50 flex items-center justify-center p-4'
              onClick={() => setSelectedFeature(null)}
            >
              <div 
                onClick={(e) => e.stopPropagation()} 
                className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden'
              >
                {/* Modal Header */}
                <div className='bg-gradient-to-r from-sky-600 to-blue-600 p-6 text-white relative'>
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className='absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors'
                  >
                    <X className='w-6 h-6' />
                  </button>
                  <div className='flex items-center gap-4'>
                    <div className='w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center'>
                      <selectedFeature.icon className='w-8 h-8' />
                    </div>
                    <div>
                      <h2 className='text-3xl font-bold mb-1'>{selectedFeature.title}</h2>
                      <p className='text-sky-100'>{selectedFeature.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className='p-8 overflow-y-auto max-h-[calc(90vh-200px)]'>
                  {/* Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className='mb-8'
                  >
                    <p className='text-lg text-slate-700 leading-relaxed'>
                      {selectedFeature.detailedInfo.overview}
                    </p>
                  </motion.div>

                  {/* Benefits */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='mb-8'
                  >
                    <h3 className='text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2'>
                      <CheckCircle className='w-6 h-6 text-green-600' />
                      Key Benefits
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {selectedFeature.detailedInfo.benefits.map((benefit, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.05 }}
                          className='flex items-start gap-3 bg-green-50 p-3 rounded-lg border border-green-100'
                        >
                          <CheckCircle className='w-5 h-5 text-green-600 flex-shrink-0 mt-0.5' />
                          <span className='text-slate-700'>{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* How It Works */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className='text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2'>
                      <ArrowRight className='w-6 h-6 text-sky-600' />
                      How It Works
                    </h3>
                    <div className='space-y-4'>
                      {selectedFeature.detailedInfo.howItWorks.map((step, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className='flex items-start gap-4 bg-sky-50 p-4 rounded-lg border border-sky-100'
                        >
                          <div className='w-8 h-8 bg-sky-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold'>
                            {idx + 1}
                          </div>
                          <span className='text-slate-700 pt-1'>{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className='mt-8 flex flex-wrap gap-4'
                  >
                    <button
                      onClick={() => {
                        setSelectedFeature(null)
                        const token = localStorage.getItem('token')
                        if (!token) {
                          localStorage.setItem('redirectAfterLogin', '/appointment')
                          alert('Please login to book an appointment')
                          navigate('/login')
                        } else {
                          navigate('/appointment')
                        }
                      }}
                      className='flex-1 min-w-[200px] px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors flex items-center justify-center gap-2'
                    >
                      Book Appointment
                      <ArrowRight className='w-5 h-5' />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFeature(null)
                        navigate('/contact')
                      }}
                      className='flex-1 min-w-[200px] px-6 py-3 bg-white border-2 border-sky-600 text-sky-600 rounded-lg font-semibold hover:bg-sky-50 transition-colors'
                    >
                      Contact Us
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
