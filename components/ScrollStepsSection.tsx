"use client"

import { useEffect, useRef, useState } from "react"

const steps = [
  {
    title: "Submit Idea",
    description:
      "Describe your startup idea in detail. Define the problem and the target audience.",
  },
  {
    title: "AI Analysis",
    description:
      "Our system evaluates market clarity, pain intensity and feasibility.",
  },
  {
    title: "Get Verdict",
    description:
      "Receive a definitive GO, THINK, or STOP with structured insights.",
  },
]

export default function ScrollStepsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const progress = Math.min(
        Math.max((windowHeight - rect.top) / (rect.height), 0),
        1
      )

      const stepIndex = Math.floor(progress * steps.length)
      setActiveStep(Math.min(stepIndex, steps.length - 1))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] bg-[#0F1115]"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-between px-24">

        {/* LEFT SIDE CONTENT */}
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold mb-6">
            {steps[activeStep].title}
          </h2>

          <p className="text-white/60 text-lg">
            {steps[activeStep].description}
          </p>
        </div>

        {/* RIGHT SIDE VERTICAL LINE */}
        <div className="relative flex">

          {/* Line */}
          <div className="absolute top-0 bottom-0 left-3 w-[2px] bg-white/10" />

          <div className="flex flex-col gap-24">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="relative w-6 h-6 flex items-center justify-center">
                  {index === activeStep ? (
                    <div className="absolute w-6 h-6 rounded-full bg-purple-600 shadow-[0_0_20px_rgba(109,74,255,0.8)]" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-white/20 bg-black" />
                  )}
                </div>

                <div>
                  <p
                    className={`text-sm ${
                      index === activeStep
                        ? "text-purple-500"
                        : "text-white/40"
                    }`}
                  >
                    Step {index + 1}
                  </p>

                  <p
                    className={`text-lg ${
                      index === activeStep
                        ? "text-white"
                        : "text-white/60"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
