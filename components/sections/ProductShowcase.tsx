'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Filter, Waves } from 'lucide-react'
import { useMemo, useState } from 'react'
import { products as bookingProducts, type BookingProduct } from '../../data/products'
import { products as detailProducts, services } from '../../data/services'
import { cn } from '../../lib/utils'
import BookingModal from '../ui/BookingModal'
import ButtonLink from '../ui/ButtonLink'
import ProductCard from '../ui/ProductCard'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

export default function ProductShowcase() {
  const categories = useMemo(() => ['All', ...Array.from(new Set(bookingProducts.map((product) => product.category)))], [])
  const [category, setCategory] = useState('All')
  const [activeProductId, setActiveProductId] = useState(bookingProducts[0].id)
  const [selectedProduct, setSelectedProduct] = useState<BookingProduct | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const visibleProducts =
    category === 'All' ? bookingProducts : bookingProducts.filter((product) => product.category === category)
  const activeBookingProduct = bookingProducts.find((product) => product.id === activeProductId) || bookingProducts[0]
  const activeDetailProduct = detailProducts.find((product) => product.slug === activeBookingProduct.detailSlug)
  const detailImage = activeDetailProduct?.image || activeBookingProduct.image
  const detailTitle = activeDetailProduct?.title || activeBookingProduct.name
  const detailCategory = activeDetailProduct?.category || activeBookingProduct.category
  const detailDescription = activeDetailProduct?.details || activeBookingProduct.description
  const detailBenefits = activeDetailProduct?.benefits || activeBookingProduct.features
  const detailUseCases = activeDetailProduct?.useCases || [activeBookingProduct.useCase]
  const detailShortTitle = activeDetailProduct?.shortTitle || activeBookingProduct.name

  const handleBookProduct = (product: BookingProduct) => {
    setSelectedProduct(product)
    setIsBookingOpen(true)
  }

  return (
    <>
      <span id="services" className="block scroll-mt-32" />
      <section id="products" className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <Reveal>
              <SectionHeading
                eyebrow="Products & Services"
                title="Comprehensive water treatment solutions for every need"
                description="Choose a water treatment product, view its practical use case, and book a consultation with the selected product already attached to your request."
              />
            </Reveal>
            <Reveal delay={0.08} className="grid gap-3 sm:grid-cols-3">
              {services.map((service) => (
                <a
                  key={service.title}
                  href={service.link}
                  className="rounded-lg border border-cyan-900/10 bg-cyan-50/70 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:shadow-lg"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{service.category}</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-950">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{service.summary}</p>
                </a>
              ))}
            </Reveal>
          </div>

          <div className="mt-10 flex items-center gap-3 overflow-x-auto pb-2" aria-label="Product category filters">
            <Filter size={17} className="shrink-0 text-slate-500" aria-hidden="true" />
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  'min-h-10 shrink-0 rounded-md border px-4 py-2 text-sm font-semibold transition',
                  category === item
                    ? 'border-cyan-600 bg-cyan-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-400 hover:text-cyan-800',
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.04}>
                <ProductCard
                  product={product}
                  active={activeBookingProduct.id === product.id}
                  onViewDetails={(item) => setActiveProductId(item.id)}
                  onBook={handleBookProduct}
                />
              </Reveal>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={activeBookingProduct.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32 }}
              className="mt-10 grid gap-8 rounded-lg border border-cyan-900/10 bg-[#f5fbff] p-5 shadow-[0_20px_70px_rgba(8,145,178,0.12)] lg:grid-cols-[0.9fr_1.1fr] lg:p-8"
            >
              <div className="relative min-h-[280px] overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={detailImage}
                  alt={`${detailTitle} by Marcos Water Solutions`}
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
                  <Waves size={16} aria-hidden="true" />
                  {detailCategory}
                </p>
                <h3 className="mt-4 text-3xl font-semibold text-slate-950">{detailTitle}</h3>
                <p className="mt-4 text-base leading-7 text-slate-700">{detailDescription}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Benefits</p>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                      {detailBenefits.slice(0, 5).map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Use Cases</p>
                    <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                      {detailUseCases.slice(0, 5).map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink href="#product-explainer">How It Works</ButtonLink>
                  <ButtonLink href="#contact" variant="ghost">
                    Ask About {detailShortTitle}
                  </ButtonLink>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </section>
      <BookingModal product={selectedProduct} open={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}
