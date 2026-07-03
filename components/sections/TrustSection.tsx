import { MessageSquareQuote, ShieldCheck } from 'lucide-react'
import { testimonials, testimonialsNote } from '../../data/testimonials'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

export default function TrustSection() {
  return (
    <section className="section-band px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Trust"
            title="Trust-first service promises"
            description="Verified customer feedback can be added when Marcos shares approved customer quotes, names, and project details."
          />
        </Reveal>

        {testimonials.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={`${testimonial.name}-${testimonial.company}`} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <MessageSquareQuote className="text-cyan-700" size={24} aria-hidden="true" />
                <p className="mt-4 text-base leading-7 text-slate-700">{testimonial.quote}</p>
                <div className="mt-5 border-t border-slate-200 pt-4">
                  <p className="font-semibold text-slate-950">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.company}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Reveal delay={0.08}>
            <div className="mt-10 grid gap-5 rounded-lg border border-cyan-900/10 bg-white p-6 shadow-sm lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-md bg-cyan-50 text-cyan-700">
                  <ShieldCheck size={24} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-950">Verified testimonials pending</p>
                  <p className="mt-1 text-sm text-slate-600">Ready for approved customer quotes</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-700">{testimonialsNote}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
