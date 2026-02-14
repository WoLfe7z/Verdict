"use client"
import { motion } from "motion/react"
import React, { useState } from 'react'
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"


// Icons
import { CiMoneyCheck1 } from "react-icons/ci";
import { CiMap } from "react-icons/ci";
import { IoAnalytics } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { LuSlash } from "react-icons/lu";


function page() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)


  const navItems = [
    {
      label: "Projects",
      href: "/projects",
      icon: <CiMap size={25} />,
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
    icon: <Image src='/icons/settings2.png' alt='Settings Icon' width={20} height={20} />,
  }

  return (
    <>
      <nav className='fixed z-10 flex items-center w-[100%] px-3 bg-[#141414] text-white border-b border-white/10'>
        {/* <div className='flex justify-center w-12 border-r border-white/10'>
          <Image src="/logo2.png" alt="logo" width={30} height={30} />
        </div> */}
        <div className='flex items-center w-full'>
          <Image src="/logo2.png" alt="logo" width={30} height={30} />
          {/* <LuSlash className='ml-2 text-sm text-gray-400' /> */}
          {/* <h1 className='ml-2 text-md flex items-center gap-2'><CiMap size={20} /> Projects</h1> */}
          <div className='ml-auto relative'>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='flex items-center gap-3 hover:cursor-pointer p-2 rounded-lg transition'
            >
              <div className='text-right'>
                <p className='text-sm font-semibold'>Lan Kuhar</p>
                <p className='text-xs text-gray-400'>Administrator</p>
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

                <button className='w-full my-1 px-4 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm flex items-center transition'>
                  Profile
                </button>
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

                <button className='w-full my-1 px-4 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm flex items-center transition text-red-400'>
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
                  className={`w-full flex items-center justify-center rounded-l-[5px] transition ${isActive ? "text-white" : "text-gray-500 hover:text-white"} ${isHovered ? "bg-white/5 text-white" : ""}`}
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
                    className={`h-10 w-full flex rounded-r-[5px] items-center px-3 transition ${isActive ? "text-white" : "text-gray-400 hover:text-white"} ${isHovered ? "bg-white/5 text-white" : ""}`}
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
                    className={`h-10 w-full flex rounded-r-[5px] items-center px-3 transition ${isActive ? "text-white" : "text-gray-400 hover:text-white"} ${isHovered ? "bg-white/5 text-white" : ""}`}
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
            <h1 className="text-xl font-semibold">My Projects</h1>
            <button className="flex items-center border-1 border-white/30 text-xs px-2 py-2 bg-[#7C5CFF] hover:bg-[#7C5CFF]/80 rounded-[5px] text-white font-semibold transition-colors">
              <span className="opacity-50"><FaPlus className="mr-2" /></span>
              <span>New Project</span>
            </button>
          </div>
          <div className="w-full h-[1px] bg-white/10 my-3"></div>
          <div className="w-full h-full">
            <div className="w-full">
              <p className="text-sm text-white/50 mb-4">Projects are containers for your work. You can have multiple projects to organize different applications, experiments, or ideas. Each project can have its own settings, resources, and team members.</p>
              <div className="flex justify-between items-center w-full mb-5">
                <div className="flex w-1/3">
                  <div className="relative w-full">
                    <IoSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input type="text" placeholder={`Search projects...`} className="w-full pl-8 pr-2 py-1 bg-[#252525] border border-white/10 rounded-[5px] text-sm outline-none focus:ring-1 focus:ring-white/30" />
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden w-full h-64 flex items-center justify-center">
              <p className="text-sm text-white/50">You don't have any projects yet. Click "New Project" to create your first one.</p>
            </div>
            <div className="grid grid-cols-3 gap-x-5 gap-y-5 justify-between w-full">
              {/* Map through projects here */}
              <button className="text-start rounded-[10px] border-1 border-white/10 px-4 py-3 w-full h-fit bg-[#252525] hover:cursor-pointer hover:bg-[#252525]/80">
                <h2 className="text-md font-semibold mb-2">Marketplace for online tutors</h2>
                <p className="text-sm text-white/50 mb-4 max-w-[calc(100%-3rem)]">A platform connecting students with expert tutors worldwide.</p>
                <p className="text-xs text-[#7C5CFF] font-semibold bg-[#7C5CFF]/10 w-fit px-2 py-1 rounded-[5px] border border-[#7C5CFF]/20">
                  Active
                </p>
              </button>
              <button className="text-start rounded-[10px] border-1 border-white/10 px-4 py-3 w-full h-fit bg-[#252525] hover:cursor-pointer hover:bg-[#252525]/80">
                <h2 className="text-md font-semibold mb-2">Marketplace for online tutors</h2>
                <p className="text-sm text-white/50 mb-4 max-w-[calc(100%-3rem)]">A platform connecting students with expert tutors worldwide.</p>
                <p className="text-xs text-white/50 font-semibold bg-white/10 w-fit px-2 py-1 rounded-[5px] border border-white/20">
                  Not Active
                </p>
              </button>
              <button className="text-start rounded-[10px] border-1 border-white/10 px-4 py-3 w-full h-fit bg-[#252525] hover:cursor-pointer hover:bg-[#252525]/80">
                <h2 className="text-md font-semibold mb-2">Marketplace for online tutors</h2>
                <p className="text-sm text-white/50 mb-4 max-w-[calc(100%-3rem)]">A platform connecting students with expert tutors worldwide.</p>
                <p className="text-xs text-white/50 font-semibold bg-white/10 w-fit px-2 py-1 rounded-[5px] border border-white/20">
                  Not Active
                </p>
              </button>
              <button className="text-start rounded-[10px] border-1 border-white/10 px-4 py-3 w-full h-fit bg-[#252525] hover:cursor-pointer hover:bg-[#252525]/80">
                <h2 className="text-md font-semibold mb-2">Marketplace for online tutors</h2>
                <p className="text-sm text-white/50 mb-4 max-w-[calc(100%-3rem)]">A platform connecting students with expert tutors worldwide.</p>
                <p className="text-xs text-white/50 font-semibold bg-white/10 w-fit px-2 py-1 rounded-[5px] border border-white/20">
                  Not Active
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
