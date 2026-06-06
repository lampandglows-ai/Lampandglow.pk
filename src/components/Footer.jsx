import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from 'react-icons/fa'
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaLinkedin,
  FaXTwitter,
  FaPinterestP,
} from 'react-icons/fa6'
import socialLinksService from '../utils/socialLinksService.js'

const PLATFORM_ICONS = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  x: FaXTwitter,
  pinterest: FaPinterestP,
  whatsapp: FaWhatsapp,
}

export default function Footer({ theme = 'light' }) {
  const [socialLinks, setSocialLinks] = useState([])
  const [loadingLinks, setLoadingLinks] = useState(true)

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const links = await socialLinksService.getActiveSocialLinks()
        setSocialLinks(links)
      } catch (e) {
        console.error('Error loading social links:', e)
      } finally {
        setLoadingLinks(false)
      }
    }
    loadLinks()
  }, [])

  return (
    <footer>
      <div
        className={
          theme === 'dark'
            ? 'border-t border-white/10 bg-[#2b1500]'
            : 'border-t border-[#FFDA03]/20 bg-[#2b1500]'
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            <div className="text-center sm:text-left">
              <p className={theme === 'dark' ? 'text-sm font-semibold text-[#FFDA03]' : 'text-sm font-semibold text-[#FFDA03]'}>
                Pakistan
              </p>
              <div className={theme === 'dark' ? 'mt-4 space-y-3 text-sm text-stone-300' : 'mt-4 space-y-3 text-sm text-yellow-100/80'}>
                <div className="flex justify-center sm:justify-start gap-3">
                  <FaMapMarkerAlt className={theme === 'dark' ? 'mt-1 h-4 w-4 text-[#FFDA03]' : 'mt-1 h-4 w-4 text-[#FFDA03]'} />
                  <span>Sahiwal</span>
                </div>
                <div className="flex justify-center sm:justify-start gap-3">
                  <FaWhatsapp className={theme === 'dark' ? 'mt-1 h-4 w-4 text-[#FFDA03]' : 'mt-1 h-4 w-4 text-[#FFDA03]'} />
                  <span>WhatsApp: 03134371467</span>
                </div>
                <div className="flex justify-center sm:justify-start gap-3">
                  <FaEnvelope className={theme === 'dark' ? 'mt-1 h-4 w-4 text-[#FFDA03]' : 'mt-1 h-4 w-4 text-[#FFDA03]'} />
                  <a href="mailto:lampandglowofficial01@gmail.com" className="hover:underline">
                    lampandglowofficial01@gmail.com
                  </a>
                </div>
              </div>

              <div className={theme === 'dark' ? 'mt-6 flex items-center justify-center sm:justify-start gap-5 text-stone-300' : 'mt-6 flex items-center justify-center sm:justify-start gap-5 text-yellow-100/80'}>
                {loadingLinks ? (
                  <span className="text-xs text-stone-400">Loading...</span>
                ) : socialLinks.length > 0 ? (
                  socialLinks.map((link) => {
                    const Icon = PLATFORM_ICONS[link.platform] || FaFacebook
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.platform}
                        className={theme === 'dark' ? 'hover:text-[#FFDA03]' : 'hover:text-[#FFDA03]'}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    )
                  })
                ) : (
                  <span className="text-xs text-stone-400">No social links configured</span>
                )}
              </div>
            </div>

            <div className="text-center sm:text-left">
              <p className={theme === 'dark' ? 'text-sm font-semibold text-[#FFDA03]' : 'text-sm font-semibold text-[#FFDA03]'}>
                Quick Links
              </p>
              <ul className={theme === 'dark' ? 'mt-4 space-y-2 text-sm text-stone-300 flex flex-col items-center sm:items-start' : 'mt-4 space-y-2 text-sm text-yellow-100/80 flex flex-col items-center sm:items-start'}>
                <li>
                  <Link to="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="hover:underline">
                    Wishlist
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Cart
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Register With Us
                  </a>
                </li>
                <li>
                  <Link to="/blogs" className="hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <a href="https://lampandglow.pk/shipping-policy" className="hover:underline">
                    Shipping Policy
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className={theme === 'dark' ? 'text-sm font-semibold text-[#FFDA03]' : 'text-sm font-semibold text-[#FFDA03]'}>
                Collections
              </p>
              <ul className={theme === 'dark' ? 'mt-4 space-y-2 text-sm text-stone-300 flex flex-col items-center sm:items-start' : 'mt-4 space-y-2 text-sm text-yellow-100/80 flex flex-col items-center sm:items-start'}>
                <li>
                  <a href="#" className="hover:underline">
                    Table Lamps
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Floor Lamps
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Roof/Ceiling Lamps
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Wall Lamps
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Hanging Lamps
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Bedside/Side Table Lamps
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className={theme === 'dark' ? 'text-sm font-semibold text-[#FFDA03]' : 'text-sm font-semibold text-[#FFDA03]'}>
                Policies
              </p>
              <ul className={theme === 'dark' ? 'mt-4 space-y-2 text-sm text-stone-300 flex flex-col items-center sm:items-start' : 'mt-4 space-y-2 text-sm text-yellow-100/80 flex flex-col items-center sm:items-start'}>
                <li>
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a href="https://lampandglow.pk/shipping-policy" className="hover:underline">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Terms Of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Affiliate Program
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <p className={theme === 'dark' ? 'text-sm font-semibold text-[#FFDA03]' : 'text-sm font-semibold text-[#FFDA03]'}>
                Newsletter Sign Up
              </p>
              <p className={theme === 'dark' ? 'mt-4 text-sm text-stone-300' : 'mt-4 text-sm text-yellow-100/80'}>
                Receive our latest updates about our products &amp; promotions.
              </p>

              <div className="mt-4 max-w-sm mx-auto sm:mx-0">
                <input
                  type="email"
                  placeholder="Email address"
                  className={
                    theme === 'dark'
                      ? 'w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA03]'
                      : 'w-full rounded-lg border border-[#FFDA03]/30 bg-[#4C2600]/50 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA03]'
                  }
                />
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-[#FFDA03] px-4 py-3 text-sm font-semibold text-[#4C2600] hover:bg-yellow-300 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={theme === 'dark' ? 'bg-[#1a0f00] border-t border-white/10' : 'bg-[#1a0f00] border-t border-[#FFDA03]/20'}>
        <div className={theme === 'dark' ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-stone-400' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-yellow-100/60'}>
          © {new Date().getFullYear()} All rights reserved by Lampandglow.
        </div>
      </div>

      <a
        href="https://wa.me/923134371467"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="h-5 w-5" />
        Chat on WhatsApp
      </a>
    </footer>
  )
}
