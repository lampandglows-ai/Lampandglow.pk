import { Link } from 'react-router-dom'

export default function BlogsList({ blogs }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#4C2600]">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="group relative overflow-hidden rounded-2xl border border-[#FFDA03]/20 bg-[#5c3418] shadow-sm hover:shadow-md transition-shadow"
          >
            <Link
              to={`/blog/${blog.id}`}
              className="absolute inset-0 z-10"
              aria-label={`Read ${blog.title}`}
            />
            <div className="aspect-[16/9] overflow-hidden bg-[#4C2600]">
              <img
                src={blog.image}
                alt={blog.title}
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
              <div className="relative z-20 mt-4 inline-flex items-center gap-1 text-xs font-medium text-amber-300">
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
