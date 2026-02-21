import { createSupabaseServerClient } from "@/lib/supabaseServer"

/**
 * /admin — Overview page (server component).
 * Fetches basic counts from Supabase to populate the stats grid.
 * Adjust table names to match your schema.
 */
export default async function AdminOverviewPage() {
  const supabase = await createSupabaseServerClient()

  // Fetch counts in parallel — swap table names to match your schema
  const [{ count: userCount }, { count: ideaCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("ideas").select("*",    { count: "exact", head: true }),
  ])

  const stats = [
    { label: "Total Users",    value: userCount  ?? "–" },
    { label: "Total Ideas",    value: ideaCount  ?? "–" },
    { label: "Active Today",   value: "–"               },
    { label: "System Status",  value: "Healthy"          },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Verdict admin — at-a-glance metrics
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-white/5 bg-white/[0.03] p-5 space-y-1"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              {label}
            </p>
            <p className="text-2xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-medium text-white">Recent Users</h2>
          <p className="text-sm text-neutral-500">No data available yet.</p>
        </div>

        <div className="rounded-lg border border-white/5 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-medium text-white">Recent Ideas</h2>
          <p className="text-sm text-neutral-500">No data available yet.</p>
        </div>
      </div>
    </div>
  )
}
