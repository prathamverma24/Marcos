'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, X } from 'lucide-react'
import { useState } from 'react'
import { galleryItems } from '../../data/gallery'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeItem = activeIndex === null ? null : galleryItems[activeIndex]

  return (
    <section id="gallery" className="bg-white px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Gallery"
            title="Real product and application visuals from the current site"
            description="The gallery keeps the existing Marcos imagery while presenting it in a cleaner, inspection-friendly grid."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryItems.map((item, index) => (
            <Reveal key={item.image} delay={index * 0.03}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100 text-left shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/10 to-transparent" />
                <span className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                  <span className="rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-cyan-800">{item.category}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-white/90 text-slate-950 opacity-0 transition group-hover:opacity-100">
                    <Maximize2 size={16} aria-hidden="true" />
                  </span>
                </span>
                <span className="absolute bottom-4 left-4 right-4 text-lg font-semibold text-white">{item.title}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/80 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
            onClick={() => setActiveIndex(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl overflow-hidden rounded-lg bg-white"
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-md bg-white text-slate-950 shadow-lg"
                aria-label="Close gallery image"
              >
                <X size={20} aria-hidden="true" />
              </button>
              <div className="relative aspect-[16/10] bg-slate-100">
                <Image src={activeItem.image} alt={activeItem.alt} fill sizes="90vw" className="object-contain" />
              </div>
              <div className="border-t border-slate-200 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{activeItem.category}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{activeItem.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
