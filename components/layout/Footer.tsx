import { ArrowUp, Download } from 'lucide-react'
import { navigation } from '../../data/navigation'
import { products } from '../../data/services'
import { siteData } from '../../data/site'
import { mailHref, whatsappHref } from '../../lib/utils'
import SiteImage from '../ui/SiteImage'

export default function Footer() {
  return (
    <footer className="bg-slate-950 px-5 py-12 text-slate-300 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_1.8fr]">
        <div>
          <a
            href="/#top"
            className="group inline-flex w-full max-w-[220px] items-center justify-center rounded-xl bg-white px-4 py-3 shadow-[0_18px_50px_rgba(8,145,178,0.16)] ring-1 ring-cyan-200/15 transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(34,197,94,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            aria-label="Marcos Water Solutions home"
          >
            <span className="relative block h-14 w-full overflow-hidden">
              <SiteImage
                src={siteData.logoPath}
                alt="Marcos Water Solutions"
                fill
                className="object-contain object-center transition duration-300 group-hover:scale-[1.02]"
              />
            </span>
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
