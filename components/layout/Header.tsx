'use client'

import { usePathname } from 'next/navigation'
import { Download, Mail, Menu, Send, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navigation } from '../../data/navigation'
import { siteData } from '../../data/site'
import { mailHref, whatsappHref } from '../../lib/utils'
import ButtonLink from '../ui/ButtonLink'
import SiteImage from '../ui/SiteImage'

function hashIdFromHref(href: string) {
  return href.includes('#') ? href.split('#')[1] : ''
}

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('top')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28)

      const sectionIds = navigation.map((item) => hashIdFromHref(item.href)).filter(Boolean)
      let current = 'top'

      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= 120) {
          current = id
        }
      }

      if (current) {
        setActiveSection(current)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="hidden border-b border-white/20 bg-slate-950 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-2 text-xs">
          <div className="flex items-center gap-4">
            <a className="inline-flex items-center gap-2 hover:text-cyan-200" href={mailHref(siteData.contact.email)}>
              <Mail size={14} aria-hidden="true" />
              {siteData.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            {siteData.contact.whatsappNumbers.map((item) => (
              <a
                key={item.number}
                className="inline-flex items-center gap-2 rounded-md border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 hover:bg-emerald-400/20"
                href={whatsappHref(item.number, 'Hello Marcos Water Solutions, I want to discuss a water treatment requirement.')}
                target="_blank"
                rel="noreferrer"
              >
                <Send size={13} aria-hidden="true" />
                {item.display}
              </a>
            ))}
            <a className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 font-semibold text-slate-950 hover:bg-cyan-50" href={siteData.profileDownload}>
              <Download size={14} aria-hidden="true" />
              Download Profile
            </a>
          </div>
        </div>
      </div>
      <nav
        className={`border-b transition ${
          scrolled
            ? 'border-cyan-900/10 bg-white/95 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl'
            : 'border-white/30 bg-white/95 shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur-md'
        }`}
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <a href="/#top" className="brand-logo" aria-label="Marco's Water Solutions home">
            <span className="brand-logo__glow" aria-hidden="true" />
            <span className="brand-logo__image-shell">
              <SiteImage src={siteData.logoPath} alt="Marco's Water Solutions" fill className="brand-logo__image" priority />
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => {
              const id = hashIdFromHref(item.href)
              const active = item.href === '/blog' ? pathname.startsWith('/blog') : pathname === '/' && activeSection === id
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    active ? 'bg-cyan-50 text-cyan-800' : 'text-slate-700 hover:bg-white hover:text-cyan-800'
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ButtonLink href="/#contact" variant="primary" className="min-h-10 px-4 py-2">
              Get Quote
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-800 transition hover:border-cyan-400 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {isOpen ? (
        <div className="mobile-menu-backdrop fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm lg:hidden">
          <div className="mobile-menu-panel absolute right-0 top-0 h-full w-full max-w-sm border-l border-slate-200 bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-slate-950">{siteData.companyName}</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-800"
                  aria-label="Close navigation menu"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-8 grid gap-2">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-semibold text-slate-800 hover:bg-cyan-50 hover:text-cyan-800"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="mt-8 grid gap-3">
                <ButtonLink href="/#contact" onClick={() => setIsOpen(false)}>
                  Request a Quote
                </ButtonLink>
                <ButtonLink href={siteData.profileDownload} variant="ghost">
                  <Download size={17} aria-hidden="true" />
                  Download Profile
                </ButtonLink>
              </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
