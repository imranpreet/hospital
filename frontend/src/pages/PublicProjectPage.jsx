import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api'
import { FileText, Lock, User, Building2, Sparkles } from 'lucide-react'

export default function PublicProjectPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPublicProject() {
      try {
        const res = await API.get(`/projects/public/${slug}`)
        setProject(res.data)
      } catch (err) {
        console.error(err)
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchPublicProject()
  }, [slug])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-100'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-4 border-sky-600 mx-auto'></div>
          <p className='mt-4 text-slate-600'>Loading shared project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-100 px-6'>
        <div className='max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center'>
          <div className='mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600'>
            <Lock className='w-8 h-8' />
          </div>
          <h1 className='text-3xl font-black text-slate-900'>Project unavailable</h1>
          <p className='mt-3 text-slate-600'>This public project link is invalid, expired, or set to private.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-100 p-6'>
      <div className='max-w-5xl mx-auto'>
        <div className='bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden'>
          <div className='bg-gradient-to-r from-sky-600 to-indigo-600 px-8 py-8 text-white'>
            <div className='flex items-center gap-3 text-sky-100 text-sm font-bold uppercase tracking-[0.22em]'>
              <Building2 className='w-4 h-4' />
              Public Project
            </div>
            <h1 className='mt-4 text-4xl font-black'>{project.name}</h1>
            <p className='mt-3 text-sky-100 max-w-2xl'>{project.description || 'No public description available.'}</p>
          </div>

          <div className='p-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                <div className='flex items-center gap-2 text-slate-700 font-semibold'>
                  <User className='w-4 h-4 text-sky-600' />
                  Owner
                </div>
                <div className='mt-2 text-lg font-bold text-slate-900'>{project.creator?.name || 'Hospital staff'}</div>
              </div>
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                <div className='flex items-center gap-2 text-slate-700 font-semibold'>
                  <Sparkles className='w-4 h-4 text-violet-600' />
                  Department
                </div>
                <div className='mt-2 text-lg font-bold text-slate-900'>{project.department || 'General'}</div>
              </div>
            </div>

            <div className='rounded-2xl border border-slate-200 bg-slate-50 p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='bg-sky-100 text-sky-700 p-2 rounded-xl'>
                  <FileText className='w-5 h-5' />
                </div>
                <h2 className='text-2xl font-bold text-slate-900'>Read-only project README</h2>
              </div>

              <div className='whitespace-pre-wrap text-sm leading-7 text-slate-700'>
                {project.publicReadme || '# Project README\n\nThis project has been shared publicly in read-only mode.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
