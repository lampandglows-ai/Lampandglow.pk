import { Link, useNavigate, useParams } from 'react-router-dom'

export default function BlogDetail({ blogs }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const blogId = Number(id)
  const blog = blogs.find((b) => b.id === blogId)

  if (!blog) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800"
        >
          <span aria-hidden>←</span>
          Back
        </button>
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-700">
          Blog not found.
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800"
        >
          <span aria-hidden>←</span>
          Back
        </button>
        <Link
          to="/blogs"
          className="text-xs font-medium text-stone-600 hover:text-amber-700"
        >
          All blogs
        </Link>
      </div>

      <article className="mt-6 rounded-3xl border border-stone-200 bg-white overflow-hidden shadow-sm">
        <div className="aspect-[16/9] overflow-hidden bg-stone-100">
          <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
        </div>
        <div className="p-5 sm:p-7">
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-stone-900">
            {blog.title}
          </h1>
          <p className="mt-4 text-sm text-stone-700 leading-relaxed whitespace-pre-line">
            {blog.content}
          </p>
        </div>
      </article>
    </section>
  )
}
