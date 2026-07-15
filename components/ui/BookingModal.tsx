'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarCheck, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { BookingProduct } from '../../data/products'
import type { BookingFormData } from '../../lib/validations'
import { bookingSchema } from '../../lib/validations'

type BookingModalProps = {
  product: BookingProduct | null
  open: boolean
  onClose: () => void
}

const requirementTypes = ['New Installation', 'Maintenance', 'Spare Parts', 'Consultation', 'Other']

function todayInputValue() {
  const today = new Date()
  const offset = today.getTimezoneOffset()
  const localDate = new Date(today.getTime() - offset * 60 * 1000)
  return localDate.toISOString().split('T')[0]
}

export default function BookingModal({ product, open, onClose }: BookingModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const minDate = useMemo(() => todayInputValue(), [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      productId: product?.id || '',
      productName: product?.name || '',
      requirementType: 'Consultation',
    },
  })

  useEffect(() => {
    if (open && product) {
      reset({
        name: '',
        phone: '',
        email: '',
        company: '',
        productId: product.id,
        productName: product.name,
        preferredDate: '',
        preferredTime: '',
        location: '',
        requirementType: 'Consultation',
        message: '',
      })
      setStatus('idle')
      setStatusMessage('')
      window.setTimeout(() => closeButtonRef.current?.focus(), 80)
    }
  }, [open, product, reset])

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose, open])

  const onSubmit = async (data: BookingFormData) => {
    setStatus('idle')
    setStatusMessage('')

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const payload = (await response.json()) as { success?: boolean; error?: string; setupRequired?: boolean }

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Something went wrong. Please try again or contact us directly.')
      }

      setStatus('success')
      setStatusMessage(
        `Thank you! Your booking request for ${data.productName} has been received. Our team will contact you soon.`,
      )
    } catch (error) {
      setStatus('error')
      setStatusMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again or contact us directly.')
    }
  }

  return open && product ? (
    <div
      className="modal-backdrop fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/68 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="modal-panel max-h-[94svh] w-full overflow-y-auto rounded-t-lg bg-white shadow-2xl sm:max-w-3xl sm:rounded-lg">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
                  <CalendarCheck size={15} aria-hidden="true" />
                  Book Consultation
                </p>
                <h2 id="booking-modal-title" className="mt-2 text-2xl font-semibold text-slate-950">
                  {product.name}
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-700 transition hover:border-cyan-400 hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-100"
                aria-label="Close booking modal"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" error={errors.name?.message}>
                  <input {...register('name')} className="form-field" autoComplete="name" />
                </Field>
                <Field label="Phone Number" error={errors.phone?.message}>
                  <input {...register('phone')} className="form-field" type="tel" autoComplete="tel" />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <input {...register('email')} className="form-field" type="email" autoComplete="email" />
                </Field>
                <Field label="Company Name / Business Name" error={errors.company?.message}>
                  <input {...register('company')} className="form-field" autoComplete="organization" />
                </Field>
                <Field label="Selected Product" error={errors.productName?.message}>
                  <input {...register('productName')} className="form-field bg-slate-100 font-semibold" readOnly />
                  <input {...register('productId')} type="hidden" />
                </Field>
                <Field label="Location / City" error={errors.location?.message}>
                  <input {...register('location')} className="form-field" autoComplete="address-level2" />
                </Field>
                <Field label="Preferred Date" error={errors.preferredDate?.message}>
                  <input {...register('preferredDate')} className="form-field" type="date" min={minDate} />
                </Field>
                <Field label="Preferred Time" error={errors.preferredTime?.message}>
                  <input {...register('preferredTime')} className="form-field" type="time" />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Requirement Type" error={errors.requirementType?.message}>
                  <select {...register('requirementType')} className="form-field">
                    {requirementTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Message / Requirement Details" error={errors.message?.message}>
                  <textarea {...register('message')} className="form-field resize-y" rows={5} />
                </Field>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200 disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Submit Booking Request'}
              </button>

              {status !== 'idle' ? (
                <p
                  className={`status-message mt-4 rounded-lg border px-4 py-3 text-sm leading-6 ${
                    status === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-red-200 bg-red-50 text-red-800'
                  }`}
                  role="status"
                >
                  {statusMessage}
                </p>
              ) : null}
            </form>
      </div>
    </div>
  ) : null
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-2 block text-sm text-red-700">{error}</span> : null}
    </label>
  )
}
