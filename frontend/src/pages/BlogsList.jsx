import { Link } from 'react-router-dom'

export default function BlogsList({ blogs }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
            Blogs
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl">
            Tips, inspiration, and warm-light ideas from Lamp &amp; Glow.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <Link
              to={`/blog/${blog.id}`}
              className="absolute inset-0 z-10"
              aria-label={`Read ${blog.title}`}
            />
            <div className="aspect-[16/9] overflow-hidden bg-stone-100">
              <img
                src={blog.image}
                alt={blog.title}
                className="h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-stone-900">
                {blog.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                {blog.excerpt}
              </p>
              <div className="relative z-20 mt-4 inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                Read more
                <span aria-hidden>→</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
