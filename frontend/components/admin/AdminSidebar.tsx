"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  BarChart2,
  ScrollText,
  Settings,
  Shield,
} from "lucide-react"

const NAV_ITEMS = [
  { label: "Overview",     href: "/admin",           icon: LayoutDashboard },
  { label: "Users",        href: "/admin/users",      icon: Users           },
  { label: "Ideas",        href: "/admin/ideas",      icon: Lightbulb       },
  { label: "Analytics",    href: "/admin/analytics",  icon: BarChart2       },
  { label: "System Logs",  href: "/admin/logs",       icon: ScrollText      },
  { label: "Settings",     href: "/admin/settings",   icon: Settings        },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-60 shrink-0 bg-[#111111] border-r border-white/5">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5">
        <Shield className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-semibold tracking-wide text-white">
          Verdict Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
