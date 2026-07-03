import Image from 'next/image'
import { ArrowUp, Download } from 'lucide-react'
import { navigation } from '../../data/navigation'
import { products } from '../../data/services'
import { siteData } from '../../data/site'
import { mailHref, telHref, whatsappHref } from '../../lib/utils'

export default function Footer() {
  return (
    <footer className="bg-slate-950 px-5 py-12 text-slate-300 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_1.8fr]">
        <div>
          <a href="/#top" className="flex items-center gap-3">
            <span className="relative h-14 w-20 overflow-hidden rounded-md bg-white">
              <Image src="/images/logo-Bo6gkKPH.jpeg" alt="Marcos Water Solution logo" fill sizes="80px" className="object-contain" />
            </span>
            <span className="text-lg font-bold text-white">{siteData.companyName}</span>
          </a>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">{siteData.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={siteData.profileDownload}
              className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-50"
            >
              <Download size={16} aria-hidden="true" />
              Download Profile
            </a>
            <a
              href="/#top"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              <ArrowUp size={16} aria-hidden="true" />
              Back to Top
            </a>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Quick Links</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {navigation.slice(1).map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Products</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {products.slice(0, 5).map((product) => (
                <li key={product.slug}>
                  <a href="/#products" className="hover:text-white">
                    {product.shortTitle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Contact</p>
            <ul className="mt-4 grid gap-3 text-sm">
              <li>
                <a href={telHref(siteData.contact.phone)} className="hover:text-white">
                  {siteData.contact.phone}
                </a>
              </li>
              <li>
                <a href={mailHref(siteData.contact.email)} className="break-words hover:text-white">
                  {siteData.contact.email}
                </a>
              </li>
              <li className="leading-6 text-slate-400">{siteData.contact.address}</li>
              <li>
                <a
                  href={whatsappHref(siteData.contact.whatsappNumbers[0].number, 'Hello Marcos Water Solutions.')}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-300 hover:text-emerald-200"
                >
                  WhatsApp {siteData.contact.whatsappNumbers[0].display}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-slate-500">
        Copyright {new Date().getFullYear()} {siteData.companyName}. All rights reserved.
      </div>
    </footer>
  )
}
