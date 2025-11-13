import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Stethoscope, Users, Clock, Award, 
  CheckCircle, Calendar, Heart, Activity, PlayCircle,
  BookOpen, Phone, Mail, ArrowRight, Info, X
} from 'lucide-react'

export default function DepartmentDetail() {
  const { departmentName } = useParams()
  const navigate = useNavigate()
  const [department, setDepartment] = useState(null)
  const [showInfo, setShowInfo] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState(null)

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
      displayImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=800&fit=crop&q=80',
      detailedInfo: [
        { 
          point: 'Comprehensive Primary Care Services',
          description: 'We provide complete healthcare services for all age groups with experienced physicians specializing in preventive medicine and routine health management',
          image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop&q=80',
          color: 'from-blue-500 to-cyan-500'
        },
        { 
          point: 'Advanced Diagnostic Facilities',
          description: 'State-of-the-art laboratory, X-ray, ultrasound, and imaging equipment ensuring accurate diagnosis and timely treatment',
          image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=600&fit=crop&q=80',
          color: 'from-purple-500 to-pink-500'
        },
        { 
          point: 'Preventive Health Programs',
          description: 'Comprehensive health screenings, vaccination programs, and wellness initiatives designed to prevent diseases before they develop',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop&q=80',
          color: 'from-green-500 to-teal-500'
        },
        { 
          point: 'Chronic Disease Management',
          description: 'Expert care for diabetes, hypertension, asthma, and other long-term conditions with personalized treatment plans',
          image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=600&fit=crop&q=80',
          color: 'from-orange-500 to-red-500'
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
      displayImage: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=1200&h=800&fit=crop&q=80',
      detailedInfo: [
        { 
          point: 'Advanced Cardiac Diagnostics',
          description: 'Comprehensive ECG, Echocardiography, stress testing, CT angiography, and advanced cardiac imaging technologies for precise heart condition diagnosis',
          image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&h=600&fit=crop&q=80',
          color: 'from-red-500 to-pink-500'
        },
        { 
          point: 'Interventional Cardiology',
          description: 'Minimally invasive procedures including angioplasty, coronary stenting, pacemaker implantation, and advanced cardiac interventions',
          image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&h=600&fit=crop&q=80',
          color: 'from-rose-500 to-red-500'
        },
        { 
          point: 'Heart Disease Prevention & Management',
          description: 'Comprehensive risk assessment, cholesterol management, hypertension control, and personalized cardiac care programs',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop&q=80',
          color: 'from-pink-500 to-purple-500'
        },
        { 
          point: 'Cardiac Rehabilitation',
          description: 'Structured post-surgery recovery programs, exercise therapy, nutritional counseling, and lifestyle modification support',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80',
          color: 'from-orange-500 to-amber-500'
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
      displayImage: 'https://images.unsplash.com/photo-1582560469781-1965b9af903d?w=1200&h=800&fit=crop&q=80',
      detailedInfo: [
        { 
          point: 'Comprehensive Adult Care',
          description: 'Expert management of complex multi-system diseases, infectious conditions, and chronic adult health issues with personalized treatment approaches',
          image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop&q=80',
          color: 'from-cyan-500 to-blue-500'
        },
        { 
          point: 'Diabetes & Endocrine Care',
          description: 'Comprehensive diabetes management, thyroid disorders, hormonal imbalances, insulin therapy, and metabolic disease treatment',
          image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=600&fit=crop&q=80',
          color: 'from-blue-500 to-indigo-500'
        },
        { 
          point: 'Hypertension & Cardiac Risk Management',
          description: 'Advanced blood pressure monitoring, medication optimization, cardiovascular risk assessment, and preventive cardiology services',
          image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop&q=80',
          color: 'from-purple-500 to-pink-500'
        },
        { 
          point: 'Respiratory & Pulmonary Medicine',
          description: 'Treatment for asthma, COPD, pneumonia, and other respiratory conditions with pulmonary function testing and therapy',
          image: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=800&h=600&fit=crop&q=80',
          color: 'from-teal-500 to-cyan-500'
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
      displayImage: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=1200&h=800&fit=crop&q=80',
      detailedInfo: [
        { 
          point: 'Joint Replacement Surgery',
          description: 'Advanced total hip, knee, and shoulder replacement procedures using latest prosthetic technology with minimally invasive techniques',
          image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&h=600&fit=crop&q=80',
          color: 'from-orange-500 to-red-500'
        },
        { 
          point: 'Sports Medicine & Injury Care',
          description: 'Comprehensive treatment for athletic injuries, ACL reconstruction, ligament repairs, and sports performance optimization',
          image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop&q=80',
          color: 'from-blue-500 to-cyan-500'
        },
        { 
          point: 'Arthroscopic & Minimally Invasive Surgery',
          description: 'Advanced keyhole surgery for joint problems, faster recovery, reduced scarring, and shorter hospital stays',
          image: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=600&fit=crop&q=80',
          color: 'from-purple-500 to-indigo-500'
        },
        { 
          point: 'Spine Surgery & Rehabilitation',
          description: 'Comprehensive spine care including disc replacement, spinal fusion, scoliosis correction, and post-operative physiotherapy',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80',
          color: 'from-green-500 to-teal-500'
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

        {/* Educational GIF & Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className='mb-16'
        >
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-slate-800 mb-3 flex items-center justify-center gap-3'>
              <Info className='w-9 h-9 text-blue-600' />
              Visual Guide & Detailed Information
            </h2>
            <p className='text-slate-600 text-lg max-w-2xl mx-auto'>
              Explore comprehensive information about {department.name} services and specialties
            </p>
          </div>
          
          <div className='max-w-4xl mx-auto'>
            {/* Professional Image Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className='bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl overflow-hidden shadow-2xl mb-8'
            >
              <div className='relative h-96 overflow-hidden bg-slate-100'>
                <img 
                  src={department.displayImage}
                  alt={`${department.name} Services`}
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent'></div>
                
                {/* Overlay Text */}
                <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className='text-3xl font-bold mb-2'>{department.name} Excellence</h3>
                    <p className='text-white/90 text-lg'>Advanced medical care with state-of-the-art facilities</p>
                  </motion.div>
                </div>
              </div>
              
              <div className='p-8 text-center'>
                <h3 className='text-2xl font-bold text-slate-800 mb-3'>
                  Learn More About {department.name}
                </h3>
                <p className='text-slate-600 mb-6'>
                  Click below to explore detailed information with interactive features
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInfo(true)}
                  className='px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto'
                >
                  <Info className='w-6 h-6' />
                  <span>View Detailed Information</span>
                  <ArrowRight className='w-5 h-5' />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Interactive Information Modal */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto'
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className='bg-white rounded-3xl max-w-6xl w-full my-8 shadow-2xl overflow-hidden'
              >
                {/* Modal Header */}
                <div className={`bg-gradient-to-r ${department.color} p-8 text-white relative overflow-hidden`}>
                  <div className='absolute inset-0 opacity-10'>
                    <div className='absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48'></div>
                    <div className='absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mb-32'></div>
                  </div>
                  
                  <button
                    onClick={() => setShowInfo(false)}
                    className='absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:rotate-90 duration-300 z-10'
                  >
                    <X className='w-6 h-6' />
                  </button>
                  
                  <div className='relative z-10'>
                    <h2 className='text-4xl font-bold mb-2'>Detailed Information</h2>
                    <p className='text-white/90 text-lg'>{department.name} Services & Specialties</p>
                  </div>
                </div>

                {/* Modal Body with Interactive Points */}
                <div className='p-8 max-h-[70vh] overflow-y-auto'>
                  <div className='grid md:grid-cols-2 gap-6'>
                    {department.detailedInfo.map((info, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onMouseEnter={() => setHoveredPoint(idx)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className='relative group'
                      >
                        <motion.div
                          animate={{
                            scale: hoveredPoint === idx ? 1.03 : 1,
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className='h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-300'
                        >
                          {/* Image Section */}
                          <div className='relative h-48 overflow-hidden'>
                            <motion.img 
                              src={info.image}
                              alt={info.point}
                              animate={{
                                scale: hoveredPoint === idx ? 1.1 : 1,
                              }}
                              transition={{ duration: 0.4 }}
                              className='w-full h-full object-cover'
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${info.color} opacity-60`}></div>
                            
                            {/* Number Badge */}
                            <motion.div
                              animate={{
                                rotate: hoveredPoint === idx ? 360 : 0,
                                scale: hoveredPoint === idx ? 1.2 : 1,
                              }}
                              transition={{ duration: 0.5 }}
                              className='absolute top-4 left-4 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl'
                            >
                              <span className={`bg-gradient-to-r ${info.color} bg-clip-text text-transparent font-bold text-2xl`}>
                                {idx + 1}
                              </span>
                            </motion.div>

                            {/* Hover Arrow */}
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ 
                                opacity: hoveredPoint === idx ? 1 : 0,
                                x: hoveredPoint === idx ? 0 : -10
                              }}
                              className='absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg'
                            >
                              <ArrowRight className='w-5 h-5 text-blue-600' />
                            </motion.div>
                          </div>

                          {/* Content Section */}
                          <div className={`p-6 bg-gradient-to-br from-white to-slate-50`}>
                            <motion.h3
                              animate={{
                                x: hoveredPoint === idx ? 5 : 0,
                              }}
                              className={`font-bold text-lg mb-3 bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}
                            >
                              {info.point}
                            </motion.h3>
                            <motion.p
                              animate={{
                                opacity: hoveredPoint === idx ? 1 : 0.8,
                              }}
                              className='text-slate-600 text-sm leading-relaxed'
                            >
                              {info.description}
                            </motion.p>

                            {/* Bottom Gradient Bar */}
                            <motion.div
                              animate={{
                                width: hoveredPoint === idx ? '100%' : '0%',
                              }}
                              transition={{ duration: 0.3 }}
                              className={`h-1 bg-gradient-to-r ${info.color} rounded-full mt-4`}
                            ></motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className='bg-gradient-to-r from-slate-50 to-blue-50 p-6 flex justify-center gap-4'>
                  <button
                    onClick={() => {
                      setShowInfo(false)
                      navigate('/appointment')
                    }}
                    className='px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2'
                  >
                    <Calendar className='w-5 h-5' />
                    Book Appointment
                  </button>
                  <button
                    onClick={() => setShowInfo(false)}
                    className='px-6 py-3 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all border-2 border-slate-200 flex items-center gap-2'
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
