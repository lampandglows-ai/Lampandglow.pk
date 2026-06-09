import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Truck } from 'lucide-react'
import shippingPolicyService from '../utils/shippingPolicyService.js'

export default function ShippingPolicyPage() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        const data = await shippingPolicyService.getPolicy()
        if (data?.content) setContent(data.content)
      } catch (e) {
        console.error('Error loading shipping policy:', e)
      } finally {
        setLoading(false)
      }
    }
    loadPolicy()
  }, [])

  return (
    <section className="w-full px-0 py-10 sm:py-14 bg-[#4C2600]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 hover:text-amber-200"
        >
          <span aria-hidden>←</span> Back
        </button>

        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-7 h-7 text-amber-300" />
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Shipping Policy
            </h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : content ? (
            <div className="prose max-w-none whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-white/80">
              {content}
            </div>
          ) : (
            <p className="text-sm text-white/60">
              Shipping policy information will be available soon.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
