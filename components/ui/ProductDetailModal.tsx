'use client'

import { CalendarCheck, CheckCircle2, MessageCircle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Product } from '../../data/services'
import { siteData } from '../../data/site'
import { whatsappHref } from '../../lib/utils'
import SiteImage from './SiteImage'

type ProductDetailModalProps = {
  product: Product | null
  open: boolean
  quoteLabel?: string
  onClose: () => void
  onQuote: () => void
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function ProductDetailModal({ product, open, quoteLabel, onClose, onQuote }: ProductDetailModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector) || []).filter(
        (element) => element.offsetParent !== null,
      )

      if (!focusable.length) {
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKeyDown)
    window.setTimeout(() => closeButtonRef.current?.focus(), 80)

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, open])

  if (!open || !product) {
    return null
  }

  const whatsAppMessage = `Hello Marcos Water Solutions, I want a quote for ${product.title}.`

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/68 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div ref={panelRef} className="modal-panel max-h-[94svh] w-full overflow-y-auto rounded-t-lg bg-white shadow-2xl sm:max-w-5xl sm:rounded-lg">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{product.category}</p>
            <h2 id="product-detail-title" className="mt-2 text-2xl font-semibold text-slate-950 md:text-3xl">
              {product.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-700 transition hover:border-cyan-400 hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100"
            aria-label="Close product details"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
              <SiteImage
                src={product.image}
                alt={product.imageAlt || `${product.title} solution by Marcos Water Solutions`}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 rounded-lg border border-cyan-900/10 bg-cyan-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">Overview</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{product.details}</p>
            </div>
          </div>

          <div>
            <p className="text-base leading-7 text-slate-700">{product.summary}</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <DetailList title="Key Benefits" items={product.benefits} />
              <DetailList title="Applications" items={product.useCases} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onQuote}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200"
              >
                <CalendarCheck size={16} aria-hidden="true" />
                {quoteLabel || 'Request Quote'}
              </button>
              <a
                href={whatsappHref(siteData.contact.whatsappNumbers[0].number, whatsAppMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-cyan-600 px-5 py-2 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100"
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-5 border-t border-slate-200 p-5 lg:grid-cols-2">
          {product.detailSections.map((section) => (
            <section key={section.title} className="rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-950">{section.title}</h3>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-7 text-slate-700">
                  {paragraph}
                </p>
              ))}
              {section.groups?.map((group) => (
                <div key={group.title} className="mt-4">
                  <p className="text-sm font-semibold text-slate-900">{group.title}</p>
                  <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-700">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-1 shrink-0 text-cyan-700" size={15} aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-700">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 className="mt-1 shrink-0 text-cyan-700" size={15} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
