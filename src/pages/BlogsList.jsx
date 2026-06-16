import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, FileText } from 'lucide-react'
import blogsService from '../utils/blogsService.js'

export default function BlogsList() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true)
        const data = await blogsService.getPublishedBlogs(50)
        setBlogs(data)
      } catch {
        setError('Failed to load blogs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    loadBlogs()
  }, [])

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#4C2600] min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/70">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading blogs...</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#4C2600] min-h-[50vh] flex items-center justify-center">
        <p className="text-white/70">{error}</p>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#4C2600] min-h-screen">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Blogs
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/70 max-w-2xl">
            Tips, inspiration, and warm-light ideas from Lamp &amp; Glow.
          </p>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/60 text-lg font-medium">No blogs published yet</p>
          <p className="text-white/40 text-sm mt-1">Check back soon for new articles!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group relative overflow-hidden rounded-2xl border border-[#FFDA03]/20 bg-[#5c3418] shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                to={`/blog/${blog.slug || blog.id}`}
                className="absolute inset-0 z-10"
                aria-label={`Read ${blog.title}`}
              />
              <div className="aspect-[16/9] overflow-hidden bg-[#4C2600]">
                <img
                  src={blog.featuredImage || 'https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                  alt={blog.imageAltText || blog.title}
                  className="h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  {blog.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
                  {blog.excerpt}
                </p>
                {blog.category && (
                  <span className="inline-block mt-3 text-xs font-medium text-amber-300/80 bg-amber-900/30 px-2 py-0.5 rounded-full">
                    {blog.category}
                  </span>
                )}
                <div className="relative z-20 mt-4 inline-flex items-center gap-1 text-xs font-medium text-amber-300">
                  Read more
                  <span aria-hidden>→</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
