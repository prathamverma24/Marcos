'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { explainerSteps } from '../../data/services'
import Hotspot from '../ui/Hotspot'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

export default function ProductExplainer() {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const activeStep = explainerSteps[activeIndex]

  return (
    <section id="product-explainer" className="section-band px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Interactive Explainer"
            title="Understand the water treatment journey step by step"
            description="This workflow turns the current product content into a simple public-friendly explanation across RO, STP, ETP, softener, and spare-part support."
          />
        </Reveal>

        <div className="mt-12 grid gap-9 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="sticky top-32 hidden lg:block">
            <div className="relative min-h-[620px] overflow-hidden rounded-lg border border-cyan-900/10 bg-white p-8 shadow-[0_22px_80px_rgba(8,145,178,0.12)]">
              <div className="absolute inset-x-8 top-20 h-1 rounded-full bg-gradient-to-r from-cyan-200 via-cyan-500 to-emerald-400" />
              <div className="water-system-visual mx-auto mt-10" aria-hidden="true">
                <div className="tank tank-a" />
                <div className="pipe pipe-a" />
                <div className="filter-stack">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="pipe pipe-b" />
                <div className="tank tank-b" />
                <div className="pipe pipe-c" />
                <div className="output-drop" />
              </div>

              <Hotspot active={activeIndex === 0} label="Source" className="left-8 top-44" />
              <Hotspot active={activeIndex === 1} label="Pre-filter" className="left-48 top-24" />
              <Hotspot active={activeIndex === 2} label="Core treatment" className="right-20 top-48" />
              <Hotspot active={activeIndex === 3} label="Output" className="right-10 bottom-32" />
              <Hotspot active={activeIndex === 4} label="Support" className="left-12 bottom-20" />

              <motion.div
                key={activeStep.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-x-8 bottom-8 rounded-lg border border-cyan-900/10 bg-[#f5fbff] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
                  Step {activeIndex + 1} / {explainerSteps.length}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{activeStep.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{activeStep.detail}</p>
              </motion.div>
            </div>
          </div>

          <div className="grid gap-4">
            {explainerSteps.map((step, index) => (
              <motion.article
                key={step.title}
                onViewportEnter={() => setActiveIndex(index)}
                viewport={{ once: false, amount: 0.55 }}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className={`rounded-lg border bg-white p-5 shadow-sm transition lg:min-h-[220px] ${
                  activeIndex === index ? 'border-cyan-500 shadow-[0_16px_50px_rgba(8,145,178,0.12)]' : 'border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="flex w-full items-start gap-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{step.label}</span>
                    <span className="mt-2 block text-xl font-semibold text-slate-950">{step.title}</span>
                  </span>
                </button>
                <p className="mt-4 text-base leading-7 text-slate-700">{step.description}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
