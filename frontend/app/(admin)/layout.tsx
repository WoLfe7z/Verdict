/**
 * Route-group layout for (admin).
 * This is intentionally a transparent pass-through — the actual admin
 * chrome (sidebar + navbar) lives in app/(admin)/admin/layout.tsx so it
 * only wraps /admin/* pages, not this group wrapper.
 */
export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
