import { useNavigate } from 'react-router-dom'

export default function AboutPage({ theme = 'light' }) {
  const navigate = useNavigate()

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
              About Lamp &amp; Glow
            </h1>
            <p className={theme === 'dark' ? 'mt-3 text-sm text-stone-300 leading-relaxed' : 'mt-3 text-sm text-stone-600 leading-relaxed'}>
              Lamp &amp; Glow is built for warm homes and thoughtful spaces. We craft decor pieces that feel natural,
              timeless, and premium—designed to elevate everyday living.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={theme === 'dark' ? 'rounded-2xl border border-white/10 bg-white/5 p-5' : 'rounded-2xl border border-stone-200 bg-white p-5'}>
                <p className={theme === 'dark' ? 'text-sm font-semibold text-stone-100' : 'text-sm font-semibold text-stone-900'}>
                  Handcrafted Feel
                </p>
                <p className={theme === 'dark' ? 'mt-2 text-xs text-stone-300' : 'mt-2 text-xs text-stone-600'}>
                  Carefully finished details, smooth edges, and a warm look that fits modern and classic interiors.
                </p>
              </div>
              <div className={theme === 'dark' ? 'rounded-2xl border border-white/10 bg-white/5 p-5' : 'rounded-2xl border border-stone-200 bg-white p-5'}>
                <p className={theme === 'dark' ? 'text-sm font-semibold text-stone-100' : 'text-sm font-semibold text-stone-900'}>
                  Built for Homes
                </p>
                <p className={theme === 'dark' ? 'mt-2 text-xs text-stone-300' : 'mt-2 text-xs text-stone-600'}>
                  Pieces that complement warm lighting setups and create calm, cozy corners.
                </p>
              </div>
              <div className={theme === 'dark' ? 'rounded-2xl border border-white/10 bg-white/5 p-5' : 'rounded-2xl border border-stone-200 bg-white p-5'}>
                <p className={theme === 'dark' ? 'text-sm font-semibold text-stone-100' : 'text-sm font-semibold text-stone-900'}>
                  Premium Materials
                </p>
                <p className={theme === 'dark' ? 'mt-2 text-xs text-stone-300' : 'mt-2 text-xs text-stone-600'}>
                  Natural textures, balanced tones, and clean finishing so every piece feels special.
                </p>
              </div>
              <div className={theme === 'dark' ? 'rounded-2xl border border-white/10 bg-white/5 p-5' : 'rounded-2xl border border-stone-200 bg-white p-5'}>
                <p className={theme === 'dark' ? 'text-sm font-semibold text-stone-100' : 'text-sm font-semibold text-stone-900'}>
                  Customer First
                </p>
                <p className={theme === 'dark' ? 'mt-2 text-xs text-stone-300' : 'mt-2 text-xs text-stone-600'}>
                  Friendly support and careful packing so your order arrives safely and beautifully.
                </p>
              </div>
            </div>
          </div>

          <div className={theme === 'dark' ? 'rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8' : 'rounded-3xl border border-stone-200 bg-white p-6 sm:p-8'}>
            <p className={theme === 'dark' ? 'text-sm font-semibold text-stone-100' : 'text-sm font-semibold text-stone-900'}>
              Our Mission
            </p>
            <p className={theme === 'dark' ? 'mt-2 text-sm text-stone-300 leading-relaxed' : 'mt-2 text-sm text-stone-600 leading-relaxed'}>
              To help you create warm, beautiful spaces by offering handcrafted decor with timeless design,
              balanced prices, and a premium buying experience.
            </p>

            <div className="mt-6">
              <p className={theme === 'dark' ? 'text-sm font-semibold text-stone-100' : 'text-sm font-semibold text-stone-900'}>
                Why customers love us
              </p>
              <ul className={theme === 'dark' ? 'mt-3 space-y-2 text-sm text-stone-300' : 'mt-3 space-y-2 text-sm text-stone-600'}>
                <li>Thoughtful designs for modern homes</li>
                <li>Careful finishing and quality checks</li>
                <li>Support that actually responds</li>
                <li>Warm aesthetic that matches your lighting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
