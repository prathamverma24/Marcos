export default function SetupRequired({ message }: { message?: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <p className="text-sm font-semibold uppercase tracking-[0.14em]">Database setup required</p>
      <h2 className="mt-2 text-2xl font-semibold text-amber-950">Connect PostgreSQL to enable the Admin CMS</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6">
        {message ||
          'Add DATABASE_URL, or SUPABASE_PROJECT_REF plus SUPABASE_DB_PASSWORD, then run Prisma setup and reload the admin dashboard.'}
      </p>
      <pre className="mt-5 overflow-x-auto rounded-lg bg-white p-4 text-sm text-slate-800">
        <code>
          {
            'DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public\n# or\nSUPABASE_PROJECT_REF=your-project-ref\nSUPABASE_DB_PASSWORD=your-database-password\n\nnpx prisma generate\nnpx prisma db push'
          }
        </code>
      </pre>
    </div>
  )
}
