"use client"

import { use, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Chat from '@/components/idea/chat'
import Overview from '@/components/idea/overview'
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

  return (
    <div className="text-white w-full h-screen overflow-y-auto">
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
  )
}