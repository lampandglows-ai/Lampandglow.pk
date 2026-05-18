export default function HomeTestimonials({ testimonials }) {
  return (
    <section className="relative w-full px-0 py-14 sm:py-16 bg-[rgba(76,38,0,1)] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/2 top-24 -translate-x-1/2 text-[140px] sm:text-[180px] leading-none tracking-[0.2em] text-amber-200 select-none">
          ★ ★ ★ ★ ★
        </div>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-amber-200">
            1000 + HAPPY CUSTOMERS
          </h2>
          <div className="mx-auto mt-3 h-px w-24 bg-white/30" />
          <p className="mt-4 text-xs sm:text-sm text-white/70">
            Hear from customers who brought Lamp &amp; Glow pieces into their homes.
          </p>
        </div>
      </div>

      <div className="relative mt-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch pt-8">
          {testimonials.map((t, idx) => {
            const quoteAccent = idx % 2 === 0 ? 'bg-violet-600' : 'bg-emerald-500'

            return (
              <figure
                key={t.id}
                className="relative h-full min-h-[320px] rounded-2xl bg-white shadow-lg px-6 pt-12 pb-6 flex flex-col"
              >
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-20 w-20 rounded-full bg-white p-1 shadow-md">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-semibold">
                      {t.name.charAt(0)}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold text-stone-900 tracking-wide">{t.name}</p>
                  <p className="mt-0.5 text-[10px] text-stone-500">VERIFIED BUYER</p>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="h-px flex-1 bg-stone-200" />
                  <div className={
                    `h-11 w-11 rounded-full ${quoteAccent} flex items-center justify-center text-white shadow-sm`
                  }>
                    <span className="text-2xl leading-none">“</span>
                  </div>
                  <div className="h-px flex-1 bg-stone-200" />
                </div>

                <p className="mt-4 flex-1 text-center text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {t.text}
                </p>

                <div className="mt-auto pt-5 text-center text-amber-500 text-[12px] tracking-widest">★★★★★</div>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
