import { useNavigate } from 'react-router-dom'

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <section className="w-full px-0 py-10 sm:py-14 bg-[#4C2600]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 hover:text-amber-200"
        >
          <span aria-hidden>←</span>
          Back
        </button>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              About Lamp &amp; Glow
            </h1>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">
              Lamp &amp; Glow is built for warm homes and thoughtful spaces. We craft decor pieces that feel natural,
              timeless, and premium—designed to elevate everyday living.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#FFDA03]/20 bg-[#5c3418] p-5">
                <p className="text-sm font-semibold text-white">
                  Handcrafted Feel
                </p>
                <p className="mt-2 text-xs text-white/70">
                  Carefully finished details, smooth edges, and a warm look that fits modern and classic interiors.
                </p>
              </div>
              <div className="rounded-2xl border border-[#FFDA03]/20 bg-[#5c3418] p-5">
                <p className="text-sm font-semibold text-white">
                  Built for Homes
                </p>
                <p className="mt-2 text-xs text-white/70">
                  Pieces that complement warm lighting setups and create calm, cozy corners.
                </p>
              </div>
              <div className="rounded-2xl border border-[#FFDA03]/20 bg-[#5c3418] p-5">
                <p className="text-sm font-semibold text-white">
                  Premium Materials
                </p>
                <p className="mt-2 text-xs text-white/70">
                  Natural textures, balanced tones, and clean finishing so every piece feels special.
                </p>
              </div>
              <div className="rounded-2xl border border-[#FFDA03]/20 bg-[#5c3418] p-5">
                <p className="text-sm font-semibold text-white">
                  Customer First
                </p>
                <p className="mt-2 text-xs text-white/70">
                  Friendly support and careful packing so your order arrives safely and beautifully.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#FFDA03]/20 bg-[#5c3418] p-6 sm:p-8">
            <p className="text-sm font-semibold text-white">
              Our Mission
            </p>
            <p className="mt-2 text-sm text-white/70 leading-relaxed">
              To help you create warm, beautiful spaces by offering handcrafted decor with timeless design,
              balanced prices, and a premium buying experience.
            </p>

            <div className="mt-6">
              <p className="text-sm font-semibold text-white">
                Why customers love us
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
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
