'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { products } from '../../data/services'
import { siteData } from '../../data/site'
import type { ContactFormData } from '../../lib/validations'
import { contactSchema } from '../../lib/validations'
import { mailHref, telHref, whatsappHref } from '../../lib/utils'
import ButtonLink from '../ui/ButtonLink'
import Reveal from '../ui/Reveal'
import SectionHeading from '../ui/SectionHeading'

type ApiResponse = {
  success?: boolean
  setupRequired?: boolean
  provider?: string
  error?: string
}

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'success' | 'setup' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      interest: products[0].title,
      organization: '',
      honeypot: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const payload = (await response.json()) as ApiResponse

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Could not send the message')
      }

      if (payload.setupRequired) {
        setStatus('setup')
        setMessage('Your details are valid. Add WEB3FORMS_ACCESS_KEY or RESEND_API_KEY on the server to email submissions automatically.')
      } else {
        setStatus('success')
        setMessage('Message sent successfully. Marcos Water Solutions will contact you soon.')
        reset({ interest: products[0].title, organization: '', honeypot: '' })
      }
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'There was a problem sending your message. Please call or email Marcos Water Solutions.')
    }
  }

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(siteData.contact.address)}&output=embed`

  return (
    <section id="contact" className="bg-slate-950 px-5 py-20 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Start your water system project or request a quote"
            description="Share the product, service, capacity, and site context you have. Marcos Water Solutions can respond through call, email, or WhatsApp."
            tone="dark"
          />

          <div className="mt-8 grid gap-4">
            <a href={telHref(siteData.contact.phone)} className="contact-line">
              <Phone size={20} aria-hidden="true" />
              <span>
                <span>Phone</span>
                <strong>{siteData.contact.phone}</strong>
              </span>
            </a>
            <a href={mailHref(siteData.contact.email)} className="contact-line">
              <Mail size={20} aria-hidden="true" />
              <span>
                <span>Email</span>
                <strong>{siteData.contact.email}</strong>
              </span>
            </a>
            <div className="contact-line">
              <MapPin size={20} aria-hidden="true" />
              <span>
                <span>Address</span>
                <strong>{siteData.contact.address}</strong>
              </span>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink
              href={whatsappHref(siteData.contact.whatsappNumbers[0].number, 'Hello Marcos Water Solutions, I want to request a quote.')}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
            >
              <MessageCircle size={17} aria-hidden="true" />
              WhatsApp
            </ButtonLink>
            <ButtonLink href={telHref(siteData.contact.phone)} variant="secondary">
              <Phone size={17} aria-hidden="true" />
              Call Now
            </ButtonLink>
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <iframe
              title="Marcos Water Solutions location map"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full border-0"
            />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-white/10 bg-white p-5 text-slate-950 shadow-[0_24px_90px_rgba(0,0,0,0.24)] md:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.name?.message}>
                <input {...register('name')} type="text" autoComplete="name" className="form-field" />
              </Field>
              <Field label="Phone number" error={errors.phone?.message}>
                <input {...register('phone')} type="tel" autoComplete="tel" inputMode="tel" className="form-field" />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Email" error={errors.email?.message}>
                <input {...register('email')} type="email" autoComplete="email" className="form-field" />
              </Field>
              <Field label="Organization" error={errors.organization?.message}>
                <input {...register('organization')} type="text" autoComplete="organization" className="form-field" />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Service/Product interest" error={errors.interest?.message}>
                <select {...register('interest')} className="form-field">
                  {products.map((product) => (
                    <option key={product.slug} value={product.title}>
                      {product.title}
                    </option>
                  ))}
                  <option value="Installation or maintenance support">Installation or maintenance support</option>
                  <option value="Other water treatment requirement">Other water treatment requirement</option>
                </select>
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Message" error={errors.message?.message}>
                <textarea {...register('message')} rows={5} className="form-field resize-y" />
              </Field>
            </div>

            <input {...register('honeypot')} type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={17} aria-hidden="true" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {status !== 'idle' ? (
              <p
                className={`mt-4 rounded-lg border px-4 py-3 text-sm leading-6 ${
                  status === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : status === 'setup'
                      ? 'border-amber-200 bg-amber-50 text-amber-800'
                      : 'border-red-200 bg-red-50 text-red-800'
                }`}
                role="status"
              >
                {message}
              </p>
            ) : null}
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-2 block text-sm text-red-700">{error}</span> : null}
    </label>
  )
}
