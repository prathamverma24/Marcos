'use client'

import { ArrowDown, Droplets, ShieldCheck, Wrench } from 'lucide-react'
import { siteData } from '../../data/site'
import ButtonLink from '../ui/ButtonLink'
import SiteImage from '../ui/SiteImage'

export default function HeroSection() {
  const activeSlide = siteData.hero.slides[0]

  return (
    <section id="top" className="relative isolate min-h-[88svh] overflow-hidden pt-28 md:pt-36">
      <SiteImage
        src={activeSlide.image}
        alt="Marcos Water Solutions water treatment system"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(3,7,18,0.82)_0%,rgba(8,47,73,0.68)_45%,rgba(14,116,144,0.22)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f5fbff] to-transparent" />
      <div className="water-ribbon absolute inset-x-0 bottom-0 h-28" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[calc(88svh-9rem)] max-w-7xl items-center px-5 pb-16 lg:px-8">
        <div className="hero-copy max-w-3xl text-white">
          <p className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/12 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur">
            <Droplets size={16} aria-hidden="true" />
            {siteData.hero.eyebrow}
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl">{siteData.hero.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-cyan-50 md:text-xl">{siteData.hero.subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/#contact">{siteData.hero.ctaPrimary}</ButtonLink>
            <ButtonLink href="/#products" variant="secondary">
              {siteData.hero.ctaSecondary}
            </ButtonLink>
          </div>

          <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'Reliable Systems', text: 'RO, STP, ETP, and softening support' },
              { icon: Droplets, title: 'Clean Water Focus', text: 'Pure water, reuse, and discharge needs' },
              { icon: Wrench, title: 'Parts & Service', text: 'Maintenance and spare parts availability' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-white/20 bg-white/12 p-4 backdrop-blur">
                <item.icon size={20} aria-hidden="true" className="text-cyan-200" />
                <p className="mt-3 text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-cyan-50/90">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a
        href="/#about"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-md bg-white/88 px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white md:inline-flex"
      >
        <ArrowDown size={14} aria-hidden="true" />
        Scroll
      </a>
    </section>
  )
}
