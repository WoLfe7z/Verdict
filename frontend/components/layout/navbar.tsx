"use client"

import { useState } from 'react'
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from '@/lib/supabaseClient'
import Avatar from '@mui/material/Avatar'
import { HiOutlineSlash } from "react-icons/hi2"

interface NavbarProps {
  breadcrumb?: {
    label: string
    href?: string
  }[]
}

export default function Navbar({ breadcrumb }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <nav className='fixed z-10 flex items-center w-full px-3 bg-[#141414] text-white border-b border-white/10'>
      <div className='flex items-center w-full'>
        <Image src="/logo2.png" alt="logo" width={30} height={30} className="relative z-10" />
        
        {/* Breadcrumb */}
        <div className="absolute top-0 text-center w-full h-full z-0">
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-sm flex items-center">
              {breadcrumb ? (
                breadcrumb.map((item, index) => (
                  <span key={index} className="flex items-center">
                    {item.href ? (
                      <Link href={item.href} className="text-white/65 underline">
                        {item.label}
                      </Link>
                    ) : (
                      <span>{item.label}</span>
                    )}
                    {index < breadcrumb.length - 1 && <HiOutlineSlash className="mx-2" />}
                  </span>
                ))
              ) : (
                <span>Projects</span>
              )}
            </p>
          </div>
        </div>
        
        {/* User Dropdown */}
        <div className='ml-auto relative z-10'>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='flex items-center gap-3 hover:cursor-pointer p-2 rounded-lg transition'
          >
            <div className='text-right'>
              <p className='text-sm font-semibold'>Lan Kuhar</p>
              <p className='text-xs text-gray-400'>Administrator</p>
            </div>
            <Avatar alt="Lan Kuhar" src="/profile.jpg" sx={{ width: 30, height: 30 }} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='absolute right-0 mt-2 w-64 bg-[#1a1a1a] rounded-[10px] p-2 shadow-lg z-50'
            >
              <div className='px-4 py-3'>
                <p className='text-sm font-semibold'>Lan Kuhar</p>
                <p className='text-xs text-gray-400'>lan@example.com</p>
              </div>

              <div className='mx-auto w-[90%] h-px bg-white/10 my-2'></div>

              <Link href="/profile" className='w-full my-1 px-4 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm flex items-center transition'>
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

              <button 
                onClick={handleLogout} 
                className='w-full my-1 px-4 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm flex items-center transition text-red-400'
              >
                Log out
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  )
}