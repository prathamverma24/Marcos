import AdminReviewActions from '../../../components/admin/AdminReviewActions'
import AdminShell from '../../../components/admin/AdminShell'
import SetupRequired from '../../../components/admin/SetupRequired'
import { getAdminReviews } from '../../../lib/review-data'
import { requireAdmin } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  await requireAdmin()

  try {
    const reviews = await getAdminReviews()

    return (
      <AdminShell
        title="Manage Reviews"
        description="Review customer feedback and delete entries that should not appear on the public site."
      >
        <section className="overflow-hidden rounded-lg border border-cyan-900/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-4 py-3">Reviewer</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Review</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="border-b border-slate-100 align-top">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">{review.name}</p>
                      {review.location ? <p className="mt-1 text-xs text-slate-500">{review.location}</p> : null}
                    </td>
                    <td className="px-4 py-4 font-semibold text-amber-600">{review.rating}/5</td>
                    <td className="px-4 py-4 text-slate-700">
                      <p className="max-w-xl leading-6">{review.message}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{review.createdAt.toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-4">
                      <AdminReviewActions reviewId={review.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reviews.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-lg font-semibold text-slate-950">No reviews yet</p>
              <p className="mt-2 text-sm text-slate-600">Customer reviews submitted from the homepage will appear here.</p>
            </div>
          ) : null}
        </section>
      </AdminShell>
    )
  } catch (error) {
    return (
      <AdminShell title="Manage Reviews" description="Connect the database to enable review moderation.">
        <SetupRequired message={error instanceof Error ? error.message : undefined} />
      </AdminShell>
    )
  }
}
