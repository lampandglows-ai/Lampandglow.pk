import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import pagesService from '../utils/pagesService'

export default function PublicPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true)
        setError(null)
        const pageData = await pagesService.getPageBySlug(slug)
        if (!pageData) {
          setError('Page not found')
          setPage(null)
        } else {
          setPage(pageData)
        }
      } catch (err) {
        console.error('Error loading page:', err)
        setError('Failed to load page')
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin mx-auto text-[#FFDA03] mb-4" />
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The page you are looking for does not exist.'}</p>
          <a
            href="/"
            className="inline-block bg-[#FFDA03] hover:bg-yellow-300 text-[#4C2600] font-semibold py-2 px-6 rounded-full transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7e6] to-white dark:from-[#1a0f00] dark:to-gray-900">
      {/* Page Header */}
      <div className="bg-[#4C2600] dark:bg-[#2a1700] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{page.title}</h1>
          {page.description && (
            <p className="text-lg text-yellow-100">{page.description}</p>
          )}
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div
          className="page-content text-gray-800 dark:text-gray-100 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[#FFDA03] hover:text-yellow-300 font-semibold transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
