import { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, Search, X, AlertCircle, CheckCircle, Eye, EyeOff, Loader2, Save } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import pagesService from '../utils/pagesService'

export default function AdminPagesPage() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)
  const editorRef = useRef(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    isPublished: false,
  })

  // Load pages from Firebase
  useEffect(() => {
    const loadPages = async () => {
      try {
        setLoading(true)
        const data = await pagesService.getAllPages()
        setPages(data)
      } catch (e) {
        console.error('Error loading pages:', e)
        setMessage({ type: 'error', text: 'Failed to load pages' })
      } finally {
        setLoading(false)
      }
    }
    loadPages()
  }, [])

  // Sync editor innerHTML when formData.content changes (e.g., opening edit mode)
  useEffect(() => {
    if (editorRef.current && showForm) {
      const current = editorRef.current.innerHTML
      if (current !== formData.content) {
        editorRef.current.innerHTML = formData.content
      }
    }
  }, [formData.content, showForm])

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: formData.slug === '' || formData.slug === generateSlug(formData.title) ? generateSlug(title) : prev.slug,
    }))
  }

  const handleOpenForm = (page = null) => {
    if (page) {
      setEditingId(page.id)
      setFormData({
        title: page.title,
        slug: page.slug,
        description: page.description || '',
        content: page.content,
        isPublished: page.isPublished,
      })
    } else {
      setEditingId(null)
      setFormData({
        title: '',
        slug: '',
        description: '',
        content: '',
        isPublished: false,
      })
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      isPublished: false,
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Page title is required' })
      return
    }

    if (!formData.slug.trim()) {
      setMessage({ type: 'error', text: 'Page slug is required' })
      return
    }

    if (!formData.content.trim()) {
      setMessage({ type: 'error', text: 'Page content is required' })
      return
    }

    try {
      setSaving(true)
      if (editingId) {
        await pagesService.updatePage(editingId, formData)
        const updated = await pagesService.getAllPages()
        setPages(updated)
        setMessage({ type: 'success', text: 'Page updated successfully' })
      } else {
        await pagesService.createPage(formData)
        const updated = await pagesService.getAllPages()
        setPages(updated)
        setMessage({ type: 'success', text: 'Page created successfully' })
      }
      handleCloseForm()
    } catch (error) {
      console.error('Error saving page:', error)
      setMessage({ type: 'error', text: 'Failed to save page' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return

    try {
      setSaving(true)
      await pagesService.deletePage(id)
      const updated = await pagesService.getAllPages()
      setPages(updated)
      setMessage({ type: 'success', text: 'Page deleted successfully' })
    } catch (error) {
      console.error('Error deleting page:', error)
      setMessage({ type: 'error', text: 'Failed to delete page' })
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      setSaving(true)
      await pagesService.togglePagePublish(id, !currentStatus)
      const updated = await pagesService.getAllPages()
      setPages(updated)
      setMessage({ type: 'success', text: `Page ${!currentStatus ? 'published' : 'unpublished'} successfully` })
    } catch (error) {
      console.error('Error toggling publish:', error)
      setMessage({ type: 'error', text: 'Failed to update publish status' })
    } finally {
      setSaving(false)
    }
  }

  const applyFormatting = (command, value = null) => {
    document.execCommand(command, false, value)
  }

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pages Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and manage custom content pages with rich text formatting</p>
          </div>

          {/* Messages */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
              {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              {message.text}
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            {showForm && (
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {editingId ? 'Edit Page' : 'Create New Page'}
                    </h2>
                    <button
                      onClick={handleCloseForm}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <X size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  <form onSubmit={handleSave} className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Page Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="e.g., About Us, Contact"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Page Slug *
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            slug: e.target.value,
                          }))
                        }
                        placeholder="e.g., about-us"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Access at: /{formData.slug}</p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description (SEO)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Page meta description"
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Published Status */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={formData.isPublished}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isPublished: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Publish this page
                      </label>
                    </div>

                    {/* Save Button */}
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {saving ? 'Saving...' : 'Save Page'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Content Editor & List Section */}
            <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
              {showForm ? (
                /* Content Editor */
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Page Content * (Rich Text Editor)
                  </label>

                  {/* Formatting Toolbar */}
                  <div className="mb-4 flex flex-wrap gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => applyFormatting('bold')}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded font-bold text-sm bg-white dark:bg-gray-800"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormatting('italic')}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded italic text-sm bg-white dark:bg-gray-800"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormatting('underline')}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded underline text-sm bg-white dark:bg-gray-800"
                        title="Underline"
                      >
                        U
                      </button>
                    </div>

                    <div className="border-l border-gray-400 dark:border-gray-500" />

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => applyFormatting('formatBlock', '<h1>')}
                        className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                        title="Heading 1"
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormatting('formatBlock', '<h2>')}
                        className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormatting('formatBlock', '<h3>')}
                        className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                        title="Heading 3"
                      >
                        H3
                      </button>
                    </div>

                    <div className="border-l border-gray-400 dark:border-gray-500" />

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => applyFormatting('insertUnorderedList')}
                        className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                        title="Bullet List"
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFormatting('insertOrderedList')}
                        className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                        title="Numbered List"
                      >
                        1. List
                      </button>
                    </div>

                    <div className="border-l border-gray-400 dark:border-gray-500" />

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => applyFormatting('createLink', prompt('Enter URL:'))}
                        className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                        title="Link"
                      >
                        🔗 Link
                      </button>
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.currentTarget.innerHTML,
                      }))
                    }
                    className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
                    suppressContentEditableWarning
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Rich text editor - format your content above</p>
                </div>
              ) : (
                /* List Section */
                <div>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search pages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={() => handleOpenForm()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Plus size={20} />
                      New Page
                    </button>
                  </div>

                  {loading ? (
                    <div className="text-center py-12">
                      <Loader2 size={32} className="animate-spin mx-auto text-blue-600 mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">Loading pages...</p>
                    </div>
                  ) : filteredPages.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No pages created yet</p>
                      <button
                        onClick={() => handleOpenForm()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg inline-flex items-center gap-2 transition-colors"
                      >
                        <Plus size={20} />
                        Create First Page
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredPages.map((page) => (
                        <div key={page.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                  {page.title}
                                </h3>
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    page.isPublished
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                                  }`}
                                >
                                  {page.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                URL: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">/{page.slug}</code>
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {page.description || 'No description'}
                              </p>
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleTogglePublish(page.id, page.isPublished)}
                                disabled={saving}
                                title={page.isPublished ? 'Unpublish' : 'Publish'}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
                              >
                                {page.isPublished ? (
                                  <Eye size={18} className="text-green-600" />
                                ) : (
                                  <EyeOff size={18} className="text-gray-400" />
                                )}
                              </button>
                              <button
                                onClick={() => handleOpenForm(page)}
                                disabled={saving}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
                              >
                                <Edit size={18} className="text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleDelete(page.id)}
                                disabled={saving}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
                              >
                                <Trash2 size={18} className="text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
