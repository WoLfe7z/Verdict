"use client"
import { motion } from "motion/react"
import React, { use, useEffect, useState } from 'react'
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

import { supabase } from '@/lib/supabaseClient'
import Navbar from "@/components/layout/navbar"
import Chat from '@/components/idea/chat'
import Overview from '@/components/idea/overview'
import Avatar from '@mui/material/Avatar';

// Icons
import { CiMoneyCheck1 } from "react-icons/ci";
import { CiMap } from "react-icons/ci";
import { IoAnalytics } from "react-icons/io5";

import { RxDashboard } from "react-icons/rx";
import { HiOutlineSlash } from "react-icons/hi2";
import Navigation from "@/components/idea/navigation"

interface IdeaData {
  id: string
  title: string
  description: string
  industry?: string
  target_market?: string
  status: string
  created_at: string
  updated_at: string
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [idea, setIdea] = useState<IdeaData | null>(null)
  const [isLoadingIdea, setIsLoadingIdea] = useState(true)
  const [error, setError] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchIdea()
  }, [id])

  const fetchIdea = async () => {
    try {
      setIsLoadingIdea(true)
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch(`/api/ideas/${id}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch idea')
      }

      const data = await response.json()
      setIdea(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoadingIdea(false)
    }
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <RxDashboard size={25} />,
    },
    {
      label: "Road Map",
      href: "/road-map",
      icon: <CiMap size={25} />,
    },

  ]

  const settingsItem = {
    label: "Settings",
    href: "/settings",
    icon: <Image src='/icons/settings.png' alt='Settings Icon' width={20} height={20} />,
  }

  return (
    <div className="font-primary">
      <Navbar 
        breadcrumb={[
          { label: 'Projects', href: '/projects' },
          { label: idea?.title || 'Loading...' }
        ]}
      />
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
                  className={`w-full flex items-center justify-center rounded-l-[5px] transition ${isActive ? "text-white" : "text-white/65 hover:text-white"} ${isHovered ? "bg-white/5 text-white" : ""}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className="flex pr-2 items-center justify-center w-full h-10 rounded-md">{item.icon}</span>
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
                  className={`w-full flex items-center justify-center rounded-l-[5px] transition ${isActive ? "text-white" : "text-gray-500 hover:text-white"} ${isHovered ? "bg-white/5 text-white" : ""}`}
                  onMouseEnter={() => setHoveredIndex(settingsIdx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className="flex pr-2 items-center justify-center w-full h-10 rounded-md">{settingsItem.icon}</span>
                </Link>
              )
            })()}
          </div>
        </div>

        {/* RIGHT EXPAND PANEL */}
        <motion.div
          initial={false}
          animate={{ width: isExpanded ? 120 : 0 }}
          className="overflow-hidden bg-[#141414] flex flex-col py-4 gap-4 border-r border-white/10"
        >
          <div className="w-[120px] pr-2 flex flex-col h-full">
            <nav className="flex flex-col items-start gap-2">
              {navItems.map((item, idx) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/")
                const isHovered = hoveredIndex === idx

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`h-10 w-full flex rounded-r-[5px] items-center px-3 transition ${isActive ? "text-white" : "text-white/65 hover:text-white"} ${isHovered ? "bg-white/5 text-white" : ""}`}
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
                    className={`h-10 w-full flex rounded-r-[5px] items-center px-3 transition ${isActive ? "text-white" : "text-white/65 hover:text-white"} ${isHovered ? "bg-white/5 text-white" : ""}`}
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
      <div className="fixed z-0 pl-12 pt-14 text-white w-full h-screen bg-cover bg-bottom bg-no-repeat">
        <div className="mx-auto w-full h-full overflow-y-auto">
          <div className="flex flex-col xl:flex-row w-full p-6 sm:p-10 lg:p-10 pb-20 gap-6 xl:gap-0">
              <div className="w-3/20 h-full">
                <Navigation ideaId={id} />
              </div>
              <div className="w-full xl:w-12/20">
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2">
                  {isLoadingIdea ? (
                    <div className="text-white/65">Loading idea...</div>
                  ) : error ? (
                    <div className="text-red-400">Error: {error}</div>
                  ) : idea ? (
                    <>
                      <div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-white/90">Idea Overview</h1>
                        <h1 className="text-lg sm:text-xl text-white/65">{idea.title}</h1>
                      </div>
                      <span className="text-xs font-light text-white/65 mt-4">
                        Last updated: {new Date(idea.updated_at).toLocaleDateString()}
                      </span>
                    </>
                  ) : null}
                </div>
                {/* <h1 className="text-xs text-white/65 mt-4">Last updated: 16.02.2026</h1> */}
                <div className="w-full h-[1px] bg-white/20 my-4"></div>

                <div className="space-y-4">
                  {idea && <Overview idea={idea} />}
                </div>
              </div>
              <div className="w-full xl:w-5/20 xl:pl-10 xl:sticky xl:top-20 self-start">
                <Chat ideaId={id} />
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
