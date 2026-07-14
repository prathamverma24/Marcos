'use client'

import { Rotate3D, Sparkles } from 'lucide-react'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

export default function VisualExperience() {
  return (
    <section className="overflow-hidden bg-slate-950 px-5 py-20 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <SectionHeading
            eyebrow="Visual System"
            title="A clear product-style view of treatment stages"
            description="The visual area gives visitors a quick mental model of intake, filtration, treatment, output, and service without slowing the page down."
            tone="dark"
          />
          <div className="mt-7 grid gap-3 text-sm leading-6 text-slate-300 sm:grid-cols-2">
            {['Source water intake', 'Pre-filtration', 'Core purification', 'Output and support'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <Sparkles size={16} className="text-cyan-300" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="visual-stage relative aspect-[16/9] min-h-[320px] overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-[0_24px_90px_rgba(8,145,178,0.18)] md:min-h-[440px]"
            role="img"
            aria-label="Water treatment product workflow video"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,47,73,0.68),rgba(15,23,42,0.94)),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[length:auto,48px_48px,48px_48px]" />
            <video
              className="absolute inset-0 h-full w-full object-contain object-center"
              src="/product-workflow.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="Product workflow demonstration"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/28" aria-hidden="true" />
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-slate-950/35 px-3 py-2 text-xs font-semibold text-cyan-100 shadow-sm backdrop-blur">
              <Rotate3D size={16} aria-hidden="true" />
              Product system view
            </div>
            <div className="absolute inset-x-5 bottom-5 grid gap-3 text-xs font-semibold text-white sm:grid-cols-4">
              {['Intake', 'Filtration', 'Treatment', 'Output'].map((item) => (
                <span key={item} className="rounded-md border border-white/15 bg-slate-950/34 px-3 py-2.5 text-center shadow-sm backdrop-blur">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
