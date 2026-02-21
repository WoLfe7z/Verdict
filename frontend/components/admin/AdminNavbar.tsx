"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

interface AdminNavbarProps {
  email: string
}

export default function AdminNavbar({ email }: AdminNavbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 shrink-0 bg-[#111111] border-b border-white/5">
      {/* Left — Admin badge */}
      <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
        Admin
      </span>

      {/* Right — email + logout */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-neutral-400 hidden sm:block">{email}</span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-white/5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </header>
  )
}
