import React, { useState } from 'react'
import { Download, FileText, Sparkles, ClipboardList } from 'lucide-react'
import API from '../api'

export default function HelpDesk() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [readme, setReadme] = useState('')
  const [error, setError] = useState('')

  async function handleGenerateReadme(e) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError('Please enter both a title and a short description.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const res = await API.post('/ai/readme', {
        title: title.trim(),
        description: description.trim()
      })
      setReadme(res.data.readme || '')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.msg || 'Unable to generate README right now.')
    } finally {
      setLoading(false)
    }
  }

  function handleDownload() {
    if (!readme) return
    const blob = new Blob([readme], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${(title || 'project-readme').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'project-readme'}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className='min-h-screen bg-slate-100 p-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-8'>
          <p className='text-sm font-bold uppercase tracking-[0.24em] text-sky-600'>Help Desk</p>
          <h1 className='mt-2 text-4xl font-black text-slate-900'>AI Health Guidance Generator</h1>
          <p className='mt-3 text-lg text-slate-600'>Describe your health concern and generate a helpful guidance document with next steps you can download.</p>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6'>
          <div className='bg-white rounded-3xl shadow-sm border border-slate-200 p-6'>
            <div className='flex items-center gap-3 mb-5'>
              <div className='bg-sky-100 text-sky-700 p-3 rounded-2xl'>
                <ClipboardList className='w-5 h-5' />
              </div>
              <h2 className='text-2xl font-bold text-slate-900'>Generate guidance</h2>
            </div>

            <form onSubmit={handleGenerateReadme} className='space-y-5'>
              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Health issue title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Migraine Problem'
                  className='w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-slate-700 mb-2'>Your problem description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows='7'
                  placeholder='I am suffering from headache from last 7 days.'
                  className='w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none'
                />
              </div>

              {error && (
                <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
                  {error}
                </div>
              )}

              <button
                type='submit'
                disabled={loading}
                className='w-full bg-sky-600 text-white px-5 py-3.5 rounded-xl font-bold hover:bg-sky-700 disabled:opacity-60 transition'
              >
                <span className='inline-flex items-center justify-center gap-2'>
                  <Sparkles className='w-4 h-4' />
                  {loading ? 'Generating...' : 'Generate guidance'}
                </span>
              </button>
            </form>
          </div>

          <div className='bg-white rounded-3xl shadow-sm border border-slate-200 p-6'>
            <div className='flex items-center justify-between gap-3 mb-5'>
              <div className='flex items-center gap-3'>
                <div className='bg-violet-100 text-violet-700 p-3 rounded-2xl'>
                  <FileText className='w-5 h-5' />
                </div>
                <h2 className='text-2xl font-bold text-slate-900'>Generated guidance</h2>
              </div>

              {readme && (
                <button
                  type='button'
                  onClick={handleDownload}
                  className='inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-emerald-700'
                >
                  <Download className='w-4 h-4' />
                  Download .md
                </button>
              )}
            </div>

            {readme ? (
              <div className='rounded-2xl border border-slate-200 bg-slate-50 p-5'>
                <div className='whitespace-pre-wrap text-sm leading-7 text-slate-700'>{readme}</div>
              </div>
            ) : (
              <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500'>
                Your generated README will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
