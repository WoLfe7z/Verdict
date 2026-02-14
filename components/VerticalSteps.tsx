"use client"

import { useEffect, useRef, useState } from "react"
import { TextAnimate } from "@/components/ui/text-animate"

const steps = [
    {
        title: "Objective startup decisions.",
        description:
            "Receive a structured evaluation with a definitive GO, THINK, or STOP — not vague feedback.",
    },
    {
        title: "Your idea — stress-tested.",
        description:
            "We evaluate problem intensity, market clarity and execution feasibility.",
    },
    {
        title: "A defined next move.",
        description:
            "Move forward with a clear next step based on your current stage.",
    },
]

export default function FeaturesSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const [activeStep, setActiveStep] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return

            const rect = sectionRef.current.getBoundingClientRect()
            const windowHeight = window.innerHeight

            const progress = Math.min(
                Math.max((windowHeight - rect.top) / rect.height, 0),
                1
            )

            let stepIndex = 0

            if (progress < 0.45) {
                stepIndex = 0
            } else if (progress < 0.75) {
                stepIndex = 1
            } else {
                stepIndex = 2
            }

            setActiveStep(stepIndex)

        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-[400vh] bg-black"
        >

            {/* Sticky container */}
            <div className="sticky top-0 h-screen flex items-center">

                <div className="max-w-[1200px] mx-auto w-full flex">

                    {/* LEFT SIDE */}
                    <div className="w-1/2 flex flex-col justify-center pr-20 transition-all duration-500">
                        <TextAnimate className="text-6xl font-bold text-white mb-6">
                            {steps[activeStep].title}
                        </TextAnimate>

                        <TextAnimate className="text-lg text-gray-300 max-w-lg">
                            {steps[activeStep].description}
                        </TextAnimate>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="w-1/2 flex items-center justify-center">

                        <div className="relative flex gap-16">

                            {/* Vertical Line */}
                            <div className="relative flex flex-col items-center">

                                <div className="absolute top-0 bottom-0 w-[2px] bg-[linear-gradient(0deg,_#ffffff00_0%,_#ffffff4D_10%,_#ffffff4D_50%,_#ffffff4D_90%,_#ffffff00_100%)]" />

                                <div className="flex flex-col gap-50 my-auto py-30">
                                    {steps.map((_, index) => (
                                        <div key={index} className="relative flex items-center justify-center w-10 h-10">

                                            {index === activeStep ? (
                                                <>
                                                    <div className="absolute w-10 h-10 rounded-full bg-purple-600 shadow-[0_0_30px_rgba(109,74,255,0.8)] transition-all duration-500" />
                                                    <div className="w-5 h-5 rounded-full bg-white z-10" />
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-black transition-all duration-500" />
                                                    <div className="absolute w-5 h-5 rounded-full bg-white/10" />
                                                </>
                                            )}

                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* STEP LABELS */}
                            <div className="flex flex-col gap-45 my-auto">
                                {steps.map((step, index) => (
                                    <div key={index}>
                                        <TextAnimate
                                            className={`text-base font-semibold mb-2 transition-all duration-500 ${index === activeStep
                                                    ? "text-purple-500"
                                                    : "text-white/40"
                                                }`}
                                        >
                                            {`Step ${index + 1}`}
                                        </TextAnimate>

                                        <TextAnimate
                                            className={`text-4xl font-bold transition-all duration-500 ${index === activeStep
                                                    ? "text-white"
                                                    : "text-white/70"
                                                }`}
                                        >
                                            {step.title}
                                        </TextAnimate>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
