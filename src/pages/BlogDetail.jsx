import { Link, useNavigate, useParams } from 'react-router-dom'

export default function BlogDetail({ blogs }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const blogId = Number(id)
  const blog = blogs.find((b) => b.id === blogId)

  if (!blog) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#4C2600]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 hover:text-amber-200"
        >
          <span aria-hidden>←</span>
          Back
        </button>
        <div className="mt-6 rounded-2xl border border-[#FFDA03]/20 bg-[#5c3418] p-6 text-sm text-white/80">
          Blog not found.
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#4C2600]">
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
        <div className="aspect-[16/9] overflow-hidden bg-[#4C2600]">
          <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
        </div>
        <div className="p-5 sm:p-7">
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-white">
            {blog.title}
          </h1>
          <p className="mt-4 text-sm text-white/80 leading-relaxed whitespace-pre-line">
            {blog.content}
          </p>
        </div>
      </article>
    </section>
  )
}
