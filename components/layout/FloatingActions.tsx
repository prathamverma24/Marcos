import { Mail, MessageCircle } from 'lucide-react'
import { siteData } from '../../data/site'
import { mailHref, whatsappHref } from '../../lib/utils'

export default function FloatingActions() {
  return (
    <div className="fixed bottom-4 right-4 z-40 grid gap-2 md:bottom-6 md:right-6" aria-label="Quick contact actions">
      <a
        href={mailHref(siteData.contact.email)}
        className="grid h-11 w-11 place-items-center rounded-md bg-cyan-600 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
        aria-label={`Email ${siteData.contact.email}`}
      >
        <Mail size={18} aria-hidden="true" />
      </a>
      <a
        href={whatsappHref(siteData.contact.whatsappNumbers[0].number, 'Hello Marcos Water Solutions, I want to request a quote.')}
        target="_blank"
        rel="noreferrer"
        className="grid h-11 w-11 place-items-center rounded-md bg-emerald-600 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
        aria-label="Message Marcos Water Solutions on WhatsApp"
      >
        <MessageCircle size={18} aria-hidden="true" />
      </a>
    </div>
  )
}
