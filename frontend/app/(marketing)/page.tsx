"use client"
import Link from "next/link"
import { useState } from "react"
import { IoMdArrowUp } from "react-icons/io";
import VS from "@/components/VerticalSteps"

export default function Home() {
  const [input, setInput] = useState("")
  const charCount = input.length
  const minChars = 200
  const maxChars = 500
  const progressPercent = (charCount / maxChars) * 100
  const isDisabled = charCount < minChars || charCount > maxChars

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= maxChars) {
      setInput(text)
    }
  }

  const handleSubmit = () => {
    if (!isDisabled) {
      console.log("Submitting idea:", input)
      // TODO: Add API call or action here
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">

      {/* HERO */}
      <section className="bg-[url(/bg.png)] w-full bg-cover bg-bottom bg-no-repeat h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-[1200px]">
          <div className="space-y-[-10px] mb-2">
            <h1 className="text-7xl font-light text-white">
              Clarity Before
            </h1>
            <h2 className="text-9xl font-bold text-white">
              Commitment
            </h2>
          </div>
          <p className="text-gray-300 mb-12">
            Get a clear AI verdict on your startup idea — and a structured path forward.
          </p>

          <div className="h-64 rounded-[10px] border border-white/50 p-4 pb-5 bg-[#0f0f0f]/25 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 backdrop-saturate-100 backdrop-contrast-125 font-primary transition-colors duration-200">
            <textarea
              placeholder="Example: “A marketplace…”"
              value={input}
              onChange={handleInputChange}
              className="w-full h-3/4 bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none"
              rows={4}
            ></textarea>
            <div className="h-1/4 flex justify-end items-end">
              <div className="w-18/20 flex flex-col items-start">
                <span className="text-gray-500 text-sm">{charCount == 0 ? "Min 200" : `${charCount}/500`}</span>
                <div className="w-full h-2 bg-white/20 rounded-full">
                  <div className="h-full bg-primary rounded-full transition-all duration-200" style={{ width: `${progressPercent}%` }}>

                  </div>
                </div>
              </div>
              <div className="w-2/20 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isDisabled}
                  className={`flex justify-center items-center z-10 w-10 h-10 text-white rounded transition-colors pointer-events-auto ${isDisabled
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-primary cursor-pointer hover:bg-[#7C5CFF]/80"
                    }`}
                >
                  <IoMdArrowUp size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <VS />

      {/* PROBLEM */}

      <section className="w-full h-screen bg-black py-40 bg-[url(/bg2.png)] w-full bg-cover bg-center bg-no-repeat">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Headline */}
          <div className="max-w-3xl mb-20">
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Most startup ideas fail before they even start.
            </h2>

            <p className="text-xl text-white/70">
              Not because founders are lazy — but because they build without clarity.
            </p>
          </div>

          {/* Pain Grid */}
          <div className="grid md:grid-cols-3 gap-12">

            <div className="border border-white/10 p-10 rounded-2xl bg-white/[0.02] backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Months of wasted execution
              </h3>
              <p className="text-white/70 leading-relaxed">
                Founders invest time, energy, and money — only to discover the idea
                never had real market demand.
              </p>
            </div>

            <div className="border border-white/10 p-10 rounded-2xl bg-white/[0.02] backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Biased feedback
              </h3>
              <p className="text-white/70 leading-relaxed">
                Friends encourage. Online communities speculate. No one gives a
                structured, objective verdict.
              </p>
            </div>

            <div className="border border-white/10 p-10 rounded-2xl bg-white/[0.02] backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-white mb-4">
                AI without judgment
              </h3>
              <p className="text-white/70 leading-relaxed">
                Most AI tools generate ideas endlessly — but they don’t tell you
                whether you should actually pursue them.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}

      {/* FOOTER */}
      <section className="flex-col gap-20 w-full pt-20 flex bg-black">
        <div className="relative max-w-[1200px] h-auto mx-auto px-6">
          <div className="flex justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-white text-lg">verdict@help.com</span>
            </Link>

            <div className="flex items-center gap-6 text-white">
              <Link href="/features" className="hover:text-white/70 text-sm transition-colors duration-200">Features</Link>
              <Link href="/contact" className="hover:text-white/70 text-sm transition-colors duration-200">How it works</Link>
              <Link href="/about" className="hover:text-white/70 text-sm transition-colors duration-200">About</Link>
            </div>
          </div>
          <h2 className="font-headers text-white font-bold text-[20rem]">Verdict</h2>
          <div className="pb-5">
            <p className="text-white text-sm">
              &copy; 2026 Verdict. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
