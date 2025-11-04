import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import About from './pages/About'
import Doctors from './pages/Doctors'
import Layout from './components/Layout'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import AdminRegister from './pages/AdminRegister'
import Register from './pages/Register'
import AppointmentPage from './pages/Appointment'
import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/UserDashboard'
import PatientDashboard from './pages/PatientDashboard'
import AllData from './pages/AllData'
import Contact from './pages/Contact'
import Pharmacy from './pages/Pharmacy'
import CheckAvailability from './pages/CheckAvailability'
import TestAvailability from './pages/TestAvailability'
import WardManagement from './pages/WardManagement'
import AdmitPatient from './pages/AdmitPatient'
import DischargePatient from './pages/DischargePatient'
import DepartmentDetail from './pages/DepartmentDetail'

function App(){
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard routes without Layout (have their own navigation) */}
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/user-dashboard' element={<UserDashboard/>} />
        <Route path='/patient-dashboard' element={<PatientDashboard/>} />
        <Route path='/all-data' element={<AllData/>} />
        <Route path='/pharmacy' element={<Pharmacy/>} />
        <Route path='/wards' element={<WardManagement/>} />
        <Route path='/wards/admit' element={<AdmitPatient/>} />
        <Route path='/wards/discharge/:patientId' element={<DischargePatient/>} />
        
        {/* All other routes with Layout */}
        <Route path='/*' element={
          <Layout>
            <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='/about' element={<About/>} />
              <Route path='/department/:departmentName' element={<DepartmentDetail/>} />
              <Route path='/doctors' element={<Doctors/>} />
              <Route path='/check-availability' element={<CheckAvailability/>} />
              <Route path='/test-availability' element={<TestAvailability/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/admin-login' element={<AdminLogin/>} />
              <Route path='/admin-register' element={<AdminRegister/>} />
              <Route path='/register' element={<Register/>} />
              <Route path='/appointment' element={<AppointmentPage/>} />
              <Route path='/contact' element={<Contact/>} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
