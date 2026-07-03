'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Rotate3D, Sparkles } from 'lucide-react'
import { PointerEvent, useState } from 'react'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

export default function VisualExperience() {
  const [rotation, setRotation] = useState({ x: -8, y: 28 })
  const [dragging, setDragging] = useState(false)
  const reduceMotion = useReducedMotion()

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientY - rect.top) / rect.height - 0.5) * -28
    const y = ((event.clientX - rect.left) / rect.width - 0.5) * 56
    setRotation({ x, y })
  }

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
            className="visual-stage relative min-h-[520px] cursor-grab touch-none select-none overflow-hidden rounded-lg border border-white/10"
            onPointerDown={(event) => {
              setDragging(true)
              event.currentTarget.setPointerCapture(event.pointerId)
            }}
            onPointerUp={(event) => {
              setDragging(false)
              event.currentTarget.releasePointerCapture(event.pointerId)
            }}
            onPointerCancel={() => setDragging(false)}
            onPointerMove={onPointerMove}
            role="img"
            aria-label="Interactive water treatment product visual"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,47,73,0.88),rgba(15,23,42,0.96)),linear-gradient(90deg,rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[length:auto,48px_48px,48px_48px]" />
            <div className="product-model-anchor">
              <motion.div
                className="product-model"
                animate={
                  reduceMotion || dragging
                    ? { rotateX: rotation.x, rotateY: rotation.y }
                    : { rotateX: [rotation.x, -4, rotation.x], rotateY: [rotation.y, 46, rotation.y] }
                }
                transition={reduceMotion || dragging ? { duration: 0.1 } : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="model-core" />
                <div className="model-panel panel-front">RO</div>
                <div className="model-panel panel-back">STP</div>
                <div className="model-panel panel-left">ETP</div>
                <div className="model-panel panel-right">Softener</div>
                <div className="model-pipe pipe-left" />
                <div className="model-pipe pipe-right" />
                <div className="model-base" />
              </motion.div>
            </div>
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-cyan-100 backdrop-blur">
              <Rotate3D size={16} aria-hidden="true" />
              Product system view
            </div>
            <div className="absolute inset-x-5 bottom-5 grid gap-3 text-xs font-semibold text-white sm:grid-cols-4">
              {['Intake', 'Filtration', 'Treatment', 'Output'].map((item) => (
                <span key={item} className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-center backdrop-blur">
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
