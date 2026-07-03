import { ClipboardCheck, Droplets, Gauge, Settings, Wrench } from 'lucide-react'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

const processSteps = [
  {
    title: 'Consultation',
    description: 'Understand your water needs and plan the right solution for your business.',
    icon: ClipboardCheck,
  },
  {
    title: 'Solution Selection',
    description: 'Select the right RO, STP, ETP, softener, industrial RO, or spare-parts path.',
    icon: Droplets,
  },
  {
    title: 'Installation',
    description: 'Set up the system with capacity, site, and water-quality requirements in mind.',
    icon: Settings,
  },
  {
    title: 'Quality Check',
    description: 'Validate the treated water flow, system behavior, and operating readiness.',
    icon: Gauge,
  },
  {
    title: 'Support',
    description: 'Keep the system working with maintenance, operation support, and spare parts.',
    icon: Wrench,
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Delivery Process"
            title="How Marcos Water Solutions delivers every project"
            description="A simple path from requirement understanding to installation, quality check, and long-term support."
          />
        </Reveal>

        <div className="relative mt-12 grid gap-5 lg:grid-cols-5">
          <div className="absolute left-0 right-0 top-11 hidden h-0.5 bg-slate-200 lg:block" aria-hidden="true" />
          <div className="timeline-progress absolute left-0 top-11 hidden h-0.5 bg-cyan-500 lg:block" aria-hidden="true" />
          {processSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.04}>
              <article className="relative h-full rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="relative z-10 grid h-12 w-12 place-items-center rounded-md bg-slate-950 text-white">
                  <step.icon size={20} aria-hidden="true" />
                </div>
                <p className="mt-5 text-sm font-semibold text-cyan-700">Step {index + 1}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
