'use client'

import { Filter } from 'lucide-react'
import { useMemo, useState } from 'react'
import { products as bookingProducts, type BookingProduct } from '../../data/products'
import { products as productDetails, services, type Product } from '../../data/services'
import { cn } from '../../lib/utils'
import BookingModal from '../ui/BookingModal'
import ProductCard from '../ui/ProductCard'
import ProductDetailModal from '../ui/ProductDetailModal'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

export default function ProductShowcase() {
  const categories = useMemo(() => ['All', ...Array.from(new Set(bookingProducts.map((product) => product.category)))], [])
  const detailProductMap = useMemo(() => new Map(productDetails.map((product) => [product.slug, product])), [])
  const [category, setCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState<BookingProduct | null>(null)
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const visibleProducts =
    category === 'All' ? bookingProducts : bookingProducts.filter((product) => product.category === category)

  const handleBookProduct = (product: BookingProduct) => {
    setSelectedProduct(product)
    setIsBookingOpen(true)
  }

  const handleViewDetails = (product: BookingProduct) => {
    const details = product.detailSlug ? detailProductMap.get(product.detailSlug) : null

    if (details) {
      setSelectedDetailProduct(details)
    }
  }

  const handleBookFromDetails = () => {
    if (!selectedDetailProduct) {
      return
    }

    const bookingProduct = bookingProducts.find((product) => product.detailSlug === selectedDetailProduct.slug)

    if (bookingProduct) {
      setSelectedDetailProduct(null)
      handleBookProduct(bookingProduct)
    }
  }

  const selectedDetailBookingProduct = selectedDetailProduct
    ? bookingProducts.find((product) => product.detailSlug === selectedDetailProduct.slug)
    : null

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
                  onBook={handleBookProduct}
                  onViewDetails={product.detailSlug && detailProductMap.has(product.detailSlug) ? handleViewDetails : undefined}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <ProductDetailModal
        product={selectedDetailProduct}
        open={Boolean(selectedDetailProduct)}
        quoteLabel={selectedDetailBookingProduct?.quoteCta}
        onClose={() => setSelectedDetailProduct(null)}
        onQuote={handleBookFromDetails}
      />
      <BookingModal product={selectedProduct} open={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}
