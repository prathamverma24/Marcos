import { Check, Leaf, LifeBuoy, Settings2, ShieldCheck, Timer, WalletCards } from 'lucide-react'
import { whyChooseContent } from '../../data/site'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

const icons = [Settings2, ShieldCheck, LifeBuoy, WalletCards, Leaf, Timer]

export default function WhyChooseSection() {
  return (
    <section className="section-band px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Premium water solutions backed by trusted service"
            description="These trust points are preserved from the existing Marcos Water Solution about content and reframed for quick scanning."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {whyChooseContent.map((item, index) => {
            const Icon = icons[index] || Check
            return (
              <Reveal key={item.title} delay={index * 0.04}>
                <article className="h-full rounded-lg border border-cyan-900/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="grid h-11 w-11 place-items-center rounded-md bg-cyan-50 text-cyan-700">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{item.description}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
