'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { faqs } from '../../data/faqs'
import { cn } from '../../lib/utils'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="bg-white px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Quick answers for people comparing RO, STP, ETP, water softener, and spare-part needs."
            align="center"
          />
        </Reveal>

        <div className="mt-10 grid gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <Reveal key={faq.question} delay={index * 0.03}>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span className="text-base font-semibold text-slate-950 md:text-lg">{faq.question}</span>
                    <ChevronDown className={cn('shrink-0 text-cyan-700 transition', isOpen && 'rotate-180')} size={20} aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24 }}
                      >
                        <p className="px-5 pb-5 text-sm leading-7 text-slate-700 md:text-base">{faq.answer}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
