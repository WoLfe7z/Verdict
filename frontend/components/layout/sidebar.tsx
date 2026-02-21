"use client"

import { useState } from 'react'
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Icons
import { GoProjectRoadmap } from "react-icons/go"
import { CiMoneyCheck1 } from "react-icons/ci"
import { IoAnalytics } from "react-icons/io5"

export default function Sidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const navItems = [
    {
      label: "Ideas",
      href: "/projects",
      icon: <GoProjectRoadmap size={25} />,
    },
    {
      label: "Billing",
      href: "/billing",
      icon: <CiMoneyCheck1 size={25} />,
    },
    {
      label: "Usage",
      href: "/usage",
      icon: <IoAnalytics size={25} />,
    },
  ]

  const settingsItem = {
    label: "Settings",
    href: "/settings",
    icon: <Image src='/icons/settings.png' alt='Settings Icon' width={20} height={20} />,
  }

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed pt-14 h-screen z-10 flex"
    >
      {/* LEFT SLIM RAIL */}
      <div className="relative w-12 bg-[#141414] flex flex-col items-center pl-2 py-4 gap-2">
        <div className="flex w-full flex-col gap-2">
          {navItems.map((item, idx) => {
            const isActive = pathname.startsWith(item.href)
            const isHovered = hoveredIndex === idx

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center justify-center rounded-l-[5px] transition ${
                  isActive ? "text-white" : "text-white/65 hover:text-white"
                } ${isHovered ? "bg-white/5 text-white" : ""}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="flex pr-2 items-center justify-center w-full h-10 rounded-md">
                  {item.icon}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="mt-auto w-full">
          {(() => {
            const settingsIdx = 999
            const isActive = pathname.startsWith(settingsItem.href)
            const isHovered = hoveredIndex === settingsIdx

            return (
              <Link
                href={settingsItem.href}
                className={`w-full flex items-center justify-center rounded-l-[5px] transition ${
                  isActive ? "text-white" : "text-white/65 hover:text-white"
                } ${isHovered ? "bg-white/5 text-white" : ""}`}
                onMouseEnter={() => setHoveredIndex(settingsIdx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="flex pr-2 items-center justify-center w-full h-10 rounded-md">
                  {settingsItem.icon}
                </span>
              </Link>
            )
          })()}
        </div>
      </div>

      {/* RIGHT EXPAND PANEL */}
      <motion.div
        initial={false}
        animate={{ width: isExpanded ? 100 : 0 }}
        className="overflow-hidden bg-[#141414] flex flex-col py-4 gap-4 border-r border-white/10"
      >
        <div className="w-[100px] pr-2 flex flex-col h-full">
          <nav className="flex flex-col items-start gap-2">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const isHovered = hoveredIndex === idx

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`h-10 w-full flex rounded-r-[5px] items-center px-3 transition ${
                    isActive ? "text-white" : "text-white/65 hover:text-white"
                  } ${isHovered ? "bg-white/5 text-white" : ""}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto">
            {(() => {
              const settingsIdx = 999
              const isActive = pathname.startsWith(settingsItem.href)
              const isHovered = hoveredIndex === settingsIdx

              return (
                <Link
                  href={settingsItem.href}
                  className={`h-10 w-full flex rounded-r-[5px] items-center px-3 transition ${
                    isActive ? "text-white" : "text-white/65 hover:text-white"
                  } ${isHovered ? "bg-white/5 text-white" : ""}`}
                  onMouseEnter={() => setHoveredIndex(settingsIdx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className="text-sm font-semibold">{settingsItem.label}</span>
                </Link>
              )
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  )
}