"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  ideaId: string
}

export default function navigation({ ideaId }: NavigationProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Overview",
      href: `/idea/${ideaId}`,
      icon: "📋"    // Placeholder icons
    },
    {
      label: "Analysis",
      href: `/idea/${ideaId}/analysis`,
      icon: "📊"
    },
    {
      label: "Roadmap",
      href: `/idea/${ideaId}/roadmap`,
      icon: "🗺️"
    },
    {
      label: "Chat",
      href: `/idea/${ideaId}/chat`,
      icon: "💬"
    },
    {
      label: "Edit",
      href: `/idea/${ideaId}/edit`,
      icon: "✏️"
    },
  ]

  return (
    <div className="w-full pr-6">
      <h3 className="text-sm font-semibold text-white/50 mb-3 px-3">Navigation</h3>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? 'bg-[#7C5CFF]/10 text-[#7C5CFF] border border-[#7C5CFF]/20'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>      
    </div>

  )
}