"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

/**
 * Returns whether the currently signed-in user has role === "admin".
 * Reads from app_metadata (server-trusted) with a fallback to user_metadata.
 * Only used for UI visibility — actual protection is in middleware + layout.
 */
export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const role = user?.app_metadata?.role ?? user?.user_metadata?.role
      setIsAdmin(role === "admin")
    })
  }, [])

  return isAdmin
}
