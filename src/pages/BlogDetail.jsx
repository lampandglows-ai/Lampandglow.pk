import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Loader2, FileText } from 'lucide-react'
import blogsService from '../utils/blogsService.js'

export default function BlogDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true)
        const data = await blogsService.getBlogBySlug(slug)
        setBlog(data)
      } catch {
        setError('Blog not found or failed to load.')
      } finally {
        setLoading(false)
      }
    }
    loadBlog()
  }, [slug])

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#4C2600] min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/70">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading blog...</span>
        </div>
      </section>
    )
  }

  if (error || !blog) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#4C2600] min-h-[50vh]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 hover:text-amber-200"
        >
          <span aria-hidden>←</span>
          Back
        </button>
        <div className="mt-6 rounded-2xl border border-[#FFDA03]/20 bg-[#5c3418] p-6 text-sm text-white/80 text-center">
          <FileText className="w-10 h-10 text-white/20 mx-auto mb-3" />
          {error || 'Blog not found.'}
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#4C2600] min-h-screen">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 hover:text-amber-200"
        >
          <span aria-hidden>←</span>
          Back
        </button>
        <Link
          to="/blogs"
          className="text-xs font-medium text-white/70 hover:text-amber-300"
        >
          All blogs
        </Link>
      </div>

      <article className="mt-6 rounded-3xl border border-[#FFDA03]/20 bg-[#5c3418] overflow-hidden shadow-sm">
        {blog.featuredImage && (
          <div className="aspect-[16/9] overflow-hidden bg-[#4C2600]">
            <img
              src={blog.featuredImage}
              alt={blog.imageAltText || blog.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {blog.category && (
              <span className="text-xs font-medium text-amber-300 bg-amber-900/30 px-2.5 py-1 rounded-full">
                {blog.category}
              </span>
            )}
            {blog.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-white">
            {blog.title}
          </h1>
          {blog.publishedAt && (
            <p className="mt-2 text-xs text-white/40">
              Published on {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
          <div
            className="mt-6 text-sm text-white/80 leading-relaxed page-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>
    </section>
  )
}
