import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import { CalendarDays, FileText, Home, LogOut, MessageSquare, Stethoscope, Download, Eye, User } from 'lucide-react'

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [doctorName, setDoctorName] = useState('Doctor')
  const [selectedPreview, setSelectedPreview] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      nav('/login')
      return
    }

    const payload = JSON.parse(atob(token.split('.')[1]))
    setDoctorName(payload.name || 'Doctor')
    API.setToken(token)

    Promise.all([
      API.get('/appointments'),
      API.get('/reports/doctor')
    ])
      .then(([appointmentsRes, reportsRes]) => {
        const assignedAppointments = (appointmentsRes.data || []).filter((appt) => {
          const doctorId = appt.doctorId?._id || appt.doctorId
          return String(doctorId) === String(payload.id)
        })

        setAppointments(assignedAppointments)
        setReports(reportsRes.data || [])
      })
      .catch((err) => {
        console.error('Doctor dashboard error:', err)
      })
      .finally(() => setLoading(false))
  }, [nav])

  const handoffSummary = useMemo(() => {
    return appointments.filter((appt) => appt.aiSummary || appt.recommendedDepartment || appt.recommendedDoctor)
  }, [appointments])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    nav('/login')
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-sky-600 mx-auto'></div>
          <p className='mt-4 text-slate-600 text-lg'>Loading doctor dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-100'>
      <div className='bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm'>
        <div className='flex items-center gap-3'>
          <div className='bg-sky-100 text-sky-700 rounded-xl p-2'>
            <Stethoscope className='w-5 h-5' />
          </div>
          <div>
            <p className='text-sm text-slate-500'>Doctor Portal</p>
            <h1 className='text-2xl font-bold text-slate-900'>{doctorName}</h1>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => nav('/')}
            className='flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700'
          >
            <Home className='w-4 h-4' />
            Home
          </button>
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </button>
        </div>
      </div>

      <div className='p-6 space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-2xl p-5 shadow-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm opacity-80'>Assigned patients</p>
                <h2 className='text-3xl font-bold mt-2'>{appointments.length}</h2>
              </div>
              <User className='w-10 h-10 opacity-80' />
            </div>
          </div>
          <div className='bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl p-5 shadow-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm opacity-80'>AI handoff summaries</p>
                <h2 className='text-3xl font-bold mt-2'>{handoffSummary.length}</h2>
              </div>
              <MessageSquare className='w-10 h-10 opacity-80' />
            </div>
          </div>
          <div className='bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl p-5 shadow-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm opacity-80'>Uploaded records</p>
                <h2 className='text-3xl font-bold mt-2'>{reports.length}</h2>
              </div>
              <FileText className='w-10 h-10 opacity-80' />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-6'>
          <div className='bg-white rounded-2xl shadow border border-slate-200 p-5'>
            <div className='flex items-center gap-3 mb-4'>
              <CalendarDays className='w-5 h-5 text-sky-600' />
              <h3 className='text-xl font-bold text-slate-900'>Appointment handoff queue</h3>
            </div>

            {appointments.length === 0 ? (
              <div className='rounded-xl border border-dashed border-slate-300 p-5 text-slate-500'>No assigned appointments yet.</div>
            ) : (
              <div className='space-y-3'>
                {appointments.map((appt) => (
                  <div key={appt._id} className='rounded-xl border border-slate-200 p-4 bg-slate-50'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='font-bold text-slate-900'> {appt.patientId?.name || 'Patient'}</p>
                        <p className='text-sm text-slate-600'>{appt.reason || 'General consultation'}</p>
                      </div>
                      <span className='text-xs font-semibold uppercase tracking-wide bg-sky-100 text-sky-700 px-2 py-1 rounded-full'>
                        {appt.status || 'scheduled'}
                      </span>
                    </div>

                    <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600'>
                      <div>
                        <span className='font-semibold text-slate-800'>Date:</span> {appt.date ? new Date(appt.date).toLocaleDateString() : 'Not set'}
                      </div>
                      <div>
                        <span className='font-semibold text-slate-800'>Time:</span> {appt.time || 'Not set'}
                      </div>
                      <div>
                        <span className='font-semibold text-slate-800'>Department:</span> {appt.recommendedDepartment || 'General Medicine'}
                      </div>
                      <div>
                        <span className='font-semibold text-slate-800'>Recommended doctor:</span> {appt.recommendedDoctor || appt.doctorId?.name || 'Doctor'}
                      </div>
                    </div>

                    {appt.aiSummary && (
                      <div className='mt-4 rounded-xl bg-white border border-sky-200 p-3'>
                        <p className='text-xs font-semibold uppercase tracking-wide text-sky-700'>AI summary</p>
                        <p className='mt-2 text-sm text-slate-700'>{appt.aiSummary}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='bg-white rounded-2xl shadow border border-slate-200 p-5'>
            <div className='flex items-center gap-3 mb-4'>
              <FileText className='w-5 h-5 text-emerald-600' />
              <h3 className='text-xl font-bold text-slate-900'>Associated records</h3>
            </div>

            {reports.length === 0 ? (
              <div className='rounded-xl border border-dashed border-slate-300 p-5 text-slate-500'>No patient records shared yet.</div>
            ) : (
              <div className='space-y-3'>
                {reports.map((report) => (
                  <div key={report._id} className='rounded-xl border border-slate-200 p-3 bg-slate-50'>
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <p className='font-semibold text-slate-900'>{report.originalName || report.fileName || report.type}</p>
                        <p className='text-xs text-slate-500'>{report.type}</p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <button
                          type='button'
                          onClick={() => setSelectedPreview(report)}
                          className='p-2 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200'
                          title='Preview'
                        >
                          <Eye className='w-4 h-4' />
                        </button>
                        <a href={report.fileURL} target='_blank' rel='noreferrer' className='p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200' title='Open'>
                          <Download className='w-4 h-4' />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedPreview && (
        <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4' onClick={() => setSelectedPreview(null)}>
          <div className='bg-white rounded-2xl max-w-4xl w-full overflow-hidden' onClick={(event) => event.stopPropagation()}>
            <div className='flex items-center justify-between p-4 border-b border-slate-200'>
              <div>
                <h4 className='font-bold text-slate-900'>{selectedPreview.originalName || selectedPreview.fileName || selectedPreview.type}</h4>
                <p className='text-sm text-slate-500'>{selectedPreview.type}</p>
              </div>
              <button onClick={() => setSelectedPreview(null)} className='p-2 rounded-lg hover:bg-slate-100'>✕</button>
            </div>
            <div className='p-4 bg-slate-50 max-h-[70vh] overflow-auto'>
              {selectedPreview.mimeType?.startsWith('image/') || selectedPreview.fileURL?.match(/\.(png|jpg|jpeg|webp|gif)$/i) ? (
                <img src={selectedPreview.fileURL} alt='Medical record preview' className='max-h-[60vh] mx-auto rounded-xl border border-slate-200' />
              ) : selectedPreview.mimeType === 'application/pdf' || selectedPreview.fileURL?.match(/\.pdf$/i) ? (
                <iframe src={selectedPreview.fileURL} title='Medical record preview' className='w-full h-[60vh] rounded-xl border border-slate-200' />
              ) : (
                <div className='p-6 text-slate-600'>Preview is not available for this file type. Use the open button to view it.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
