import { CheckCircle2 } from 'lucide-react'
import { aboutContent } from '../../data/site'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'
import SiteImage from '../ui/SiteImage'

export default function AboutSection() {
  return (
    <section id="about" className="section-band px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <Reveal>
          <SectionHeading
            eyebrow="About"
            title={aboutContent.headline}
            description="The source website positions Marcos Water Solution as a water management company focused on water treatment systems, components, service, and operation."
          />
          <div className="mt-7 grid gap-5 text-base leading-7 text-slate-700">
            {aboutContent.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {aboutContent.proofPoints.map((point) => (
              <div key={point} className="rounded-lg border border-cyan-900/10 bg-white p-4 shadow-sm">
                <CheckCircle2 className="text-cyan-700" size={20} aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-900">{point}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="relative">
          <div className="overflow-hidden rounded-lg border border-white bg-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]">
            <div className="relative aspect-[16/11] bg-white">
              <SiteImage
                src="/images/about-image.png"
                alt="Marcos Water Solutions cabinet based water softener system for apartments"
                fill
                className="object-contain"
              />
            </div>
            <div className="border-t border-cyan-900/10 bg-slate-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">Our Expertise</p>
              <ul className="mt-4 grid gap-2 text-sm leading-6 sm:grid-cols-2 lg:grid-cols-1">
                {aboutContent.expertise.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-cyan-200" size={16} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
