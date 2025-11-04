import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Stethoscope, Users, Clock, Award, 
  CheckCircle, Calendar, Heart, Activity, PlayCircle,
  BookOpen, Phone, Mail
} from 'lucide-react'

export default function DepartmentDetail() {
  const { departmentName } = useParams()
  const navigate = useNavigate()
  const [department, setDepartment] = useState(null)

  const departmentData = {
    'general-medicine': {
      name: 'General Medicine',
      icon: Stethoscope,
      color: 'from-blue-500 to-blue-600',
      banner: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=400&fit=crop',
      description: 'General Medicine provides comprehensive healthcare services for a wide range of medical conditions. Our experienced physicians offer routine check-ups, preventive care, diagnosis, and treatment for acute and chronic illnesses.',
      fullDescription: 'The General Medicine department serves as the cornerstone of our healthcare services, providing primary and comprehensive medical care for adults. Our team of highly qualified general physicians is dedicated to diagnosing, treating, and managing a wide spectrum of medical conditions. We focus on preventive healthcare, early disease detection, and long-term health management to ensure our patients maintain optimal health throughout their lives.',
      services: [
        'Routine Health Check-ups and Physical Examinations',
        'Management of Chronic Diseases (Diabetes, Hypertension)',
        'Preventive Care and Health Screening',
        'Diagnosis and Treatment of Infectious Diseases',
        'Vaccination and Immunization Services',
        'Health Counseling and Lifestyle Advice',
        'Minor Procedures and Wound Care',
        'Referral to Specialized Departments'
      ],
      features: [
        { title: '24/7 Availability', description: 'Round-the-clock medical care for emergencies and consultations', icon: Clock },
        { title: 'Expert Physicians', description: 'Team of highly qualified and experienced general practitioners', icon: Award },
        { title: 'Advanced Diagnostics', description: 'State-of-the-art diagnostic facilities for accurate diagnosis', icon: Activity },
        { title: 'Patient-Centered Care', description: 'Personalized treatment plans tailored to individual needs', icon: Heart }
      ],
      videos: [
        {
          id: 'DHvbm_4O3KM',
          title: 'Introduction to General Medicine',
          description: 'Understanding the role and importance of general medicine in healthcare'
        },
        {
          id: 'SYU3LN5RbEQ',
          title: 'Common Health Issues & Prevention',
          description: 'Learn about common health problems and preventive measures'
        },
        {
          id: 'DFw8q-WTAAM',
          title: 'Importance of Regular Check-ups',
          description: 'Why regular health screenings are crucial for early disease detection'
        }
      ],
      whyChooseUs: [
        'Experienced team of general physicians with extensive medical expertise',
        'Comprehensive diagnostic facilities under one roof',
        'Patient-friendly environment with short waiting times',
        'Evidence-based treatment approaches',
        'Affordable and transparent pricing',
        'Electronic health records for seamless care coordination'
      ]
    },
    'cardiology': {
      name: 'Cardiology',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      banner: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=1200&h=400&fit=crop',
      description: 'Our Cardiology department specializes in the diagnosis and treatment of heart-related conditions, offering advanced cardiac care and preventive cardiology services with state-of-the-art technology.',
      fullDescription: 'The Cardiology department is equipped with cutting-edge technology and staffed by renowned cardiologists who specialize in diagnosing, treating, and preventing cardiovascular diseases. We offer comprehensive cardiac care ranging from routine heart health assessments to advanced interventional procedures. Our goal is to provide world-class cardiac care that improves patient outcomes and quality of life.',
      services: [
        'Comprehensive Cardiac Evaluations and Risk Assessment',
        'ECG, Echocardiography, and Stress Testing',
        'Coronary Angiography and Angioplasty',
        'Pacemaker and ICD Implantation',
        'Heart Failure Management',
        'Arrhythmia Diagnosis and Treatment',
        'Preventive Cardiology and Lifestyle Counseling',
        'Cardiac Rehabilitation Programs'
      ],
      features: [
        { title: 'Advanced Technology', description: 'Latest cardiac imaging and intervention equipment', icon: Activity },
        { title: 'Expert Cardiologists', description: 'Board-certified specialists with extensive experience', icon: Award },
        { title: 'Emergency Services', description: '24/7 emergency cardiac care available', icon: Clock },
        { title: 'Holistic Approach', description: 'Complete cardiac care from prevention to rehabilitation', icon: Heart }
      ],
      videos: [
        {
          id: 'HuDHbLMzumA',
          title: 'Understanding Heart Disease',
          description: 'Learn about different types of heart conditions and their symptoms'
        },
        {
          id: 'kWxLN2mdgHk',
          title: 'Heart Attack: Signs & Prevention',
          description: 'Recognize warning signs and learn how to prevent heart attacks'
        },
        {
          id: 'YhqZubykqWI',
          title: 'Cardiac Rehabilitation',
          description: 'The importance of rehabilitation after cardiac procedures'
        }
      ],
      whyChooseUs: [
        'State-of-the-art cardiac catheterization laboratory',
        'Experienced team of interventional cardiologists',
        'Comprehensive pre and post-operative care',
        'Advanced heart failure management programs',
        'Preventive cardiology and risk assessment clinics',
        'Dedicated cardiac ICU with 24/7 monitoring'
      ]
    },
    'internal-medicine': {
      name: 'Internal Medicine',
      icon: Activity,
      color: 'from-cyan-500 to-blue-600',
      banner: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=400&fit=crop',
      description: 'Internal Medicine provides primary care for adults, focusing on the prevention, diagnosis, and treatment of adult diseases and chronic conditions with a holistic approach.',
      fullDescription: 'The Internal Medicine department specializes in the comprehensive care of adults, focusing on the diagnosis and management of complex medical conditions. Our internists are trained to handle a wide range of health issues, from common illnesses to complex, multi-system diseases. We emphasize preventive care, early disease detection, and the management of chronic conditions to help our patients maintain optimal health.',
      services: [
        'Comprehensive Adult Health Assessments',
        'Management of Chronic Diseases (Diabetes, Hypertension, COPD)',
        'Infectious Disease Diagnosis and Treatment',
        'Endocrine Disorder Management',
        'Gastroenterology Consultations',
        'Rheumatology and Autoimmune Disease Care',
        'Geriatric Medicine and Elder Care',
        'Pre-operative Medical Clearance'
      ],
      features: [
        { title: 'Comprehensive Care', description: 'Complete medical management for adult patients', icon: Stethoscope },
        { title: 'Disease Prevention', description: 'Focus on preventive healthcare and wellness', icon: Heart },
        { title: 'Chronic Disease Management', description: 'Expert care for long-term health conditions', icon: Activity },
        { title: 'Multidisciplinary Approach', description: 'Coordinated care with specialists', icon: Users }
      ],
      videos: [
        {
          id: 'OoSGtimpLiE',
          title: 'Internal Medicine Overview',
          description: 'What is internal medicine and what do internists do?'
        },
        {
          id: 'aUaInS6HIGo',
          title: 'Managing Chronic Diseases',
          description: 'Effective strategies for managing long-term health conditions'
        },
        {
          id: 'TFY9i_QJZUA',
          title: 'Preventive Healthcare',
          description: 'The importance of preventive care in adult health'
        }
      ],
      whyChooseUs: [
        'Board-certified internal medicine specialists',
        'Comprehensive diagnostic and treatment facilities',
        'Focus on preventive care and wellness programs',
        'Expertise in managing complex medical conditions',
        'Coordinated care with subspecialists',
        'Patient education and self-management support'
      ]
    },
    'orthopedics': {
      name: 'Orthopedics',
      icon: Activity,
      color: 'from-orange-500 to-red-600',
      banner: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&h=400&fit=crop',
      description: 'Orthopedics specializes in the treatment of musculoskeletal system disorders, including bones, joints, ligaments, tendons, and muscles with advanced surgical and non-surgical treatments.',
      fullDescription: 'The Orthopedics department offers comprehensive care for all musculoskeletal conditions, from sports injuries to degenerative joint diseases. Our team of skilled orthopedic surgeons and specialists provides both surgical and non-surgical treatments, utilizing the latest techniques and technologies. We are committed to restoring mobility, reducing pain, and improving the quality of life for our patients.',
      services: [
        'Joint Replacement Surgery (Hip, Knee, Shoulder)',
        'Arthroscopic Surgery for Sports Injuries',
        'Fracture Treatment and Trauma Care',
        'Spine Surgery and Back Pain Management',
        'Hand and Foot Surgery',
        'Pediatric Orthopedics',
        'Sports Medicine and Injury Prevention',
        'Physical Therapy and Rehabilitation'
      ],
      features: [
        { title: 'Advanced Surgery', description: 'Minimally invasive surgical techniques', icon: Activity },
        { title: 'Expert Surgeons', description: 'Highly skilled orthopedic specialists', icon: Award },
        { title: 'Sports Medicine', description: 'Specialized care for athletic injuries', icon: Users },
        { title: 'Rehabilitation', description: 'Comprehensive post-operative physiotherapy', icon: Heart }
      ],
      videos: [
        {
          id: 'Z41CPJcwZpE',
          title: 'Understanding Orthopedics',
          description: 'Overview of orthopedic conditions and treatments'
        },
        {
          id: 'lq-3KkJXHWQ',
          title: 'Joint Replacement Surgery',
          description: 'What to expect from hip and knee replacement procedures'
        },
        {
          id: 'wV91SDvHbbQ',
          title: 'Sports Injury Prevention',
          description: 'Tips to prevent common sports-related injuries'
        }
      ],
      whyChooseUs: [
        'State-of-the-art orthopedic operation theaters',
        'Experienced team of orthopedic surgeons and specialists',
        'Advanced imaging facilities (X-ray, MRI, CT)',
        'Minimally invasive surgical techniques',
        'Comprehensive rehabilitation and physiotherapy',
        'Specialized sports medicine clinic'
      ]
    }
  }

  useEffect(() => {
    const dept = departmentData[departmentName]
    if (dept) {
      setDepartment(dept)
    }
  }, [departmentName])

  if (!department) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-slate-800 mb-4'>Department not found</h2>
          <button 
            onClick={() => navigate('/about')}
            className='px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition'
          >
            Back to About
          </button>
        </div>
      </div>
    )
  }

  const Icon = department.icon

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Banner */}
      <div className='relative h-96 overflow-hidden'>
        <img 
          src={department.banner} 
          alt={department.name}
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/70 to-black/40'></div>
        <div className='absolute inset-0 flex items-center'>
          <div className='max-w-7xl mx-auto px-4 w-full'>
            <button
              onClick={() => navigate('/about')}
              className='mb-6 flex items-center gap-2 text-white hover:text-blue-200 transition'
            >
              <ArrowLeft className='w-5 h-5' />
              <span className='font-semibold'>Back to About</span>
            </button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className='flex items-center gap-4 mb-4'>
                <div className={`w-20 h-20 bg-gradient-to-br ${department.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                  <Icon className='w-10 h-10 text-white' />
                </div>
                <h1 className='text-5xl font-bold text-white'>{department.name}</h1>
              </div>
              <p className='text-xl text-white/90 max-w-3xl'>{department.description}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 py-16'>
        {/* About Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='mb-16'
        >
          <h2 className='text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3'>
            <BookOpen className='w-8 h-8 text-blue-600' />
            About {department.name}
          </h2>
          <p className='text-lg text-slate-700 leading-relaxed'>{department.fullDescription}</p>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='mb-16'
        >
          <h2 className='text-3xl font-bold text-slate-800 mb-8'>Key Features</h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {department.features.map((feature, idx) => {
              const FeatureIcon = feature.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className='bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 hover:shadow-lg transition'
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${department.color} rounded-xl flex items-center justify-center mb-4`}>
                    <FeatureIcon className='w-7 h-7 text-white' />
                  </div>
                  <h3 className='text-lg font-bold text-slate-800 mb-2'>{feature.title}</h3>
                  <p className='text-slate-600 text-sm'>{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='mb-16'
        >
          <h2 className='text-3xl font-bold text-slate-800 mb-8'>Our Services</h2>
          <div className='grid md:grid-cols-2 gap-4'>
            {department.services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.05 }}
                className='flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition'
              >
                <CheckCircle className='w-6 h-6 text-green-600 flex-shrink-0 mt-0.5' />
                <span className='text-slate-700 font-medium'>{service}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Educational Videos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className='mb-16'
        >
          <h2 className='text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3'>
            <PlayCircle className='w-8 h-8 text-blue-600' />
            Educational Videos
          </h2>
          <p className='text-slate-600 mb-8'>Learn more about {department.name} through these informative videos</p>
          <div className='grid md:grid-cols-3 gap-6'>
            {department.videos.map((video, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition group'
              >
                <div className='relative aspect-video bg-slate-900'>
                  <iframe
                    className='w-full h-full'
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  ></iframe>
                </div>
                <div className='p-4'>
                  <h3 className='font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition'>{video.title}</h3>
                  <p className='text-sm text-slate-600'>{video.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose Us */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className='mb-16'
        >
          <h2 className='text-3xl font-bold text-slate-800 mb-8'>Why Choose Us?</h2>
          <div className='bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100'>
            <div className='grid md:grid-cols-2 gap-4'>
              {department.whyChooseUs.map((reason, idx) => (
                <div key={idx} className='flex items-start gap-3'>
                  <div className='w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <CheckCircle className='w-4 h-4 text-white' />
                  </div>
                  <span className='text-slate-700'>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className='bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-12 text-center text-white'
        >
          <h2 className='text-3xl font-bold mb-4'>Ready to Get Started?</h2>
          <p className='text-xl mb-8 text-blue-100'>Book an appointment with our expert doctors today</p>
          <div className='flex flex-wrap justify-center gap-4'>
            <button
              onClick={() => navigate('/appointment')}
              className='px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-blue-50 transition shadow-lg flex items-center gap-2'
            >
              <Calendar className='w-5 h-5' />
              Book Appointment
            </button>
            <button
              onClick={() => navigate('/doctors')}
              className='px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition flex items-center gap-2'
            >
              <Users className='w-5 h-5' />
              View Our Doctors
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
