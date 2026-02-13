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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-bg/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
    }`}>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-4 flex">
        
        {/* Logo */}
        <div className="w-3/12 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo2.png" alt="Verdict" width={45} height={45} />
          </Link>
        </div>

        {/* Hide middle + right on auth pages */}
        {!isAuthPage && (
          <>
            <div className="w-6/12 flex justify-center">
              <div className="hidden sm:flex font-medium items-center gap-10">
                <Link href="/features" className="hover:text-white/60 text-md transition">
                  Features
                </Link>
                <Link href="/how-it-works" className="hover:text-white/60 text-md transition">
                  How it works
                </Link>
                <Link href="/about" className="hover:text-white/60 text-md transition">
                  About
                </Link>
                <Link href="/about" className="hover:text-white/60 text-md transition">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="w-3/12 flex items-center justify-end gap-3">
              <Link 
                href="/auth/login"
                className="hover:text-white/60 text-md px-4 py-2 transition"
              >
                Login
              </Link>

              <Link
                href="/auth/get-started"
                className="px-5 py-2 rounded border text-md border-white/50 hover:bg-primary bg-white/25 backdrop-blur-sm transition"
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
