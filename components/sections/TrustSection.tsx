import { MessageSquareQuote, ShieldCheck, Star } from 'lucide-react'
import { getPublicReviews } from '../../lib/review-data'
import ReviewForm from './ReviewForm'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

export default async function TrustSection() {
  const reviews = await getPublicReviews()

  return (
    <section className="section-band px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Reviews"
            title="Customer reviews"
            description="Read customer feedback or share your own experience with Marcos Water Solutions."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            {reviews.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <MessageSquareQuote className="text-cyan-700" size={24} aria-hidden="true" />
                      <RatingStars rating={review.rating} />
                    </div>
                    <p className="mt-4 text-base leading-7 text-slate-700">{review.message}</p>
                    <div className="mt-5 border-t border-slate-200 pt-4">
                      <p className="font-semibold text-slate-950">{review.name}</p>
                      <p className="text-sm text-slate-500">
                        {[review.location, review.createdAt.toLocaleDateString('en-IN')].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Reveal delay={0.08}>
                <div className="rounded-lg border border-cyan-900/10 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-md bg-cyan-50 text-cyan-700">
                      <ShieldCheck size={24} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-950">No customer reviews yet</p>
                      <p className="mt-1 text-sm text-slate-600">Be the first to share a service experience.</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
          <ReviewForm />
        </div>
      </div>
    </section>
  )
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-amber-400" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          aria-hidden="true"
          className={index < rating ? 'fill-amber-400' : 'text-slate-300'}
        />
      ))}
    </div>
  )
}
