"use client"
import { motion } from "motion/react"
import React, { useState } from 'react'
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

import { supabase } from '@/lib/supabaseClient'
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


export default function Page() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)


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
      <nav className='fixed z-10 flex items-center w-[100%] px-3 bg-[#141414] text-white border-b border-white/10'>
        {/* <div className='flex justify-center w-12 border-r border-white/10'>
          <Image src="/logo2.png" alt="logo" width={30} height={30} />
        </div> */}
        <div className='flex items-center w-full'>
          <Image src="/logo2.png" alt="logo" width={30} height={30} className="relative z-10"/>
          {/* <LuSlash className='ml-2 text-sm text-gray-400' /> */}
          {/* <h1 className='ml-2 text-md flex items-center gap-2'><CiMap size={20} /> Projects</h1> */}
          <div className="absolute top-0 text-center w-full h-full z-0">
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-sm flex items-center"><Link href="/projects" className="text-white/65 flex items-center underline">Projects <HiOutlineSlash  className="mx-2"/></Link> [ idea name ]</p>
            </div>
          </div>
          <div className='ml-auto relative z-10'>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='flex items-center gap-3 hover:cursor-pointer p-2 rounded-lg transition'
            >
              <div className='text-right'>
                <p className='text-sm font-semibold'>Lan Kuhar</p>
                <p className='text-xs text-gray-400'>Administrator</p>
              </div>
              <Avatar alt="Eucharia Odili" src="/profile.jpg" sx={{ width: 30, height: 30 }} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='absolute right-0 mt-2 w-64 bg-[#1a1a1a] rounded-[10px] p-2 shadow-lg z-50'>
                <div className='px-4 py-3'>
                  <p className='text-sm font-semibold'>Eucharia</p>
                  <p className='text-xs text-gray-400'>odilieucharia@gmail.com</p>
                </div>

                <div className='mx-auto w-[90%] h-px bg-white/10 my-2'></div>

                <Link href="" className='w-full my-1 px-4 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm flex items-center transition'>
                  Profile
                </Link>
                <button className='w-full my-1 px-4 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm flex items-center transition'>
                  Account Settings
                </button>
                <div className='mx-auto w-[90%] h-px bg-white/10 my-2'></div>
                <button className='w-full my-1 px-4 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm flex items-center transition'>
                  Plan & Billing
                </button>
                <button className='w-full my-1 px-4 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm flex items-center transition'>
                  Usage / Limits
                </button>
                <div className='mx-auto w-[90%] h-px bg-white/10 my-2'></div>
                <button className='w-full my-1 px-4 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm flex items-center transition'>
                  Notifications
                </button>
                <button className='w-full my-1 px-4 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm flex items-center transition'>
                  Support
                </button>

                <div className='mx-auto w-[90%] h-px bg-white/10 my-2'></div>

                <button onClick={handleLogout} className='w-full my-1 px-4 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm flex items-center transition text-red-400'>
                  Log out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </nav>
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
                <Navigation/>
              </div>
              <div className="w-full xl:w-12/20">
                <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2">
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-bold text-white/90">Idea Overview</h1>
                    <h1 className="text-lg sm:text-xl text-white/65">Marketplace for Freelance Marketers</h1>
                  </div>
                  <span className="text-xs font-light text-white/65 mt-4">Last updated: 16.02.2026</span>
                </div>
                {/* <h1 className="text-xs text-white/65 mt-4">Last updated: 16.02.2026</h1> */}
                <div className="w-full h-[1px] bg-white/20 my-4"></div>

                <div className="space-y-4">
                  <Overview />
                </div>
              </div>
              <div className="w-full xl:w-5/20 xl:pl-10 xl:sticky xl:top-20 self-start">
                <Chat />
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
