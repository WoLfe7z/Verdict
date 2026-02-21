"use client"
import { motion } from "motion/react"
import React, { useState } from 'react'
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"


// Icons
import { CiMoneyCheck1 } from "react-icons/ci";
// import { CiMap } from "react-icons/ci";
// import { SiSemaphoreci } from "react-icons/si";
import { GoProjectRoadmap } from "react-icons/go";
import { IoAnalytics } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { LuSlash } from "react-icons/lu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Shield } from "lucide-react";
import Input from "@/components/input";
import { useIsAdmin } from "@/hooks/useIsAdmin";


export default function Page() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const isAdmin = useIsAdmin()

  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }
  const [isCardMenuOpen, setIsCardMenuOpen] = useState(false)
  const [isNewIdeaOpen, setIsNewIdeaOpen] = useState(false)
  const [ideaText, setIdeaText] = useState("")
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
    <div className="font-primary">
      <nav className='fixed z-10 flex items-center w-full px-3 bg-[#141414] text-white border-b border-white/10'>
        {/* <div className='flex justify-center w-12 border-r border-white/10'>
          <Image src="/logo2.png" alt="logo" width={30} height={30} />
        </div> */}
        <div className='flex items-center w-full'>
          <Image src="/logo2.png" alt="logo" width={30} height={30} />
          {/* <LuSlash className='ml-2 text-sm text-gray-400' /> */}
          {/* <h1 className='ml-2 text-md flex items-center gap-2'><CiMap size={20} /> Projects</h1> */}
          <div className="absolute top-0 text-center w-full h-full z-0 pointer-events-none">
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-sm flex items-center">Projects</p>
            </div>
          </div>
          <div className='ml-auto flex items-center gap-2'>
            {isAdmin && (
              <Link
                href="/admin"
                className='flex items-center gap-1.5 text-xs font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 px-2.5 py-1.5 rounded-md transition'
              >
                <Shield className='w-3 h-3' />
                Admin
              </Link>
            )}
            <div className='relative'>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='flex items-center gap-3 hover:cursor-pointer p-2 rounded-lg transition'
            >
              <div className='text-right'>
                <p className='text-sm font-semibold'>Lan Kuhar</p>
                <p className='text-xs text-gray-400'>{isAdmin ? "Administrator" : "Welcome"}</p>
              </div>
              <div className='flex justify-center items-center bg-white w-10 h-10 rounded-full overflow-hidden'>
                <Image
                  src="/profile.jpg"
                  alt="profile"
                  width={35}
                  height={35}
                  className='w-full h-full rounded-full'
                />
              </div>
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
        </div>
      </nav>
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="fixed pt-14 h-screen z-0 flex"
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
                  className={`w-full flex items-center justify-center rounded-l-[5px] transition ${isActive ? "text-white" : "text-white/65 hover:text-white"} ${isHovered ? "bg-white/5 text-white" : ""}`}
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
          animate={{ width: isExpanded ? 100 : 0 }}
          className="overflow-hidden bg-[#141414] flex flex-col py-4 gap-4 border-r border-white/10"
        >
          <div className="w-[100px] pr-2 flex flex-col h-full">
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
      <div className="ml-16 pt-14 text-white">
        <div className="mx-auto max-w-[1200px] py-20">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">My Projects Ideas</h1>
            <button onClick={() => setIsNewIdeaOpen(true)} className="flex items-center border-1 border-white/30 text-xs px-2 py-2 bg-[#7C5CFF] hover:bg-[#7C5CFF]/80 rounded-[5px] text-white font-semibold transition-colors">
              <span className="opacity-50"><FaPlus className="mr-2" /></span>
              <span>New Idea</span>
            </button>
          </div>
          <div className="w-full h-[1px] bg-white/10 my-3"></div>
          <div className="w-full h-full">
            <div className="w-full">
              <p className="text-sm text-white/65 mb-4">Projects are containers for your work. You can have multiple projects to organize different applications, experiments, or ideas. Each project can have its own settings, resources, and team members.</p>
              <div className="flex justify-between items-center w-full mb-5">
                <div className="flex w-1/3">
                  <div className="relative w-full">
                    <IoSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                    <Input type="text" placeholder="Search ideas..." className="pl-8 pr-2 py-1" />
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden w-full h-64 items-center justify-center">
              <p className="text-sm text-white/65">{"You don't have any projects yet. Click 'New Project' to create your first one."}</p>
            </div>
            <div className="grid grid-cols-3 gap-x-5 gap-y-5 justify-between w-full">
              {/* Map through projects here */}
              <Link href="/idea" className="relative z-0 text-start rounded-[10px] border-1 border-white/10 px-4 py-3 w-full h-fit bg-[#252525] hover:cursor-pointer hover:bg-[#252525]/80">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-md font-semibold">Marketplace for online tutors </h2>
                  <div className="relative z-10">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsCardMenuOpen(!isCardMenuOpen); }} className="p-2 hover:bg-white/10 rounded-[5px]"><HiOutlineDotsVertical /></button>
                    {isCardMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute left-0 mt-1 w-40 bg-[#1a1a1a] rounded-[10px] p-2 shadow-lg z-50 border border-white/10"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      >
                        <button className="w-full px-3 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm transition">
                          Edit
                        </button>
                        <button className="w-full px-3 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm transition">
                          Duplicate
                        </button>
                        <div className="mx-auto w-[90%] h-px bg-white/10 my-1"></div>
                        <button className="w-full px-3 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm transition text-red-400">
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-white/65 mb-4 max-w-[calc(100%-3rem)]">A platform connecting students with expert tutors worldwide.</p>
                <p className="text-xs text-[#7C5CFF] font-semibold bg-[#7C5CFF]/10 w-fit px-2 py-1 rounded-[5px] border border-[#7C5CFF]/20">
                  Active
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* New Idea Modal */}
      {isNewIdeaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-white">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsNewIdeaOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-[10px] p-6"
          >
            <h2 className="text-lg font-semibold mb-4">New Idea</h2>
            <form onSubmit={(e) => { e.preventDefault(); setIsNewIdeaOpen(false); }}>
              <div className="mb-4">
                <label className="block text-sm text-white/70 mb-1">Name</label>
                <Input
                  type="text"
                  placeholder="Enter idea name..."
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-white/70 mb-1">Enter your idea</label>
                <div className="relative bg-[#252525] border border-white/10 rounded-[5px] focus-within:ring-1 focus-within:ring-white/30">
                  <textarea
                    value={ideaText}
                    onChange={(e) => { if (e.target.value.length <= 500) setIdeaText(e.target.value) }}
                    placeholder={'Example: "A marketplace…"'}
                    rows={6}
                    className="w-full px-3 py-2 bg-transparent text-sm outline-none resize-none"
                  />
                  <div className="flex items-center justify-between px-3 py-2 border-t border-white/10">
                    <p className="text-xs text-white/50">{ideaText.length >= 200 ? "Max 500" : "Min 200"}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-60 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white/30 rounded-full transition-all"
                          style={{ width: `${ideaText.length >= 200 ? Math.min(((ideaText.length - 200) / 300) * 100, 100) : (ideaText.length / 200) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewIdeaOpen(false)}
                  className="px-4 py-2 text-sm rounded-[5px] hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ideaText.length < 200}
                  className="px-4 py-2 text-sm bg-[#7C5CFF] rounded-[5px] font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-[#7C5CFF]/80"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
