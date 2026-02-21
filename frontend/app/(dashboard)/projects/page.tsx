"use client"

import { motion } from "motion/react"
import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

// Icons
import { CiMoneyCheck1 } from "react-icons/ci"
import { GoProjectRoadmap } from "react-icons/go"
import { IoAnalytics } from "react-icons/io5"
import { FaPlus } from "react-icons/fa6"
import { IoSearch } from "react-icons/io5"
import { HiOutlineDotsVertical } from "react-icons/hi"
import Input from "@/components/input"

interface Idea {
  id: string
  title: string
  description: string
  status: string
  created_at: string
}

export default function Page() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  const pathname = usePathname()
  const router = useRouter()

  const [isCardMenuOpen, setIsCardMenuOpen] = useState<string | null>(null)
  const [isNewIdeaOpen, setIsNewIdeaOpen] = useState(false)
  const [ideaTitle, setIdeaTitle] = useState("")
  const [ideaText, setIdeaText] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Fetch ideas on mount
  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/api/ideas', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setIdeas(data)
      }
    } catch (error) {
      console.error('Failed to fetch ideas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          title: ideaTitle,
          description: ideaText,
          industry: 'General',
          target_market: 'General'
        })
      })

      if (response.ok) {
        setIsNewIdeaOpen(false)
        setIdeaTitle("")
        setIdeaText("")
        fetchIdeas() // Refresh list
      }
    } catch (error) {
      console.error('Failed to create idea:', error)
    }
  }

  const handleDeleteIdea = async (ideaId: string) => {
    if (!confirm('Are you sure you want to delete this idea?')) return

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      if (response.ok) {
        fetchIdeas() // Refresh list
      }
    } catch (error) {
      console.error('Failed to delete idea:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  // Filter ideas by search query
  const filteredIdeas = ideas.filter(idea =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="fixed pt-14 h-screen z-0 flex"
      >
        {/* ... sidebar code ... */}
      </div>

      <div className="ml-16 pt-14 text-white">
        <div className="mx-auto max-w-[1200px] py-20">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">My Project Ideas</h1>
            <button 
              onClick={() => setIsNewIdeaOpen(true)} 
              className="flex items-center border-1 border-white/30 text-xs px-2 py-2 bg-[#7C5CFF] hover:bg-[#7C5CFF]/80 rounded-[5px] text-white font-semibold transition-colors"
            >
              <span className="opacity-50"><FaPlus className="mr-2" /></span>
              <span>New Idea</span>
            </button>
          </div>
          <div className="w-full h-[1px] bg-white/10 my-3"></div>
          
          <div className="w-full h-full">
            <div className="w-full">
              <p className="text-sm text-white/65 mb-4">
                Projects are containers for your work. You can have multiple projects to organize different applications, experiments, or ideas.
              </p>
              <div className="flex justify-between items-center w-full mb-5">
                <div className="flex w-1/3">
                  <div className="relative w-full">
                    <IoSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                    <Input 
                      type="text" 
                      placeholder="Search ideas..." 
                      className="pl-8 pr-2 py-1"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="w-full h-64 flex items-center justify-center">
                <p className="text-sm text-white/65">Loading ideas...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredIdeas.length === 0 && (
              <div className="w-full h-64 flex items-center justify-center">
                <p className="text-sm text-white/65">
                  {searchQuery 
                    ? "No ideas found matching your search."
                    : "You don't have any projects yet. Click 'New Idea' to create your first one."}
                </p>
              </div>
            )}

            {/* Ideas Grid */}
            {!isLoading && filteredIdeas.length > 0 && (
              <div className="grid grid-cols-3 gap-x-5 gap-y-5 justify-between w-full">
                {filteredIdeas.map((idea) => (
                  <Link 
                    key={idea.id}
                    href={`/idea/${idea.id}`} 
                    className="relative z-0 text-start rounded-[10px] border-1 border-white/10 px-4 py-3 w-full h-fit bg-[#252525] hover:cursor-pointer hover:bg-[#252525]/80"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-md font-semibold">{idea.title}</h2>
                      <div className="relative z-10">
                        <button 
                          onClick={(e) => { 
                            e.preventDefault()
                            e.stopPropagation()
                            setIsCardMenuOpen(isCardMenuOpen === idea.id ? null : idea.id)
                          }} 
                          className="p-2 hover:bg-white/10 rounded-[5px]"
                        >
                          <HiOutlineDotsVertical />
                        </button>
                        {isCardMenuOpen === idea.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute left-0 mt-1 w-40 bg-[#1a1a1a] rounded-[10px] p-2 shadow-lg z-50 border border-white/10"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                          >
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              router.push(`/idea/edit/${idea.id}`)
                            }}
                            className="w-full px-3 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm transition"
                          >
                            Edit
                          </button>
                            <button className="w-full px-3 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm transition">
                              Duplicate
                            </button>
                            <div className="mx-auto w-[90%] h-px bg-white/10 my-1"></div>
                            <button 
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDeleteIdea(idea.id)
                              }}
                              className="w-full px-3 py-2 rounded-[5px] hover:bg-white/5 text-left text-sm transition text-red-400"
                            >
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-white/65 mb-4 max-w-[calc(100%-3rem)] line-clamp-2">
                      {idea.description}
                    </p>
                    <p className={`text-xs font-semibold w-fit px-2 py-1 rounded-[5px] border ${
                      idea.status === 'completed' 
                        ? 'text-green-400 bg-green-400/10 border-green-400/20'
                        : idea.status === 'analyzing'
                        ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                        : 'text-[#7C5CFF] bg-[#7C5CFF]/10 border-[#7C5CFF]/20'
                    }`}>
                      {idea.status === 'completed' ? 'Analyzed' : idea.status === 'analyzing' ? 'Analyzing...' : 'Draft'}
                    </p>
                  </Link>
                ))}
              </div>
            )}
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
            <form onSubmit={handleCreateIdea}>
              <div className="mb-4">
                <label className="block text-sm text-white/70 mb-1">Name</label>
                <Input
                  type="text"
                  placeholder="Enter idea name..."
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-white/70 mb-1">Enter your idea</label>
                <div className="relative bg-[#252525] border border-white/10 rounded-[5px] focus-within:ring-1 focus-within:ring-white/30">
                  <textarea
                    value={ideaText}
                    onChange={(e) => { if (e.target.value.length <= 500) setIdeaText(e.target.value) }}
                    placeholder={'Example: "A marketplace for freelance marketers..."'}
                    rows={6}
                    className="w-full px-3 py-2 bg-transparent text-sm outline-none resize-none"
                    required
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
                  disabled={ideaText.length < 200 || !ideaTitle.trim()}
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