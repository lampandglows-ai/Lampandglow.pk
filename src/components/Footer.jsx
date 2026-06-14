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
import footerService from '../utils/footerService.js'

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

const DEFAULT_CONFIG = {
  phone: '',
  email: 'lampandglowofficial01@gmail.com',
  whatsapp: '923134371467',
  showWhatsAppInFooter: true,
  address: '',
  city: 'Sahiwal',
}

const DEFAULT_LINKS = [
  // Quick Links
  { id: 'default-home', label: 'Home', url: '/', section: 'quickLinks', isActive: true, displayOrder: 0 },
  { id: 'default-contact', label: 'Contact Us', url: '/contact', section: 'quickLinks', isActive: true, displayOrder: 1 },
  { id: 'default-about', label: 'About Us', url: '/about-us', section: 'quickLinks', isActive: true, displayOrder: 2 },
  { id: 'default-wishlist', label: 'Wishlist', url: '/wishlist', section: 'quickLinks', isActive: true, displayOrder: 3 },
  { id: 'default-blogs', label: 'Blog', url: '/blogs', section: 'quickLinks', isActive: true, displayOrder: 4 },
  { id: 'default-shipping', label: 'Shipping Policy', url: '/shipping-policy', section: 'quickLinks', isActive: true, displayOrder: 5 },
  // Collections
  { id: 'default-table', label: 'Table Lamps', url: '#', section: 'collections', isActive: true, displayOrder: 0 },
  { id: 'default-floor', label: 'Floor Lamps', url: '#', section: 'collections', isActive: true, displayOrder: 1 },
  { id: 'default-ceiling', label: 'Roof/Ceiling Lamps', url: '#', section: 'collections', isActive: true, displayOrder: 2 },
  { id: 'default-wall', label: 'Wall Lamps', url: '#', section: 'collections', isActive: true, displayOrder: 3 },
  { id: 'default-hanging', label: 'Hanging Lamps', url: '#', section: 'collections', isActive: true, displayOrder: 4 },
  { id: 'default-bedside', label: 'Bedside/Side Table Lamps', url: '#', section: 'collections', isActive: true, displayOrder: 5 },
  // Policies
  { id: 'default-privacy', label: 'Privacy Policy', url: '/privacy-policy', section: 'policies', isActive: true, displayOrder: 0 },
  { id: 'default-refund', label: 'Refund Policy', url: '#', section: 'policies', isActive: true, displayOrder: 1 },
  { id: 'default-tos', label: 'Terms Of Service', url: '#', section: 'policies', isActive: true, displayOrder: 2 },
  { id: 'default-affiliate', label: 'Affiliate Program', url: '#', section: 'policies', isActive: true, displayOrder: 3 },
]

const SECTION_LABELS = {
  quickLinks: 'Quick Links',
  collections: 'Collections',
  policies: 'Policies',
  other: 'Other',
}

export default function Footer({ theme = 'light' }) {
  const [socialLinks, setSocialLinks] = useState([])
  const [loadingSocial, setLoadingSocial] = useState(true)
  const [footerConfig, setFooterConfig] = useState(DEFAULT_CONFIG)
  const [footerLinks, setFooterLinks] = useState([])
  const [loadingFooter, setLoadingFooter] = useState(true)

  useEffect(() => {
    const loadSocial = async () => {
      try {
        const links = await socialLinksService.getActiveSocialLinks()
        setSocialLinks(links)
      } catch (e) {
        console.error('Error loading social links:', e)
      } finally {
        setLoadingSocial(false)
      }
    }
    loadSocial()
  }, [])

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const [configData, linksData] = await Promise.all([
          footerService.getFooterConfig(),
          footerService.getActiveFooterLinks(),
        ])
        if (configData) {
          setFooterConfig({
            phone: configData.phone || DEFAULT_CONFIG.phone,
            email: configData.email || DEFAULT_CONFIG.email,
            whatsapp: configData.whatsapp || DEFAULT_CONFIG.whatsapp,
            showWhatsAppInFooter: configData.showWhatsAppInFooter !== false,
            address: configData.address || DEFAULT_CONFIG.address,
            city: configData.city || DEFAULT_CONFIG.city,
          })
        }
        if (linksData && linksData.length > 0) {
          setFooterLinks(linksData)
        } else {
          setFooterLinks(DEFAULT_LINKS)
        }
      } catch (e) {
        console.error('Error loading footer data:', e)
        setFooterLinks(DEFAULT_LINKS)
      } finally {
        setLoadingFooter(false)
      }
    }
    loadFooterData()
  }, [])

  const activeLinks = footerLinks.filter((l) => l.isActive !== false)

  const groupedLinks = activeLinks.reduce((acc, link) => {
    const section = link.section || 'other'
    if (!acc[section]) acc[section] = []
    acc[section].push(link)
    return acc
  }, {})

  // Sort links within each section by displayOrder
  Object.keys(groupedLinks).forEach((section) => {
    groupedLinks[section].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
  })

  const getSectionTitle = (section) => SECTION_LABELS[section] || section

  const textClass = theme === 'dark' ? 'text-stone-300' : 'text-yellow-100/80'
  const headingClass = 'text-sm font-semibold text-[#FFDA03]'
  const linkListClass = `mt-4 space-y-2 text-sm ${textClass} flex flex-col items-center sm:items-start`
  const iconClass = theme === 'dark' ? 'mt-1 h-4 w-4 text-[#FFDA03]' : 'mt-1 h-4 w-4 text-[#FFDA03]'
  const socialContainerClass = `mt-6 flex items-center justify-center sm:justify-start gap-5 ${textClass}`
  const hoverClass = theme === 'dark' ? 'hover:text-[#FFDA03]' : 'hover:text-[#FFDA03]'

  const renderLink = (link) => {
    const isExternal = link.url?.startsWith('http')
    const isHash = link.url === '#'
    if (isHash) {
      return (
        <span className="hover:underline cursor-default opacity-60">
          {link.label}
        </span>
      )
    }
    if (isExternal) {
      return (
        <a href={link.url}  className="hover:underline">
          {link.label}
        </a>
      )
    }
    return (
      <Link to={link.url} className="hover:underline">
        {link.label}
      </Link>
    )
  }

  const sectionOrder = ['quickLinks', 'collections', 'policies', 'other']
  const visibleSections = sectionOrder.filter((s) => groupedLinks[s] && groupedLinks[s].length > 0)

  return (
    <footer>
      <div
        className={
          theme === 'dark'
            ? 'border-t border-white/10 bg-[#2b1500]'
            : 'border-t border-[#FFDA03]/20 bg-[#2b1500]'
        }
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {/* Contact Info Column */}
            <div className="text-center sm:text-left">
              <p className={headingClass}>
                {footerConfig.city || 'Contact'}
              </p>
              <div className={linkListClass}>
                {footerConfig.address && (
                  <div className="flex justify-center sm:justify-start gap-3">
                    <FaMapMarkerAlt className={iconClass} />
                    <span>{footerConfig.address}</span>
                  </div>
                )}
                {footerConfig.city && !footerConfig.address && (
                  <div className="flex justify-center sm:justify-start gap-3">
                    <FaMapMarkerAlt className={iconClass} />
                    <span>{footerConfig.city}</span>
                  </div>
                )}
                {footerConfig.phone && (
                  <div className="flex justify-center sm:justify-start gap-3">
                    <FaWhatsapp className={iconClass} />
                    <span>Phone: {footerConfig.phone}</span>
                  </div>
                )}
                {footerConfig.whatsapp && footerConfig.showWhatsAppInFooter !== false && (
                  <div className="flex justify-center sm:justify-start gap-3">
                    <FaWhatsapp className={iconClass} />
                    <span>WhatsApp: {footerConfig.whatsapp}</span>
                  </div>
                )}
                {footerConfig.email && (
                  <div className="flex justify-center sm:justify-start gap-3">
                    <FaEnvelope className={iconClass} />
                    <a href={`mailto:${footerConfig.email}`} className="hover:underline">
                      {footerConfig.email}
                    </a>
                  </div>
                )}
              </div>

              <div className={socialContainerClass}>
                {loadingSocial ? (
                  <span className="text-xs text-stone-400">Loading...</span>
                ) : socialLinks.length > 0 ? (
                  socialLinks.map((link) => {
                    const Icon = PLATFORM_ICONS[link.platform] || FaFacebook
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        
                        aria-label={link.platform}
                        className={hoverClass}
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

            {/* Dynamic Footer Link Sections */}
            {visibleSections.map((section) => (
              <div key={section} className="text-center sm:text-left">
                <p className={headingClass}>
                  {getSectionTitle(section)}
                </p>
                <ul className={linkListClass}>
                  {groupedLinks[section].map((link) => (
                    <li key={link.id}>{renderLink(link)}</li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Column */}
            <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <p className={headingClass}>
                Newsletter Sign Up
              </p>
              <p className={`mt-4 text-sm ${textClass}`}>
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
        <div className={`w-full px-4 sm:px-6 lg:px-8 py-4 text-center text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-yellow-100/60'}`}>
          &copy; {new Date().getFullYear()} All rights reserved by Lampandglow.
        </div>
      </div>

      {footerConfig.whatsapp && (
        <a
          href={`https://wa.me/${footerConfig.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="h-5 w-5" />
          Chat on WhatsApp
        </a>
      )}
    </footer>
  )
}
