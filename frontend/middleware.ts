import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Create a mutable response so Supabase can refresh session cookies.
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  // Always use getUser() — never getSession() — so the JWT is validated
  // server-side and cannot be spoofed by a tampered cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ─── Route classification ────────────────────────────────────────────────
  const isAdminRoute     = pathname.startsWith("/admin")
  const isDashboardRoute = pathname.startsWith("/projects") || pathname.startsWith("/idea")
  const isAuthRoute      = pathname.startsWith("/auth")

  // ─── Admin routes ────────────────────────────────────────────────────────
  // Guard 1: must be authenticated.
  // Guard 2: must have role === "admin".
  //
  // Role source priority:
  //   app_metadata.role  — written by service-role key only (server-trusted).
  //   user_metadata.role — user-writable; acceptable for local dev only.
  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    const role: string | undefined =
      user.app_metadata?.role ?? user.user_metadata?.role

    if (role !== "admin") {
      // Non-admin authenticated user — send to dashboard, not a 403 page.
      return NextResponse.redirect(new URL("/projects", request.url))
    }

    return response
  }

  // ─── Dashboard routes ────────────────────────────────────────────────────
  if (!user && isDashboardRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // ─── Auth routes ─────────────────────────────────────────────────────────
  // Redirect already-signed-in users away from login / register pages.
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/projects", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/projects/:path*",
    "/idea/:path*",
    "/auth/:path*",
    // Match /admin exactly and all nested /admin/* paths
    "/admin",
    "/admin/:path*",
  ],
}
