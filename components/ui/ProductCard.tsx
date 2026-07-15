import { CalendarCheck, CheckCircle2 } from 'lucide-react'
import type { BookingProduct } from '../../data/products'
import SiteImage from './SiteImage'

type ProductCardProps = {
  product: BookingProduct
  onBook: (product: BookingProduct) => void
}

export default function ProductCard({ product, onBook }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <SiteImage
          src={product.image}
          alt={`${product.name} solution by Marcos Water Solutions`}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold text-cyan-800 shadow-sm">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold text-slate-950">{product.name}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-700">{product.description}</p>
        <div className="mt-4 rounded-lg bg-cyan-50/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">Use Case</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{product.useCase}</p>
        </div>
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-700">
          {product.features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <CheckCircle2 className="mt-1 shrink-0 text-cyan-700" size={15} aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => onBook(product)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
          >
            <CalendarCheck size={16} aria-hidden="true" />
            Book Consultation
          </button>
        </div>
      </div>
    </article>
  )
}
