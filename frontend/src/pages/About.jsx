import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Target, Eye, Award, Users, Heart, Clock, 
  Truck, Baby, Stethoscope, Brain, Activity,
  Phone, Mail, MapPin, ArrowRight, X, Calendar
} from 'lucide-react'

export default function About(){
  const navigate = useNavigate()
  const [selectedService, setSelectedService] = React.useState(null)
  
  const services = [
    {
      icon: Truck,
      title: 'Emergency Department',
      description: '24/7 emergency care with immediate medical attention for critical conditions',
      color: 'from-blue-500 to-blue-600',
      details: 'Our Emergency Department provides round-the-clock critical care services with advanced trauma management, immediate medical intervention, and a dedicated team of emergency medicine specialists ready to handle life-threatening situations.',
      features: ['24/7 Availability', 'Trauma Care', 'Advanced Life Support', 'Critical Care Units']
    },
    {
      icon: Baby,
      title: 'Pediatric Department',
      description: 'Specialized care for infants, children, and adolescents with expert pediatricians',
      color: 'from-cyan-500 to-cyan-600',
      details: 'Our Pediatric Department offers comprehensive healthcare for children from newborns to adolescents. We provide preventive care, treatment of acute and chronic illnesses, developmental assessments, vaccinations, and family-centered care in a child-friendly environment.',
      features: ['Newborn Care', 'Vaccination Programs', 'Growth Monitoring', 'Child Psychology']
    },
    {
      icon: Stethoscope,
      title: 'General Physician',
      description: 'Primary healthcare services for diagnosis, treatment, and preventive care',
      color: 'from-blue-500 to-blue-600',
      details: 'Our General Physicians provide comprehensive primary care including routine check-ups, diagnosis and treatment of common illnesses, health screenings, preventive care, and management of chronic conditions. They serve as your first point of contact for all health concerns.',
      features: ['Health Check-ups', 'Disease Management', 'Preventive Care', 'Medical Consultations']
    },
    {
      icon: Brain,
      title: 'Neurology Department',
      description: 'Advanced diagnosis and treatment of nervous system disorders and brain conditions',
      color: 'from-blue-400 to-blue-500',
      details: 'Our Neurology Department specializes in diagnosing and treating disorders of the brain, spinal cord, and nervous system. We offer advanced neurological testing, stroke care, epilepsy management, headache treatment, and care for neurodegenerative diseases.',
      features: ['Stroke Care', 'Epilepsy Treatment', 'Neurological Testing', 'Brain Imaging']
    },
    {
      icon: Activity,
      title: 'Cardiology Department',
      description: 'Comprehensive heart care with advanced cardiac diagnostics and treatment',
      color: 'from-blue-500 to-blue-600',
      details: 'Our Cardiology Department provides complete cardiovascular care including diagnosis, treatment, and prevention of heart diseases. We offer advanced cardiac testing, heart disease management, interventional cardiology, and cardiac rehabilitation programs.',
      features: ['ECG & Echo Tests', 'Heart Disease Management', 'Cardiac Surgery', 'Preventive Cardiology']
    }
  ]

  const stats = [
    { icon: Users, value: '100+', label: 'Expert Doctors', color: 'text-sky-600' },
    { icon: Heart, value: '10k+', label: 'Happy Patients', color: 'text-red-500' },
    { icon: Clock, value: '24/7', label: 'Emergency Care', color: 'text-green-600' },
    { icon: Award, value: '15+', label: 'Years Experience', color: 'text-amber-600' }
  ]

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section with Blue Background */}
      <section className='relative bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 py-16 lg:py-20'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className='text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight'>
                <span className='text-blue-600'>Hospital</span> Management
              </h1>
              <h2 className='text-3xl lg:text-4xl font-bold text-slate-700 mb-6'>
                Your Partner In Health
                <br />
                and Wellness
              </h2>
              <p className='text-slate-600 text-lg mb-8 leading-relaxed max-w-xl'>
                It is a long established fact that a reader will be distracted by the readable content of a 
                page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less 
                normal distribution of letters, as opposed to using.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/appointment')}
                className='px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl'
              >
                BOOK AN APPOINTMENT
              </motion.button>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='relative'
            >
              {/* Decorative Elements */}
              <div className='absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20'></div>
              <div className='absolute bottom-20 right-10 w-16 h-16 bg-cyan-400 rounded-full opacity-20'></div>
              <div className='absolute top-1/4 right-0 text-blue-400 text-6xl font-bold opacity-30'>+</div>
              <div className='absolute bottom-1/4 left-0 text-cyan-400 text-6xl font-bold opacity-30'>+</div>
              
              {/* Doctor Image */}
              <div className='relative z-10'>
                <img 
                  src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=700&fit=crop'
                  alt='Healthcare Professional'
                  className='rounded-3xl shadow-2xl w-full max-w-md mx-auto'
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Healthcare Services Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-12'
          >
            <h2 className='text-4xl font-bold text-slate-800 mb-4'>Our Healthcare Service</h2>
            <p className='text-slate-600 max-w-2xl mx-auto'>
              It is a long established fact that a reader will be distracted by the readable 
              content of a page when looking at its layout.
            </p>
          </motion.div>

          {/* Service Cards Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
            {services.slice(0, 3).map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setSelectedService(service)}
                className={`bg-gradient-to-br ${service.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all cursor-pointer`}
              >
                <div className='flex flex-col gap-4'>
                  <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
                    <service.icon className='w-8 h-8 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold mb-2'>{service.title}</h3>
                    <p className='text-white/90 text-sm mb-3'>{service.description}</p>
                    <button className='text-white font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all'>
                      Learn More <ArrowRight className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Row - Centered */}
          <div className='flex flex-wrap justify-center gap-6'>
            {services.slice(3, 5).map((service, idx) => (
              <motion.div
                key={idx + 3}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx + 3) * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setSelectedService(service)}
                className={`bg-gradient-to-br ${service.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all cursor-pointer w-full max-w-md`}
              >
                <div className='flex flex-col gap-4'>
                  <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
                    <service.icon className='w-8 h-8 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold mb-2'>{service.title}</h3>
                    <p className='text-white/90 text-sm mb-3'>{service.description}</p>
                    <button className='text-white font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all'>
                      Learn More <ArrowRight className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-12 bg-gradient-to-br from-slate-50 to-blue-50'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className='bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all'
              >
                <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
                <h3 className='text-3xl font-bold text-slate-900 mb-1'>{stat.value}</h3>
                <p className='text-slate-600 text-sm'>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid md:grid-cols-2 gap-8'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-lg'
            >
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center'>
                  <Eye className='w-7 h-7 text-white' />
                </div>
                <h2 className='text-2xl font-bold text-slate-900'>Our Vision</h2>
              </div>
              <p className='text-slate-700 leading-relaxed'>
                To be the leading healthcare provider in the region, recognized for excellence in patient care, 
                medical innovation, and community service. We strive to make quality healthcare accessible to 
                everyone through technology and compassion.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl shadow-lg'
            >
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-14 h-14 bg-cyan-500 rounded-xl flex items-center justify-center'>
                  <Target className='w-7 h-7 text-white' />
                </div>
                <h2 className='text-2xl font-bold text-slate-900'>Our Mission</h2>
              </div>
              <p className='text-slate-700 leading-relaxed'>
                To deliver exceptional healthcare services with dignity, respect, and compassion. We are committed 
                to continuous improvement in medical practices, patient safety, and creating a healing environment 
                for all who seek our care.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className='py-16 bg-gradient-to-br from-slate-50 to-blue-50'>
        <div className='max-w-7xl mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-12'
          >
            <h2 className='text-4xl font-bold text-slate-900 mb-4'>Our Core Values</h2>
            <p className='text-slate-600 max-w-2xl mx-auto'>
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className='grid md:grid-cols-3 gap-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all'
            >
              <div className='w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Heart className='w-10 h-10 text-white' />
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-3'>Compassion</h3>
              <p className='text-slate-600'>We treat every patient with kindness, empathy, and understanding</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className='bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all'
            >
              <div className='w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Award className='w-10 h-10 text-white' />
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-3'>Excellence</h3>
              <p className='text-slate-600'>We maintain the highest standards in medical care and service</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className='bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all'
            >
              <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Users className='w-10 h-10 text-white' />
              </div>
              <h3 className='text-xl font-bold text-slate-900 mb-3'>Collaboration</h3>
              <p className='text-slate-600'>We work together as a team to provide comprehensive care</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-12'
          >
            <h2 className='text-4xl font-bold text-slate-800 mb-4'>Our Departments</h2>
            <p className='text-slate-600 max-w-2xl mx-auto'>
              Comprehensive healthcare services across multiple specializations with expert medical professionals
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto'>
            {/* General Medicine */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group'
            >
              <div className='relative h-48 overflow-hidden'>
                <img 
                  src='https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500&h=300&fit=crop'
                  alt='General Medicine'
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-slate-800 mb-2'>General Medicine</h3>
                <p className='text-slate-600 text-sm mb-4'>
                  Provides comprehensive healthcare services including routine check-ups, preventive care, and treatment for a wide range of medical conditions.
                </p>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex -space-x-2'>
                    <img src='https://i.pravatar.cc/40?img=1' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=2' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=3' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=4' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=5' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                  </div>
                  <span className='text-sm text-slate-500'>+ 15 others</span>
                </div>
                <button 
                  onClick={() => navigate('/doctors')}
                  className='w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all'
                >
                  See Detail
                </button>
              </div>
            </motion.div>

            {/* Cardiology */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group'
            >
              <div className='relative h-48 overflow-hidden'>
                <img 
                  src='https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=500&h=300&fit=crop'
                  alt='Cardiology'
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-slate-800 mb-2'>Cardiology</h3>
                <p className='text-slate-600 text-sm mb-4'>
                  Specializes in the diagnosis and treatment of heart-related conditions, offering advanced cardiac care and preventive cardiology services.
                </p>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex -space-x-2'>
                    <img src='https://i.pravatar.cc/40?img=11' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=12' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=13' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=14' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=15' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                  </div>
                  <span className='text-sm text-slate-500'>+ 10 others</span>
                </div>
                <button 
                  onClick={() => navigate('/doctors')}
                  className='w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all'
                >
                  See Detail
                </button>
              </div>
            </motion.div>

            {/* Internal Medicine */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group'
            >
              <div className='relative h-48 overflow-hidden'>
                <img 
                  src='https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&h=300&fit=crop'
                  alt='Internal Medicine'
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-slate-800 mb-2'>Internal Medicine</h3>
                <p className='text-slate-600 text-sm mb-4'>
                  Provides primary care for adults, focusing on the prevention, diagnosis, and treatment of adult diseases and chronic conditions.
                </p>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex -space-x-2'>
                    <img src='https://i.pravatar.cc/40?img=41' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=42' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=43' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=44' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                  </div>
                  <span className='text-sm text-slate-500'>+ 12 others</span>
                </div>
                <button 
                  onClick={() => navigate('/doctors')}
                  className='w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all'
                >
                  See Detail
                </button>
              </div>
            </motion.div>

            {/* Orthopedics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group'
            >
              <div className='relative h-48 overflow-hidden'>
                <img 
                  src='https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=500&h=300&fit=crop'
                  alt='Orthopedics'
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-slate-800 mb-2'>Orthopedics</h3>
                <p className='text-slate-600 text-sm mb-4'>
                  Specializes in the treatment of musculoskeletal system disorders, including bones, joints, ligaments, tendons, and muscles.
                </p>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex -space-x-2'>
                    <img src='https://i.pravatar.cc/40?img=51' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=52' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=53' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=54' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=51' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                    <img src='https://i.pravatar.cc/40?img=53' alt='Doctor' className='w-8 h-8 rounded-full border-2 border-white' />
                  </div>
                  <span className='text-sm text-slate-500'>+ 9 others</span>
                </div>
                <button 
                  onClick={() => navigate('/doctors')}
                  className='w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all'
                >
                  See Details
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className='py-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-white'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className='text-4xl font-bold mb-4'>Ready to Get Started?</h2>
            <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
              Book an appointment with our expert doctors today and experience world-class healthcare
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <button 
                onClick={() => navigate('/appointment')}
                className='px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2'
              >
                Book Appointment
                <ArrowRight className='w-5 h-5' />
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className='px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2'
              >
                <Phone className='w-5 h-5' />
                +1 123 456 7890
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Details Modal */}
      {selectedService && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedService(null)}
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className='bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl'
          >
            {/* Modal Header with Gradient */}
            <div className={`bg-gradient-to-br ${selectedService.color} p-10 text-white rounded-t-3xl relative overflow-hidden`}>
              {/* Decorative Elements */}
              <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32'></div>
              <div className='absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24'></div>
              
              <button
                onClick={() => setSelectedService(null)}
                className='absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:rotate-90 duration-300 z-10'
              >
                <X className='w-6 h-6' />
              </button>
              
              <div className='relative z-10'>
                <div className='flex items-center gap-6 mb-6'>
                  <div className='w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg'>
                    <selectedService.icon className='w-12 h-12 text-white' />
                  </div>
                  <div>
                    <h2 className='text-4xl font-bold mb-2'>{selectedService.title}</h2>
                    <p className='text-white/90 text-lg'>{selectedService.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body with Beautiful Layout */}
            <div className='p-10'>
              {/* About Section with Card Style */}
              <div className='mb-8'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full'></div>
                  <h3 className='text-2xl font-bold text-slate-800'>About This Service</h3>
                </div>
                <div className='bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl border border-slate-100'>
                  <p className='text-slate-700 text-lg leading-relaxed'>{selectedService.details}</p>
                </div>
              </div>

              {/* Features in Beautiful Grid */}
              <div className='mb-8'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full'></div>
                  <h3 className='text-2xl font-bold text-slate-800'>Key Features & Services</h3>
                </div>
                <div className='grid md:grid-cols-2 gap-4'>
                  {selectedService.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className='group bg-white p-5 rounded-xl border-2 border-slate-100 hover:border-blue-200 transition-all hover:shadow-lg'
                    >
                      <div className='flex items-center gap-4'>
                        <div className={`w-12 h-12 bg-gradient-to-br ${selectedService.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                          <Heart className='w-6 h-6 text-white' />
                        </div>
                        <div>
                          <span className='text-slate-800 font-semibold text-lg'>{feature}</span>
                          <div className='w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300'></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Why Choose Us Section */}
              <div className='mb-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 p-6 rounded-2xl'>
                <h3 className='text-xl font-bold text-slate-800 mb-4 flex items-center gap-2'>
                  <Award className='w-6 h-6 text-blue-600' />
                  Why Choose Our {selectedService.title}?
                </h3>
                <ul className='space-y-3'>
                  <li className='flex items-start gap-3 text-slate-700'>
                    <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <span className='text-white text-xs font-bold'>✓</span>
                    </div>
                    <span>Expert medical professionals with years of experience</span>
                  </li>
                  <li className='flex items-start gap-3 text-slate-700'>
                    <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <span className='text-white text-xs font-bold'>✓</span>
                    </div>
                    <span>State-of-the-art medical equipment and technology</span>
                  </li>
                  <li className='flex items-start gap-3 text-slate-700'>
                    <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <span className='text-white text-xs font-bold'>✓</span>
                    </div>
                    <span>Comprehensive care with a patient-centered approach</span>
                  </li>
                  <li className='flex items-start gap-3 text-slate-700'>
                    <div className='w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <span className='text-white text-xs font-bold'>✓</span>
                    </div>
                    <span>24/7 support and emergency services available</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons with Beautiful Design */}
              <div className='flex gap-4'>
                <button
                  onClick={() => {
                    setSelectedService(null)
                    navigate('/appointment')
                  }}
                  className='flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group'
                >
                  <Calendar className='w-5 h-5 group-hover:scale-110 transition-transform' />
                  Book Appointment
                </button>
                <button
                  onClick={() => {
                    setSelectedService(null)
                    navigate('/doctors')
                  }}
                  className='flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-xl font-semibold hover:border-blue-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group'
                >
                  <Users className='w-5 h-5 group-hover:scale-110 transition-transform' />
                  View Our Doctors
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
