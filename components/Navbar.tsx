"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth")

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10 && !isAuthPage) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`text-white text-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-black/30 backdrop-blur-md border-b border-white/10" : "bg-transparent"
    }`}>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-4 flex">
        
        {/* Logo */}
        <div className="w-3/12 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo2.png" alt="Verdict" width={35} height={35} />
          </Link>
        </div>

        {/* Hide middle + right on auth pages */}
        {!isAuthPage && (
          <>
            <div className="w-6/12 flex justify-center">
              <div className="hidden sm:flex font-medium items-center gap-10">
                <Link href="/features" className="hover:text-white/60 transition">
                  Features
                </Link>
                <Link href="/how-it-works" className="hover:text-white/60 transition">
                  How it works
                </Link>
                <Link href="/about" className="hover:text-white/60 transition">
                  About
                </Link>
                <Link href="/about" className="hover:text-white/60 transition">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="w-3/12 flex items-center justify-end gap-3">
              <Link 
                href="/auth/login"
                className="hover:text-white/60 px-4 py-2 transition"
              >
                Login
              </Link>

              <Link
                href="/auth/get-started"
                className="px-2 py-1 rounded-[5px] border border-white/50 hover:bg-black/50 bg-black/25 backdrop-blur-sm transition"
              >
                Get started - Free
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
