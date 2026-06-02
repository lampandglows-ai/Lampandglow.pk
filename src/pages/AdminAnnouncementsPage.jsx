import { useState, useEffect } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  Loader2,
  Megaphone,
  X,
  Eye,
  EyeOff,
} from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import announcementService from '../utils/announcementService.js'

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    message: '',
    isActive: true,
  })

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setLoading(true)
        const data = await announcementService.getAllAnnouncements()
        setAnnouncements(data)
      } catch (e) {
        console.error('Error loading announcements:', e)
        setMessage({ type: 'error', text: 'Failed to load announcements from Firebase' })
      } finally {
        setLoading(false)
      }
    }
    loadAnnouncements()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.message.trim()) {
      setMessage({ type: 'error', text: 'Please enter an announcement message' })
      return
    }

    setSaving(true)

    try {
      const payload = {
        message: formData.message.trim(),
        isActive: formData.isActive,
      }

      if (editingId) {
        await announcementService.updateAnnouncement(editingId, payload)
        setAnnouncements((prev) =>
          prev.map((a) =>
            a.id === editingId
              ? { ...a, ...payload, updatedAt: new Date().toISOString() }
              : a
          )
        )
        setMessage({ type: 'success', text: 'Announcement updated successfully!' })
        setEditingId(null)
      } else {
        const newAnnouncement = await announcementService.createAnnouncement(payload)
        setAnnouncements((prev) => [newAnnouncement, ...prev])
        setMessage({ type: 'success', text: 'Announcement created successfully!' })
      }

      resetForm()
    } catch (error) {
      console.error('Error saving announcement:', error)
      setMessage({ type: 'error', text: 'Failed to save announcement. Please try again.' })
    } finally {
      setSaving(false)
    }

    setTimeout(() => {
      setMessage({ type: '', text: '' })
    }, 3000)
  }

  const resetForm = () => {
    setFormData({ message: '', isActive: true })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (announcement) => {
    setFormData({
      message: announcement.message || '',
      isActive: announcement.isActive !== false,
    })
    setEditingId(announcement.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await announcementService.deleteAnnouncement(id)
        setAnnouncements((prev) => prev.filter((a) => a.id !== id))
        setMessage({ type: 'success', text: 'Announcement deleted successfully!' })
      } catch (error) {
        console.error('Error deleting announcement:', error)
        setMessage({ type: 'error', text: 'Failed to delete announcement. Please try again.' })
      }
      setTimeout(() => {
        setMessage({ type: '', text: '' })
      }, 3000)
    }
  }

  const handleToggleActive = async (announcement) => {
    try {
      const updated = { ...announcement, isActive: !announcement.isActive }
      await announcementService.updateAnnouncement(announcement.id, updated)
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === announcement.id ? { ...a, isActive: !a.isActive } : a))
      )
      setMessage({
        type: 'success',
        text: `Announcement ${updated.isActive ? 'activated' : 'deactivated'} successfully!`,
      })
    } catch (error) {
      console.error('Error toggling announcement:', error)
      setMessage({ type: 'error', text: 'Failed to update announcement status.' })
    }
    setTimeout(() => {
      setMessage({ type: '', text: '' })
    }, 3000)
  }

  const filteredAnnouncements = announcements.filter((a) => {
    const q = searchQuery.toLowerCase()
    return a.message?.toLowerCase().includes(q)
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Announcement Bar</h2>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transition flex items-center gap-2 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Announcement
          </button>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <p
              className={`font-medium ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          />
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              Only one announcement is shown at a time
            </p>
            <p className="text-xs text-blue-600 mt-1">
              The most recently created active announcement will appear in the top bar on the website homepage.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <span className="ml-3 text-gray-600">Loading announcements...</span>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="p-12 text-center">
              <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No announcements found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery
                  ? 'Try adjusting your search.'
                  : 'Create your first announcement to get started.'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                    Message
                  </th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 w-28">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAnnouncements.map((announcement) => (
                  <tr key={announcement.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800 font-medium line-clamp-2">
                        {announcement.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {announcement.createdAt
                          ? new Date(announcement.createdAt).toLocaleString()
                          : ''}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(announcement)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition ${
                          announcement.isActive !== false
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {announcement.isActive !== false ? (
                          <>
                            <Eye className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Announcement' : 'Create Announcement'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Announcement Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="e.g., Free Shipping on Orders Above 10,000"
                  rows={3}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white resize-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (show on website)
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
