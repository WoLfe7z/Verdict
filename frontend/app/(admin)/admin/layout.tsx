import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { createSupabaseServerClient } from "@/lib/supabaseServer"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminNavbar from "@/components/admin/AdminNavbar"

export const metadata: Metadata = {
  title: "Admin Panel | Verdict",
}

/**
 * Admin layout — server component.
 *
 * Guards:
 *  1. Unauthenticated → /auth/login
 *  2. Authenticated but not admin → /projects
 *
 * Role is read from app_metadata.role (set server-side / via Supabase
 * service-role key) with a fallback to user_metadata.role for dev use.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Guard 1 — must be signed in
  if (!user) {
    redirect("/auth/login")
  }

  // Guard 2 — must have admin role
  // app_metadata is only writable by the service-role key (server-trusted).
  // user_metadata is user-writable; only use as a dev fallback.
  const role: string | undefined =
    user.app_metadata?.role ?? user.user_metadata?.role

  if (role !== "admin") {
    redirect("/projects")
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminNavbar email={user.email!} />

        <main className="flex-1 overflow-y-auto p-6 bg-[#0f0f0f]">
          {children}
        </main>
      </div>
    </div>
  )
}
