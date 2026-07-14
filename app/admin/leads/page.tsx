import Link from 'next/link'
import type { ReactNode } from 'react'
import { CalendarDays, Mail, MessageSquareText, Phone, Search, UsersRound } from 'lucide-react'
import AdminLeadActions from '../../../components/admin/AdminLeadActions'
import AdminShell from '../../../components/admin/AdminShell'
import SetupRequired from '../../../components/admin/SetupRequired'
import { requireAdmin } from '../../../lib/auth'
import { getAdminLeads, getLeadStats } from '../../../lib/lead-data'

export const dynamic = 'force-dynamic'

type AdminLeadsPageProps = {
  searchParams?: {
    q?: string
    source?: string
    status?: string
  }
}

const sourceLabels: Record<string, string> = {
  CONTACT: 'Contact Form',
  BOOKING: 'Book Consultation',
}

const statusLabels: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  WON: 'Won',
  LOST: 'Lost',
  ARCHIVED: 'Archived',
}

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  await requireAdmin()

  const filters = {
    q: searchParams?.q || '',
    source: searchParams?.source || 'ALL',
    status: searchParams?.status || 'ALL',
  }

  try {
    const [leads, stats] = await Promise.all([getAdminLeads(filters), getLeadStats()])

    return (
      <AdminShell
        title="Leads"
        description="Contact form and book-consultation requests submitted from the website."
        actions={
          <Link
            href="/admin/leads?status=NEW"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <UsersRound size={16} aria-hidden="true" />
            View New Leads
          </Link>
        }
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Leads" value={stats.totalLeads} />
          <StatCard label="New Leads" value={stats.newLeads} />
          <StatCard label="Contact Forms" value={stats.contactLeads} />
          <StatCard label="Consultations" value={stats.bookingLeads} />
        </div>

        <section className="mt-8 rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">Lead Inbox</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Form submissions</h2>
            </div>
            <p className="text-sm font-semibold text-slate-500">{leads.length} shown</p>
          </div>

          <form className="mt-5 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_190px_190px_auto]">
            <label className="relative block">
              <span className="sr-only">Search leads</span>
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                name="q"
                defaultValue={filters.q}
                placeholder="Search name, phone, email, product, city..."
                className="h-11 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
            <label>
              <span className="sr-only">Lead source</span>
              <select
                name="source"
                defaultValue={filters.source}
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              >
                <option value="ALL">All Sources</option>
                <option value="CONTACT">Contact Forms</option>
                <option value="BOOKING">Consultations</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Lead status</span>
              <select
                name="status"
                defaultValue={filters.status}
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              >
                <option value="ALL">All Statuses</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Filter
              </button>
              <Link
                href="/admin/leads"
                className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
              >
                Reset
              </Link>
            </div>
          </form>

          <div className="mt-5 grid gap-4">
            {leads.map((lead) => (
              <article key={lead.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <SourceBadge source={lead.source} />
                      <StatusBadge status={lead.status} />
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-slate-950">{lead.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Submitted {lead.createdAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <AdminLeadActions leadId={lead.id} initialStatus={lead.status} />
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1fr]">
                  <div className="grid gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                    <InfoLink icon={<Phone size={16} aria-hidden="true" />} href={`tel:${lead.phone}`} text={lead.phone} />
                    <InfoLink icon={<Mail size={16} aria-hidden="true" />} href={`mailto:${lead.email}`} text={lead.email} />
                    {lead.company ? <InfoText label="Company" value={lead.company} /> : null}
                    {lead.location ? <InfoText label="Location" value={lead.location} /> : null}
                    {lead.preferredDate || lead.preferredTime ? (
                      <InfoText
                        label="Preferred"
                        value={[lead.preferredDate, lead.preferredTime].filter(Boolean).join(' at ')}
                      />
                    ) : null}
                  </div>

                  <div className="grid gap-3 text-sm text-slate-700">
                    <div className="grid gap-3 rounded-lg border border-slate-200 p-4 sm:grid-cols-2">
                      <InfoText label="Interest" value={lead.interest || lead.productName || 'Not specified'} />
                      <InfoText label="Requirement" value={lead.requirementType || sourceLabels[lead.source]} />
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4">
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
                        <MessageSquareText size={15} aria-hidden="true" />
                        Message
                      </p>
                      <p className="mt-2 whitespace-pre-line leading-6 text-slate-700">{lead.message}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {leads.length === 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-md bg-cyan-50 text-cyan-700">
                <CalendarDays size={24} aria-hidden="true" />
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-950">No leads found</p>
              <p className="mt-2 text-sm text-slate-600">
                Website contact requests and consultation bookings will appear here automatically.
              </p>
            </div>
          ) : null}
        </section>
      </AdminShell>
    )
  } catch (error) {
    return (
      <AdminShell title="Leads" description="Connect the database to enable lead capture and admin follow-up.">
        <SetupRequired message={error instanceof Error ? error.message : undefined} />
      </AdminShell>
    )
  }
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-cyan-900/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function SourceBadge({ source }: { source: string }) {
  const classes =
    source === 'BOOKING'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-cyan-200 bg-cyan-50 text-cyan-800'

  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {sourceLabels[source] || source}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === 'NEW'
      ? 'border-amber-200 bg-amber-50 text-amber-800'
      : status === 'WON'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : status === 'LOST' || status === 'ARCHIVED'
          ? 'border-slate-200 bg-slate-100 text-slate-700'
          : 'border-cyan-200 bg-cyan-50 text-cyan-800'

  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {statusLabels[status] || status}
    </span>
  )
}

function InfoText({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function InfoLink({ icon, href, text }: { icon: ReactNode; href: string; text: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 font-semibold text-slate-900 transition hover:text-cyan-700">
      <span className="text-cyan-700">{icon}</span>
      {text}
    </a>
  )
}
