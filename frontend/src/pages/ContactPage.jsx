import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ContactPage({ theme = 'light' }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  return (
    <section className="w-full px-0 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={
            theme === 'dark'
              ? 'inline-flex items-center gap-1 text-xs font-medium text-amber-300 hover:text-amber-200'
              : 'inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800'
          }
        >
          <span aria-hidden>←</span>
          Back
        </button>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          <div>
            <h1
              className={
                theme === 'dark'
                  ? 'text-2xl sm:text-3xl font-semibold tracking-tight text-stone-100'
                  : 'text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900'
              }
            >
              Contact Us
            </h1>
            <p className={theme === 'dark' ? 'mt-3 text-sm text-stone-300 leading-relaxed' : 'mt-3 text-sm text-stone-600 leading-relaxed'}>
              Have a question about an order, a product, or a custom request? Send us a message and we’ll respond
              as soon as possible.
            </p>

            <div className={theme === 'dark' ? 'mt-6 rounded-3xl border border-white/10 bg-white/5 p-6' : 'mt-6 rounded-3xl border border-stone-200 bg-white p-6'}>
              <p className={theme === 'dark' ? 'text-sm font-semibold text-stone-100' : 'text-sm font-semibold text-stone-900'}>
                Lamp &amp; Glow Support
              </p>
              <div className={theme === 'dark' ? 'mt-3 space-y-2 text-sm text-stone-300' : 'mt-3 space-y-2 text-sm text-stone-600'}>
                <p>Email: support@lampandglow.com</p>
                <p>WhatsApp: (302)-052-1000</p>
                <p>Location: Hameed Ullah Mokal Colony, Sahiwal</p>
              </div>
            </div>
          </div>

          <div className={theme === 'dark' ? 'rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8' : 'rounded-3xl border border-stone-200 bg-white p-6 sm:p-8'}>
            <p className={theme === 'dark' ? 'text-sm font-semibold text-stone-100' : 'text-sm font-semibold text-stone-900'}>
              Send a message
            </p>

            <form
              className="mt-5 grid grid-cols-1 gap-4"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <label className="grid gap-2 text-xs font-medium">
                <span className={theme === 'dark' ? 'text-stone-200' : 'text-stone-700'}>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className={
                    theme === 'dark'
                      ? 'h-11 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400'
                      : 'h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400'
                  }
                  placeholder="Your name"
                />
              </label>

              <label className="grid gap-2 text-xs font-medium">
                <span className={theme === 'dark' ? 'text-stone-200' : 'text-stone-700'}>Email</span>
                <input
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  className={
                    theme === 'dark'
                      ? 'h-11 rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400'
                      : 'h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400'
                  }
                  placeholder="you@example.com"
                />
              </label>

              <label className="grid gap-2 text-xs font-medium">
                <span className={theme === 'dark' ? 'text-stone-200' : 'text-stone-700'}>Message</span>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  rows={5}
                  className={
                    theme === 'dark'
                      ? 'rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400'
                      : 'rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400'
                  }
                  placeholder="Write your message..."
                />
              </label>

              <button
                type="submit"
                className={
                  theme === 'dark'
                    ? 'mt-1 inline-flex h-11 items-center justify-center rounded-xl bg-amber-500 px-4 text-sm font-semibold text-stone-950 transition-all duration-200 hover:bg-amber-400 active:scale-[0.99] motion-reduce:transform-none'
                    : 'mt-1 inline-flex h-11 items-center justify-center rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-amber-700 active:scale-[0.99] motion-reduce:transform-none'
                }
              >
                Send Message
              </button>

              <p className={theme === 'dark' ? 'text-[11px] text-stone-400' : 'text-[11px] text-stone-500'}>
                This form is for design only. Connect it to email/CRM later if needed.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
