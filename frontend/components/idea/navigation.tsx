"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

const SECTIONS = [
  {
    group: "ASSESSMENT",
    items: [
      { id: "executive-summary",        label: "Executive Summary" },
      { id: "strategic-interpretation", label: "Strategic Interpretation" },
    ],
  },
  {
    group: "EVIDENCE",
    items: [
      { id: "core-metrics",   label: "Core Metric Analysis" },
      { id: "risk-analysis",  label: "Risk & Constraints" },
    ],
  },
  {
    group: "DECISION",
    items: [
      { id: "recommendation", label: "Primary Recommendation" },
    ],
  },
  {
    group: "EXECUTION",
    items: [
      { id: "action-roadmap", label: "Action Roadmap" },
    ],
  },
  {
    group: "ADVISORY",
    items: [
      { id: "strategic-advisor", label: "Strategic Advisor" },
    ],
  },
]

const ALL_IDS = SECTIONS.flatMap(s => s.items.map(i => i.id))

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState<string>(ALL_IDS[0])

  // Traverse DOM upward to find the nearest scrollable ancestor
  const getScrollContainer = useCallback((): HTMLElement | null => {
    let el = navRef.current?.parentElement
    while (el) {
      const { overflowY } = window.getComputedStyle(el)
      if (overflowY === 'auto' || overflowY === 'scroll') return el
      el = el.parentElement
    }
    return null
  }, [])

  const handleScroll = useCallback(() => {
    const container = getScrollContainer()
    if (!container) return

    // Threshold: 160px from the top of the scroll container's visible area
    const threshold = container.getBoundingClientRect().top + 160

    for (let i = ALL_IDS.length - 1; i >= 0; i--) {
      const el = document.getElementById(ALL_IDS[i])
      if (el && el.getBoundingClientRect().top <= threshold) {
        setActiveId(ALL_IDS[i])
        return
      }
    }

    setActiveId(ALL_IDS[0])
  }, [getScrollContainer])

  useEffect(() => {
    const container = getScrollContainer()
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [getScrollContainer, handleScroll])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    const container = getScrollContainer()

    if (el && container) {
      const topOffset =
        el.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        80 // clearance below the fixed top nav

      container.scrollTo({ top: topOffset, behavior: 'smooth' })
    }

    setActiveId(id)
  }, [getScrollContainer])

  // Progress: fraction of sections "passed" (0 → 1)
  const activeIndex    = ALL_IDS.indexOf(activeId)
  const progressRatio  = ALL_IDS.length > 1 ? activeIndex / (ALL_IDS.length - 1) : 0

  return (
    <nav ref={navRef} className="sticky top-20 self-start pr-6 py-1">
      <div className="flex gap-3">

        {/* Progress spine */}
        <div className="relative flex-shrink-0 w-[2px] rounded-full bg-white/[0.07]">
          <div
            className="absolute top-0 left-0 right-0 rounded-full bg-[#7C5CFF]/30 transition-all duration-500 ease-out"
            style={{ height: `${progressRatio * 100}%` }}
          />
        </div>

        {/* Section groups */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          {SECTIONS.map((section) => (
            <div key={section.group}>
              <p className="text-[9px] font-semibold tracking-[0.16em] text-white/25 uppercase mb-[10px] pl-3 select-none">
                {section.group}
              </p>

              <div className="flex flex-col">
                {section.items.map((item) => {
                  const isActive = activeId === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={[
                        'text-left text-[13px] leading-snug',
                        'py-[7px] pl-3 pr-2',
                        'border-l-2 rounded-r-[2px]',
                        'transition-all duration-150 cursor-pointer',
                        isActive
                          ? 'border-[#7C5CFF] text-white bg-white/[0.04]'
                          : 'border-transparent text-white/35 hover:text-white/65 hover:bg-white/[0.025]',
                      ].join(' ')}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
