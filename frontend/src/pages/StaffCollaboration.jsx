import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import API from '../api'
import { FileText, Plus, Users, Sparkles, Send, FolderKanban, UserPlus, Check, ArrowLeft, UploadCloud, Download, Eye, Trash2, FileImage, FileText as DocText } from 'lucide-react'

export default function StaffCollaboration() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [notes, setNotes] = useState([])
  const [projectFiles, setProjectFiles] = useState([])
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectDepartment, setProjectDepartment] = useState('General')
  const [memberEmail, setMemberEmail] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)
  const [fileStatus, setFileStatus] = useState('')
  const [previewFile, setPreviewFile] = useState(null)
  const [explainingFileId, setExplainingFileId] = useState(null)
  const [codeExplanation, setCodeExplanation] = useState('')
  const [analytics, setAnalytics] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedTab, setSelectedTab] = useState('write')
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [editingProjectName, setEditingProjectName] = useState('')
  const [editingProjectDescription, setEditingProjectDescription] = useState('')
  const [editingProjectDepartment, setEditingProjectDepartment] = useState('General')
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editingNoteTitle, setEditingNoteTitle] = useState('')
  const [editingNoteContent, setEditingNoteContent] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const textareaRef = useRef(null)

  const applyMarkdownFormat = ({
    prefix = '',
    suffix = '',
    placeholder = 'text',
    multiline = false,
    customSelectionText,
    insertMiddle = false
  }) => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.focus()

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentValue = textarea.value
    const selectedText = currentValue.slice(start, end)
    const textToFormat = selectedText || customSelectionText || placeholder

    let replacement
    let nextCursorStart
    let nextCursorEnd

    if (multiline) {
      const lines = (selectedText || customSelectionText || placeholder).split('\n')
      replacement = lines.map((line) => `${prefix}${line || placeholder}`).join('\n')
      nextCursorStart = start + prefix.length
      nextCursorEnd = nextCursorStart + textToFormat.length
    } else if (selectedText) {
      replacement = `${prefix}${selectedText}${suffix}`
      nextCursorStart = start + prefix.length
      nextCursorEnd = nextCursorStart + selectedText.length
    } else {
      replacement = `${prefix}${placeholder}${suffix}`
      nextCursorStart = start + prefix.length
      nextCursorEnd = nextCursorStart + placeholder.length

      if (insertMiddle) {
        replacement = `${prefix}${placeholder}${suffix}`
      }
    }

    textarea.setRangeText(replacement, start, end, 'end')
    const updatedValue = textarea.value
    setContent(updatedValue)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(nextCursorStart, nextCursorEnd)
    })
  }

  const preventToolbarBlur = (event) => {
    event.preventDefault()
  }

  const formatSelection = (prefix, suffix = prefix, placeholder = 'text') => {
    applyMarkdownFormat({ prefix, suffix, placeholder })
  }

  const formatHeading = () => {
    applyMarkdownFormat({ prefix: '## ', placeholder: 'Heading' })
  }

  const formatList = (prefix) => {
    applyMarkdownFormat({ prefix, placeholder: 'list item', multiline: true })
  }

  const formatCodeBlock = () => {
    applyMarkdownFormat({ prefix: '\n\n```\n', suffix: '\n```\n\n', placeholder: 'code' })
  }

  const formatLink = () => {
    applyMarkdownFormat({ prefix: '[', suffix: '](https://example.com)', placeholder: 'link text' })
  }

  function escapeHtml(value = '') {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  function markdownToHtml(value = '') {
    const source = String(value || '').trim()
    if (!source) {
      return '<h2>Note preview</h2><p>Write your markdown note here to see formatting preview.</p>'
    }

    const escaped = escapeHtml(source)
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')

    const blocks = escaped
      .split('\n\n')
      .map((block) => {
        if (/^#{1,6}\s/.test(block)) {
          const level = block.match(/^#+/)[0].length
          const text = block.replace(/^#{1,6}\s/, '')
          return `<h${level}>${text}</h${level}>`
        }

        if (/^[-*+]\s/.test(block)) {
          const items = escaped
            .split('\n')
            .filter((line) => /^[-*+]\s/.test(line.replace(/&lt;|&gt;|&amp;|&quot;|&#039;/g, '')))
            .map((line) => `<li>${line.replace(/^[-*+]\s/, '')}</li>`)
            .join('')
          return `<ul>${items}</ul>`
        }

        if (/^\d+\.\s/.test(block)) {
          const items = escaped
            .split('\n')
            .filter((line) => /^\d+\.\s/.test(line.replace(/&lt;|&gt;|&amp;|&quot;|&#039;/g, '')))
            .map((line) => `<li>${line.replace(/^\d+\.\s/, '')}</li>`)
            .join('')
          return `<ol>${items}</ol>`
        }

        if (/^>\s/.test(block)) {
          return `<blockquote>${block.replace(/^>\s/, '')}</blockquote>`
        }

        if (/^```/.test(block)) {
          const code = block.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '')
          return `<pre><code>${code}</code></pre>`
        }

        return `<p>${block
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
          .replace(/\n/g, '<br />')}</p>`
      })
      .join('')

    return blocks
  }

  const markdownPreview = content ? content : '## Note preview\n\nWrite your markdown note here to see formatting preview.'
  const markdownPreviewHtml = markdownToHtml(content)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      localStorage.setItem('redirectAfterLogin', `${window.location.pathname}${window.location.search}`)
      nav('/login')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setCurrentUserId(payload.id || '')
    } catch (error) {
      console.error('Could not read current user from token:', error)
    }

    API.setToken(token)
    fetchProjects()
  }, [nav])

  const isProjectCreator = selectedProject?.creator?._id === currentUserId || selectedProject?.creator === currentUserId

  async function fetchProjects() {
    try {
      const res = await API.get('/projects')
      const list = res.data || []
      setProjects(list)
      if (!selectedProject && list.length) {
        const requestedProjectId = searchParams.get('project')
        const requestedProject = list.find(project => project._id === requestedProjectId)
        const projectToSelect = requestedProject || list[0]
        setSelectedProject(projectToSelect)
        fetchNotes(projectToSelect._id)
        fetchProjectFiles(projectToSelect._id)
        fetchProjectAnalytics(projectToSelect._id)
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    }
  }

  async function fetchNotes(projectId) {
    try {
      const res = await API.get(`/projects/${projectId}/notes`)
      setNotes(res.data || [])
    } catch (err) {
      console.error('Failed to fetch notes:', err)
      setNotes([])
    }
  }

  async function fetchProjectFiles(projectId) {
    if (!projectId) {
      setProjectFiles([])
      return
    }

    try {
      const res = await API.get(`/projects/${projectId}/files`)
      setProjectFiles(res.data || [])
    } catch (err) {
      console.error('Failed to fetch project files:', err)
      setProjectFiles([])
    }
  }

  async function fetchProjectAnalytics(projectId) {
    if (!projectId) {
      setAnalytics(null)
      return
    }

    try {
      const res = await API.get(`/projects/${projectId}/analytics`)
      setAnalytics(res.data || null)
    } catch (err) {
      console.error('Failed to fetch project analytics:', err)
      setAnalytics(null)
    }
  }

  async function handleCreateProject(e) {
    e.preventDefault()
    if (!projectName.trim()) return

    try {
      setLoading(true)
      const res = await API.post('/projects', {
        name: projectName,
        description: projectDescription,
        department: projectDepartment
      })

      const newProject = res.data
      setProjects(prev => [newProject, ...prev])
      setSelectedProject(newProject)
      setProjectName('')
      setProjectDescription('')
      setProjectDepartment('General')
      fetchNotes(newProject._id)
      fetchProjectFiles(newProject._id)
      fetchProjectAnalytics(newProject._id)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddMember(e) {
    e.preventDefault()
    if (!selectedProject || !memberEmail.trim()) return

    try {
      const res = await API.post(`/projects/${selectedProject._id}/members`, { email: memberEmail })
      setSelectedProject(res.data)
      setMemberEmail('')
      fetchProjects()
      alert(res.data.invitation?.message || 'Member added successfully.')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to add member')
    }
  }

  async function handleResendInvitation(memberId) {
    if (!selectedProject || !memberId) return

    try {
      const res = await API.post(`/projects/${selectedProject._id}/members/${memberId}/invite`)
      alert(res.data.invitation?.message || 'Invitation status updated.')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to resend invitation')
    }
  }

  async function handleUpdateProject(e) {
    e.preventDefault()
    if (!selectedProject || !editingProjectId) return

    try {
      const res = await API.put(`/projects/${editingProjectId}`, {
        name: editingProjectName,
        description: editingProjectDescription,
        department: editingProjectDepartment
      })
      setProjects(prev => prev.map(project => project._id === editingProjectId ? res.data : project))
      setSelectedProject(res.data)
      setEditingProjectId(null)
      setEditingProjectName('')
      setEditingProjectDescription('')
      setEditingProjectDepartment('General')
      fetchProjects()
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to update workspace')
    }
  }

  async function handleDeleteProject(projectId) {
    if (!projectId) return
    const confirmed = window.confirm('Delete this workspace and all its notes/files?')
    if (!confirmed) return

    try {
      await API.delete(`/projects/${projectId}`)
      const remaining = projects.filter(project => project._id !== projectId)
      setProjects(remaining)
      if (selectedProject?._id === projectId) {
        const nextProject = remaining[0] || null
        setSelectedProject(nextProject)
        if (nextProject) {
          fetchNotes(nextProject._id)
          fetchProjectFiles(nextProject._id)
          fetchProjectAnalytics(nextProject._id)
        } else {
          setNotes([])
          setProjectFiles([])
          setAnalytics(null)
        }
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to delete workspace')
    }
  }

  async function handleToggleProjectPublic() {
    if (!selectedProject) return

    try {
      const generatedReadme = `# ${selectedProject.name}\n\n## Overview\n${selectedProject.description || 'Project summary not available yet.'}\n\n## Department\n${selectedProject.department || 'General'}\n\n## Read-only note\nThis project is shared publicly for viewing only. Editing is disabled on the public page.`
      const res = await API.post(`/projects/${selectedProject._id}/share`, {
        publicReadme: generatedReadme,
        publicSlug: selectedProject.publicSlug || `${(selectedProject.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`
      })

      setProjects(prev => prev.map(project => project._id === selectedProject._id ? { ...project, isPublic: true, publicSlug: res.data.publicSlug, publicReadme: res.data.publicReadme } : project))
      setSelectedProject(prev => prev ? { ...prev, isPublic: true, publicSlug: res.data.publicSlug, publicReadme: res.data.publicReadme } : prev)
      navigator.clipboard?.writeText(res.data.publicUrl)
      alert(`Public link created: ${res.data.publicUrl}`)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to publish project')
    }
  }

  async function handleSaveNote(e) {
    e.preventDefault()
    if (!selectedProject || !content.trim()) return

    try {
      setSaving(true)
      const payload = { title: title || 'Untitled Note', content }
      const res = await API.post(`/projects/${selectedProject._id}/notes`, payload)
      setNotes(prev => [res.data, ...prev])
      setTitle('')
      setContent('')
      setAiResult('')
      if (selectedProject) {
        fetchProjectAnalytics(selectedProject._id)
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  async function handleAiAssist(mode) {
    const noteText = mode === 'explain' || mode === 'improve' ? content : editingNoteContent
    if (!noteText || !String(noteText).trim()) {
      alert('Add note content first.')
      return
    }

    try {
      const res = await API.post('/ai/note-assist', { note: noteText, mode })
      setAiResult(res.data.result || 'No response generated.')
    } catch (err) {
      console.error(err)
      setAiResult('AI assistance is not available right now. Please try again later.')
    }
  }

  async function handleUpdateNote(noteId) {
    if (!noteId || !editingNoteTitle.trim() || !editingNoteContent.trim()) {
      alert('Please provide a note title and content to update.')
      return
    }

    try {
      const res = await API.put(`/projects/notes/${noteId}`, {
        title: editingNoteTitle,
        content: editingNoteContent
      })
      setNotes(prev => prev.map(note => note._id === noteId ? res.data : note))
      setEditingNoteId(null)
      setEditingNoteTitle('')
      setEditingNoteContent('')
      if (selectedProject) {
        fetchProjectAnalytics(selectedProject._id)
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to update note')
    }
  }

  async function handleDeleteNote(noteId) {
    if (!noteId) return
    const confirmed = window.confirm('Delete this note?')
    if (!confirmed) return

    try {
      await API.delete(`/projects/notes/${noteId}`)
      setNotes(prev => prev.filter(note => note._id !== noteId))
      if (selectedProject) {
        fetchProjectAnalytics(selectedProject._id)
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to delete note')
    }
  }

  async function handleProjectFileUpload(event) {
    const file = event.target.files?.[0]
    if (!file || !selectedProject) return

    try {
      setUploadingFile(true)
      setFileStatus('')

      const formData = new FormData()
      formData.append('file', file)

      const res = await API.post(`/projects/${selectedProject._id}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setProjectFiles(prev => [res.data, ...prev])
      setFileStatus('File uploaded successfully.')
      if (selectedProject) {
        fetchProjectAnalytics(selectedProject._id)
      }
    } catch (err) {
      console.error(err)
      setFileStatus(err.response?.data?.msg || 'Upload failed. Please try again.')
    } finally {
      setUploadingFile(false)
      event.target.value = ''
    }
  }

  async function handleDeleteProjectFile(fileId) {
    if (!selectedProject) return

    try {
      await API.delete(`/projects/${selectedProject._id}/files/${fileId}`)
      setProjectFiles(prev => prev.filter(file => file._id !== fileId))
      if (previewFile && previewFile._id === fileId) {
        setPreviewFile(null)
      }
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.msg || 'Failed to delete file')
    }
  }

  function getPreviewMode(mimeType = '', fileName = '') {
    const lowerMime = (mimeType || '').toLowerCase()
    const lowerName = (fileName || '').toLowerCase()

    if (lowerMime.startsWith('image/')) return 'image'
    if (lowerMime === 'application/pdf' || lowerName.endsWith('.pdf')) return 'pdf'
    if (lowerMime.startsWith('text/') || lowerName.endsWith('.txt') || lowerName.endsWith('.md') || lowerName.endsWith('.csv')) return 'text'
    return 'download'
  }

  function isCodeFile(fileName = '') {
    const name = String(fileName || '').toLowerCase()
    return /\.(js|jsx|ts|tsx|py|java|cs|json|html|css|sql|php|rb|go|rs|swift|c|cpp|h|hpp|yml|yaml)$/i.test(name)
  }

  async function handleExplainProjectFile(file) {
    if (!file) return

    try {
      setExplainingFileId(file._id)
      setCodeExplanation('')

      const response = await fetch(file.fileURL)
      const fileContent = await response.text()

      const res = await API.post('/ai/explain-code', {
        code: fileContent,
        fileName: file.originalName || file.fileName
      })

      setCodeExplanation(res.data.explanation || 'No explanation returned.')
    } catch (err) {
      console.error(err)
      setCodeExplanation('Could not explain this file right now. Please try again.')
    } finally {
      setExplainingFileId(null)
    }
  }

  return (
    <div className='min-h-screen bg-slate-100 p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <p className='text-sm font-bold uppercase tracking-[0.2em] text-sky-600'>Hospital staff workspace</p>
            <h1 className='text-4xl font-black text-slate-900 mt-2'>Team Collaboration & Notes</h1>
          </div>
          <button
            onClick={() => nav('/dashboard')}
            className='bg-slate-800 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-700'
          >
            Back to dashboard
          </button>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-6'>
          <aside className='bg-white rounded-2xl shadow-sm border border-slate-200 p-5'>
            <div className='flex items-center gap-3 mb-5'>
              <div className='bg-sky-100 text-sky-700 p-2 rounded-xl'>
                <FolderKanban className='w-5 h-5' />
              </div>
              <h2 className='text-xl font-bold text-slate-900'>Workspaces</h2>
            </div>

            <form onSubmit={handleCreateProject} className='space-y-4 mb-6'>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder='New case / team workspace'
                className='w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent'
              />
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder='Description'
                rows='3'
                className='w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none'
              />
              <select
                value={projectDepartment}
                onChange={(e) => setProjectDepartment(e.target.value)}
                className='w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent'
              >
                <option value='General'>General</option>
                <option value='Cardiology'>Cardiology</option>
                <option value='Neurology'>Neurology</option>
                <option value='Orthopedics'>Orthopedics</option>
                <option value='Pediatrics'>Pediatrics</option>
                <option value='ICU'>ICU</option>
              </select>
              <button type='submit' disabled={loading} className='w-full bg-sky-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60'>
                <span className='inline-flex items-center gap-2'>
                  <Plus className='w-4 h-4' />
                  {loading ? 'Creating...' : 'Create workspace'}
                </span>
              </button>
            </form>

            <div className='space-y-3'>
              {projects.length === 0 ? (
                <div className='text-slate-500 text-sm'>No workspaces yet.</div>
              ) : (
                projects.map((project) => (
                  <button
                    key={project._id}
                    onClick={() => {
                      setSelectedProject(project)
                      fetchNotes(project._id)
                      fetchProjectFiles(project._id)
                      fetchProjectAnalytics(project._id)
                    }}
                    className={`w-full text-left rounded-xl border p-3 transition ${selectedProject?._id === project._id ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-slate-50 hover:border-sky-300'}`}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <div className='font-bold text-slate-900'>{project.name}</div>
                      <span className='text-[10px] uppercase tracking-wide bg-slate-200 text-slate-700 px-2 py-1 rounded-full'>{project.department || 'General'}</span>
                    </div>
                    <div className='text-sm text-slate-600 mt-1'>{project.description || 'No description yet'}</div>
                    <div className='text-xs text-slate-500 mt-2'>Members: {(project.members || []).length}</div>
                  </button>
                ))
              )}
            </div>
          </aside>

          <main className='space-y-6'>
            {selectedProject ? (
              <>
                <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-5'>
                  {!editingProjectId || editingProjectId !== selectedProject._id ? (
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-sm font-bold uppercase tracking-[0.2em] text-sky-600'>Selected workspace</p>
                        <h2 className='text-3xl font-black text-slate-900'>{selectedProject.name}</h2>
                      </div>
                      <div className='flex items-center gap-2 flex-wrap'>
                        {isProjectCreator && (
                          <>
                            <button
                              type='button'
                              onClick={() => {
                                setEditingProjectId(selectedProject._id)
                                setEditingProjectName(selectedProject.name)
                                setEditingProjectDescription(selectedProject.description || '')
                                setEditingProjectDepartment(selectedProject.department || 'General')
                              }}
                              className='bg-slate-100 text-slate-700 px-3 py-2 rounded-xl font-semibold hover:bg-slate-200'
                            >
                              Edit
                            </button>
                            <button
                              type='button'
                              onClick={handleToggleProjectPublic}
                              className='bg-violet-100 text-violet-700 px-3 py-2 rounded-xl font-semibold hover:bg-violet-200'
                            >
                              {selectedProject.isPublic ? 'Public link' : 'Make public'}
                            </button>
                            <button
                              type='button'
                              onClick={() => handleDeleteProject(selectedProject._id)}
                              className='bg-red-50 text-red-600 px-3 py-2 rounded-xl font-semibold hover:bg-red-100'
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateProject} className='space-y-3'>
                      <input
                        value={editingProjectName}
                        onChange={(e) => setEditingProjectName(e.target.value)}
                        className='w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      />
                      <textarea
                        value={editingProjectDescription}
                        onChange={(e) => setEditingProjectDescription(e.target.value)}
                        rows='3'
                        className='w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none'
                      />
                      <select
                        value={editingProjectDepartment}
                        onChange={(e) => setEditingProjectDepartment(e.target.value)}
                        className='w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                      >
                        <option value='General'>General</option>
                        <option value='Cardiology'>Cardiology</option>
                        <option value='Neurology'>Neurology</option>
                        <option value='Orthopedics'>Orthopedics</option>
                        <option value='Pediatrics'>Pediatrics</option>
                        <option value='ICU'>ICU</option>
                      </select>
                      <div className='flex gap-2'>
                        <button type='submit' className='bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-sky-700'>Save</button>
                        <button type='button' onClick={() => setEditingProjectId(null)} className='bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200'>Cancel</button>
                      </div>
                    </form>
                  )}

                  {selectedProject.isPublic && selectedProject.publicSlug && (
                    <div className='mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-4'>
                      <div className='text-sm font-semibold text-violet-800 mb-2'>Public share link</div>
                      <div className='break-all text-sm text-violet-700'>
                        {`${window.location.origin}/public-project/${selectedProject.publicSlug}`}
                      </div>
                    </div>
                  )}

                  <div className='mt-5 flex items-center gap-3 text-slate-700'>
                    <Users className='w-4 h-4 text-sky-600' />
                    <span className='font-semibold'>Members</span>
                  </div>

                  <div className='mt-3 flex flex-wrap gap-2'>
                    {(selectedProject.members || []).map((member) => (
                      <span key={member._id} className='inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700'>
                        <span>{member.name}</span>
                        {isProjectCreator && member._id !== currentUserId && (
                          <button
                            type='button'
                            onClick={() => handleResendInvitation(member._id)}
                            className='font-semibold text-sky-600 hover:text-sky-800'
                          >
                            Resend invite
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isProjectCreator && (
                    <form onSubmit={handleAddMember} className='mt-5 flex flex-col gap-3 md:flex-row'>
                      <input
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        type='email'
                        placeholder='Add member by email'
                        className='flex-1 rounded-xl border border-slate-200 px-3 py-2.5 focus:border-transparent focus:ring-2 focus:ring-sky-500'
                      />
                      <button type='submit' className='rounded-xl bg-sky-600 px-4 py-2.5 font-semibold text-white hover:bg-sky-700'>
                        <span className='inline-flex items-center gap-2'>
                          <UserPlus className='w-4 h-4' />
                          Add member & email invite
                        </span>
                      </button>
                    </form>
                  )}
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-5'>
                  <div className='flex items-center gap-3 mb-4'>
                    <Users className='w-5 h-5 text-sky-600' />
                    <h3 className='text-2xl font-bold text-slate-900'>Project analytics</h3>
                  </div>

                  {analytics ? (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-5'>
                      <div className='rounded-2xl border border-sky-200 bg-sky-50 p-4'>
                        <div className='text-sm text-sky-700'>Notes created</div>
                        <div className='mt-2 text-3xl font-black text-slate-900'>{analytics.totalNotes}</div>
                      </div>
                      <div className='rounded-2xl border border-emerald-200 bg-emerald-50 p-4'>
                        <div className='text-sm text-emerald-700'>Files uploaded</div>
                        <div className='mt-2 text-3xl font-black text-slate-900'>{analytics.totalFiles}</div>
                      </div>
                      <div className='rounded-2xl border border-violet-200 bg-violet-50 p-4'>
                        <div className='text-sm text-violet-700'>Members</div>
                        <div className='mt-2 text-3xl font-black text-slate-900'>{analytics.memberSummary?.length || 0}</div>
                      </div>
                    </div>
                  ) : (
                    <div className='text-sm text-slate-500 mb-5'>Loading analytics...</div>
                  )}

                  <div className='space-y-3'>
                    {(analytics?.memberSummary || []).map((member) => (
                      <div key={member.id} className='flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between'>
                        <div>
                          <div className='font-semibold text-slate-800'>{member.name}</div>
                          <div className='text-xs text-slate-500'>{member.email}</div>
                        </div>
                        <div className='flex gap-2 text-xs'>
                          <span className='rounded-full bg-sky-100 px-2 py-1 text-sky-700'>Notes: {member.noteCount}</span>
                          <span className='rounded-full bg-emerald-100 px-2 py-1 text-emerald-700'>Files: {member.fileCount}</span>
                          <span className='rounded-full bg-violet-100 px-2 py-1 text-violet-700'>Total: {member.totalActivity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {analytics?.recentActivity?.length ? (
                    <div className='mt-6'>
                      <h4 className='mb-3 text-lg font-bold text-slate-800'>Recent activity</h4>
                      <div className='space-y-2'>
                        {analytics.recentActivity.map((item) => (
                          <div key={item.id} className='flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm'>
                            <span className='text-slate-700'>{item.title}</span>
                            <span className='text-slate-500'>by {item.author}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-5'>
                  <div className='flex items-center gap-3 mb-4'>
                    <UploadCloud className='w-5 h-5 text-sky-600' />
                    <h3 className='text-2xl font-bold text-slate-900'>Project files</h3>
                  </div>

                  <div className='rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4'>
                    <label className='flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-sky-300'>
                      <span className='inline-flex items-center gap-2 text-sm font-semibold text-slate-700'>
                        <UploadCloud className='w-4 h-4 text-sky-600' />
                        {uploadingFile ? 'Uploading file...' : 'Upload a file'}
                      </span>
                      <input type='file' className='hidden' onChange={handleProjectFileUpload} />
                    </label>
                    {fileStatus && <p className='mt-3 text-sm text-slate-600'>{fileStatus}</p>}
                  </div>

                  <div className='mt-5 space-y-3'>
                    {projectFiles.length === 0 ? (
                      <div className='text-sm text-slate-500'>No files uploaded yet for this workspace.</div>
                    ) : (
                      projectFiles.map((file) => {
                        const previewMode = getPreviewMode(file.mimeType, file.originalName || file.fileName)
                        const isImage = previewMode === 'image'

                        return (
                          <div key={file._id} className='flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between'>
                            <div className='flex items-center gap-3 min-w-0'>
                              <div className='rounded-lg bg-white p-2 text-sky-600'>
                                {isImage ? <FileImage className='w-5 h-5' /> : <DocText className='w-5 h-5' />}
                              </div>
                              <div className='min-w-0'>
                                <div className='truncate font-semibold text-slate-800'>{file.originalName || file.fileName}</div>
                                <div className='text-xs text-slate-500'>Uploaded by {file.uploadedBy?.name || 'Staff'} • {(file.size / 1024).toFixed(1)} KB</div>
                              </div>
                            </div>

                            <div className='flex flex-wrap items-center gap-2'>
                              {(previewMode === 'image' || previewMode === 'pdf' || previewMode === 'text') && (
                                <button
                                  type='button'
                                  onClick={() => setPreviewFile(file)}
                                  className='inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-sky-300'
                                >
                                  <Eye className='w-4 h-4' />
                                  Preview
                                </button>
                              )}
                              {isCodeFile(file.originalName || file.fileName) && (
                                <button
                                  type='button'
                                  onClick={() => handleExplainProjectFile(file)}
                                  disabled={explainingFileId === file._id}
                                  className='inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100 disabled:opacity-60'
                                >
                                  <Sparkles className='w-4 h-4' />
                                  {explainingFileId === file._id ? 'Explaining...' : 'Explain code'}
                                </button>
                              )}
                              <a
                                href={file.fileURL}
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-sky-300'
                              >
                                <Download className='w-4 h-4' />
                                Download
                              </a>
                              <button
                                type='button'
                                onClick={() => handleDeleteProjectFile(file._id)}
                                className='inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100'
                              >
                                <Trash2 className='w-4 h-4' />
                                Delete
                              </button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {previewFile && (
                    <div className='mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                      <div className='mb-3 flex items-center justify-between gap-3'>
                        <h4 className='text-lg font-bold text-slate-800'>{previewFile.originalName || previewFile.fileName}</h4>
                        <button type='button' onClick={() => setPreviewFile(null)} className='text-slate-500 hover:text-slate-700'>Close</button>
                      </div>

                      {getPreviewMode(previewFile.mimeType, previewFile.originalName || previewFile.fileName) === 'image' ? (
                        <img src={previewFile.fileURL} alt={previewFile.originalName || previewFile.fileName} className='max-h-96 w-full rounded-xl object-contain bg-white' />
                      ) : (
                        <iframe src={previewFile.fileURL} title={previewFile.originalName || previewFile.fileName} className='h-[420px] w-full rounded-xl border border-slate-200 bg-white' />
                      )}
                    </div>
                  )}

                  {codeExplanation && (
                    <div className='mt-5 rounded-2xl border border-violet-200 bg-violet-50 p-4'>
                      <h4 className='mb-3 text-lg font-bold text-violet-900'>AI code explanation</h4>
                      <div className='whitespace-pre-wrap text-sm leading-6 text-slate-700'>{codeExplanation}</div>
                    </div>
                  )}
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-5'>
                  <div className='flex items-center gap-3 mb-4'>
                    <FileText className='w-5 h-5 text-sky-600' />
                    <h3 className='text-2xl font-bold text-slate-900'>Markdown notes</h3>
                  </div>

                  <div className='flex gap-2 mb-4'>
                    <button type='button' onClick={() => setSelectedTab('write')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${selectedTab === 'write' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      Write
                    </button>
                    <button type='button' onClick={() => setSelectedTab('preview')} className={`px-4 py-2 rounded-lg text-sm font-semibold ${selectedTab === 'preview' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      Preview
                    </button>
                  </div>

                  <form onSubmit={handleSaveNote} className='space-y-4'>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='Note title'
                      className='w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                    />

                    {selectedTab === 'write' ? (
                      <div className='rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-inner'>
                        <div className='mb-2 flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2'>
                          <button type='button' onMouseDown={preventToolbarBlur} onClick={() => formatSelection('**', '**', 'bold text')} className='rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-bold'>B</button>
                          <button type='button' onMouseDown={preventToolbarBlur} onClick={() => formatSelection('*', '*', 'italic text')} className='rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm italic'>I</button>
                          <button type='button' onMouseDown={preventToolbarBlur} onClick={formatHeading} className='rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-bold'>H2</button>
                          <button type='button' onMouseDown={preventToolbarBlur} onClick={() => formatList('- ')} className='rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm'>• List</button>
                          <button type='button' onMouseDown={preventToolbarBlur} onClick={() => formatList('1. ')} className='rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm'>1. List</button>
                          <button type='button' onMouseDown={preventToolbarBlur} onClick={() => formatSelection('> ', '', 'quoted text')} className='rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm'>❝ Quote</button>
                          <button type='button' onMouseDown={preventToolbarBlur} onClick={formatCodeBlock} className='rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm'>{'</>'} Code</button>
                          <button type='button' onMouseDown={preventToolbarBlur} onClick={formatLink} className='rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm'>Link</button>
                        </div>
                        <textarea
                          ref={textareaRef}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows='12'
                          placeholder={'# Clinical note\n\n- Observation\n- Assessment\n- Plan\n\n**Follow-up:** monitor vitals and review labs.'}
                          className='w-full border border-slate-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none font-mono text-sm shadow-inner bg-white'
                        />
                      </div>
                    ) : (
                      <div className='prose prose-slate max-w-none rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[260px] text-slate-700 shadow-inner'>
                        <div dangerouslySetInnerHTML={{ __html: markdownPreviewHtml }} />
                      </div>
                    )}

                    <div className='flex flex-wrap gap-3'>
                      <button type='submit' disabled={saving} className='bg-sky-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60'>
                        <span className='inline-flex items-center gap-2'>
                          <Check className='w-4 h-4' />
                          {saving ? 'Saving...' : 'Save note'}
                        </span>
                      </button>

                      <button type='button' onClick={() => handleAiAssist('explain')} className='bg-violet-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-violet-700'>
                        <span className='inline-flex items-center gap-2'>
                          <Sparkles className='w-4 h-4' />
                          Explain note
                        </span>
                      </button>

                      <button type='button' onClick={() => handleAiAssist('improve')} className='bg-amber-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-amber-600'>
                        <span className='inline-flex items-center gap-2'>
                          <Send className='w-4 h-4' />
                          Suggest improvements
                        </span>
                      </button>
                    </div>
                  </form>

                  {aiResult && (
                    <div className='mt-6 border border-violet-200 bg-violet-50 text-slate-800 rounded-2xl p-4 whitespace-pre-wrap'>
                      {aiResult}
                    </div>
                  )}
                </div>

                <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-5'>
                  <h3 className='text-2xl font-bold text-slate-900 mb-4'>Saved notes</h3>
                  <div className='space-y-4'>
                    {notes.length === 0 ? (
                      <div className='text-slate-500'>No notes saved yet.</div>
                    ) : (
                      notes.map((note) => (
                        <div key={note._id} className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                          {editingNoteId === note._id ? (
                            <div className='space-y-3'>
                              <input
                                value={editingNoteTitle}
                                onChange={(e) => setEditingNoteTitle(e.target.value)}
                                className='w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent'
                              />
                              <textarea
                                value={editingNoteContent}
                                onChange={(e) => setEditingNoteContent(e.target.value)}
                                rows='5'
                                className='w-full border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none'
                              />
                              <div className='flex gap-2'>
                                <button type='button' onClick={() => handleUpdateNote(note._id)} className='bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-sky-700'>Save</button>
                                <button type='button' onClick={() => { setEditingNoteId(null); setEditingNoteTitle(''); setEditingNoteContent('') }} className='bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200'>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className='flex items-center justify-between gap-3'>
                                <div className='font-bold text-slate-900'>{note.title}</div>
                                <div className='flex items-center gap-2'>
                                  <button type='button' onClick={() => { setEditingNoteId(note._id); setEditingNoteTitle(note.title); setEditingNoteContent(note.content); }} className='text-sky-600 hover:text-sky-700 font-semibold'>Edit</button>
                                  <button type='button' onClick={() => handleDeleteNote(note._id)} className='text-red-600 hover:text-red-700 font-semibold'>Delete</button>
                                </div>
                              </div>
                              <div className='mt-3 text-sm whitespace-pre-wrap text-slate-700'>
                                {note.content}
                              </div>
                              <div className='mt-3 text-xs text-slate-500'>{new Date(note.createdAt).toLocaleDateString()}</div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center text-slate-500'>
                Create or select a workspace to begin.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
