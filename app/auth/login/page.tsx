"use client"

import { useState } from "react"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { FaApple } from "react-icons/fa"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // TODO: Add login API call
      console.log("Login attempt:", { email, password })
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // TODO: Add OAuth implementation
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-cards border border-white/10 rounded-lg p-5">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-cards border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-cards border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex my-6 w-full">
          <div className="w-6/10 inset-0 flex items-center">
            <div className="w-full h-[1px] bg-white/10"></div>
          </div>
          <div className="w-2/10 flex justify-center text-sm">
            <span className="w-full px-2 text-center text-gray-400">Or</span>
          </div>
          <div className="w-6/10 inset-0 flex items-center">
            <div className="w-full h-[1px] bg-white/10"></div>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuthLogin("Google")}
            className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </button>

          <button
            onClick={() => handleOAuthLogin("Apple")}
            className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <FaApple size={20} />
            Sign in with Apple
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <Link href="/auth/get-started" className="text-primary hover:text-primary/80 font-semibold transition-colors">
            Get Started
          </Link>
        </p>
      </div>
    </div>
  )
}
