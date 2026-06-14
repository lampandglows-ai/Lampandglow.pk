import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
} from 'lucide-react'
import contactSubmissionsService from '../utils/contactSubmissionsService.js'
import contactPageService from '../utils/contactPageService.js'

const DEFAULT_CONTENT = {
  pageTitle: 'CONTACT US',
  subtitle: 'GET IN TOUCH',
  description:
    "We love to hear from our valuable customers. Contact us today and let us show you how our incredible pieces of art helping you out to lighten up your homes.",
  formTitle: 'Send us an email',
  formSubtitle: "Ask us anything! We're here to help.",
  liveHelpTitle: 'Live Help',
  liveHelpText:
    "If you have an issue or question that requires immediate assistance, you can click the button below to chat live with a Customer Service representative. If we aren't available, drop us an email to the left and we will get back to you within 20-36 hours!",
  whatsappLink: 'https://wa.me/3020521000',
  phoneText: 'TEXT: 302-052-1000',
  email: 'support@lampandglow.com',
  address: '45 West Road\nNewcastle Upon Tyne, NE4 9PX\nUnited Kingdom',
  showOpeningHours: true,
  openingHours: 'MON to SAT: 9:00AM - 10:00PM\nSUN: 10:00AM - 6:00PM',
  whatsappButtonText: 'Message Us',
  submitButtonText: 'Submit Comment!',
}

export default function ContactUsPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    comment: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [contentLoading, setContentLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contactPageService.getContactPage()
        if (data) {
          setContent((prev) => ({ ...prev, ...data }))
        }
      } catch (err) {
        console.error('Error loading contact page content:', err)
      } finally {
        setContentLoading(false)
      }
    }
    loadContent()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await contactSubmissionsService.createSubmission(form)
      setSubmitted(true)
      setForm({ name: '', phone: '', email: '', comment: '' })
      setTimeout(() => setSubmitted(false), 4000)
    } catch (err) {
      console.error('Error submitting contact form:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderAddress = () => {
    if (!content.address) return null
    return content.address.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.address.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  const renderOpeningHours = () => {
    if (!content.openingHours) return null
    return content.openingHours.split('\n').map((line, i) => (
      <p key={i}>{line}</p>
    ))
  }

  return (
    <section className="w-full min-h-screen bg-[#fafafa]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-800 transition"
        >
          <span aria-hidden>←</span>
          Back
        </button>

        {/* Header */}
        <div className="mt-8 text-center">
          <h1 className="text-sm font-bold tracking-[0.2em] text-stone-800 uppercase">
            {content.pageTitle}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm text-stone-500 leading-relaxed">
            {content.description}
          </p>
          <h2 className="mt-8 text-2xl sm:text-3xl font-bold text-stone-900">
            {content.subtitle}
          </h2>
        </div>

        {/* Content Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left — Form */}
          <div>
            <h3 className="text-sm font-bold text-stone-800">{content.formTitle}</h3>
            <p className="mt-1 text-sm text-stone-500">
              {content.formSubtitle}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border border-stone-200 bg-white px-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border border-stone-200 bg-white px-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full h-11 rounded-lg border border-stone-200 bg-white px-4 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
                  placeholder="Write your message..."
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-amber-400 px-8 text-sm font-bold text-stone-900 transition-all duration-200 hover:bg-amber-300 active:scale-[0.99] motion-reduce:transform-none disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : submitted ? 'Sent!' : content.submitButtonText}
              </button>
            </form>
          </div>

          {/* Right — Live Help Card */}
          <div className="lg:pl-4">
            <div className="rounded-xl border border-stone-100 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-bold text-stone-800">{content.liveHelpTitle}</h3>
              <p className="mt-2 text-sm text-stone-500 leading-relaxed">
                {content.liveHelpText}
              </p>

              {content.whatsappLink && (
                <a
                  href={content.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-amber-400 px-6 text-sm font-bold text-stone-900 transition-all duration-200 hover:bg-amber-300 active:scale-[0.99] motion-reduce:transform-none"
                >
                  {content.whatsappButtonText}
                </a>
              )}

              <div className="mt-8 space-y-4">
                {content.phoneText && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-stone-600">{content.phoneText}</span>
                  </div>
                )}

                {content.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-stone-600">{content.email}</span>
                  </div>
                )}

                {content.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-stone-600 leading-relaxed">
                      {renderAddress()}
                    </span>
                  </div>
                )}
              </div>

              {content.showOpeningHours && content.openingHours && (
                <div className="mt-8 pt-6 border-t border-stone-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <span className="text-sm font-semibold text-stone-700">
                      Opening Hours:
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-stone-500">
                    {renderOpeningHours()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
