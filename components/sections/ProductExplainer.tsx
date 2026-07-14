'use client'

import { CheckCircle2, Droplets, Filter, Gauge, Recycle, Settings2 } from 'lucide-react'
import { explainerSteps } from '../../data/services'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

const stepIcons = [Droplets, Filter, Gauge, Recycle, Settings2]

export default function ProductExplainer() {
  return (
    <section id="product-explainer" className="section-band overflow-hidden px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr] lg:items-end">
          <SectionHeading
            eyebrow="Process Flow"
            title="Water treatment workflow, shown simply"
            description="See the overall journey in the video, then scan the five practical stages Marcos uses to plan, treat, deliver, and support each system."
          />
          <div className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">Workflow Coverage</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">5 stages</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Intake, filtration, treatment, output, and maintenance support in one clean view.</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 overflow-hidden rounded-lg border border-cyan-900/10 bg-slate-950 shadow-[0_24px_80px_rgba(8,145,178,0.16)]">
            <div className="relative aspect-[16/7] min-h-[320px] overflow-hidden md:min-h-[380px]">
              <video
                src="/animated-workflow.mp4"
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Water treatment workflow video"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/18 to-transparent" aria-hidden="true" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/12 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                <Droplets size={16} aria-hidden="true" />
                Treatment System Video
              </div>
              <div className="absolute bottom-0 left-0 max-w-xl p-5 text-white md:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">From Water Source To Reliable Output</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight md:text-4xl">Visual overview of the complete treatment flow</h3>
                <p className="mt-3 max-w-lg text-sm leading-6 text-cyan-50/90 md:text-base">
                  A single media view keeps the section compact while the cards below explain what each stage means for a real project.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {explainerSteps.map((step, index) => {
            const Icon = stepIcons[index] || CheckCircle2

            return (
              <Reveal key={step.title} delay={index * 0.03}>
                <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-[0_18px_52px_rgba(8,145,178,0.12)]">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-cyan-50 text-cyan-700">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{step.label}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-slate-950">{step.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-700">{step.description}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
