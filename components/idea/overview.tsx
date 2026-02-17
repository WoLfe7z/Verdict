import React from 'react'

// Icons
import { LuDot } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import { IoWarning } from "react-icons/io5";

function overview() {
  const score = 10

  return (
    <div className='space-y-5'>
      {/* Executive Strategic Summary */}
      <div className='w-full border border-white/10 rounded-[5px]'>
        <div className='w-full h-auto px-4 py-2 border-b border-white/10 bg-white/5 rounded-t-[5px] flex items-center justify-between gap-2 text-sm'>
          <h1 className='text-xl text-white/80'>Executive Strategic Summery</h1>
          <BsThreeDots className='text-white/50 hover:text-white cursor-pointer' />
        </div>
        <div className='w-full h-full flex flex-col md:flex-row'>
          <div className='w-full md:w-1/4 h-full md:border-r border-b md:border-b-0 border-white/10 px-4 py-8 flex flex-col items-center justify-center'>
            <p className='text-white/40 text-lg mb-1'>Opportunity Score</p>
            <p className='text-white/40 text-[12px] mb-2'>(0-100)</p>
            <div className='relative'>
              <svg width={150} height={100} viewBox="0 0 200 110">
                {/* Background arc */}
                <path
                  d="M 10 100 A 90 90 0 0 1 190 100"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={14}
                  strokeLinecap="round"
                />
                {/* Filled arc - score% of half circle */}
                <path
                  d={`M 10 100 A 90 90 0 0 1 ${100 + 90 * Math.cos(Math.PI - (score / 100) * Math.PI)} ${100 - 90 * Math.sin(Math.PI - (score / 100) * Math.PI)}`}
                  fill="none"
                  stroke="#eab308"
                  strokeWidth={14}
                  strokeLinecap="round"
                />
              </svg>
              <div className='absolute inset-0 flex items-end justify-center pb-1'>
                <span className='text-3xl font-bold text-white/90'>{score}</span>
              </div>
            </div>

          </div>
          <div className='w-full md:w-3/4 h-full p-6 flex flex-col lg:flex-row gap-10'>
            {/* Left info section */}
            <div className='w-full lg:w-2/3'>
              <div className='flex flex-col sm:flex-row w-full gap-4 sm:gap-10 border-b border-white/10 pb-6'>
                <div>
                  <p className='mb-1'>Strategic status</p>
                  <p className='w-fit px-2 py-1 text-sm bg-yellow-500/20 text-yellow-400 rounded-[5px]'>Validation Recommended</p>
                </div>
                <div>
                  <p className='mb-1'>Current stage</p>
                  <p className='w-fit px-2 py-1 text-sm bg-blue-500/20 text-blue-400 rounded-[5px]'>Pre-validation</p>
                </div>
              </div>
              <div className='flex w-full justify-between gap-10 mt-6'>
                <div>
                  <p className='mb-1'>Overall risk level</p>
                  <p className='w-fit px-2 py-1 text-sm bg-red-500/20 text-red-400 rounded-[5px] flex items-center gap-1'><IoWarning /> Moderate</p>
                </div>
              </div>
            </div>
            {/* Confidence Index donut */}
            <div className='w-full lg:w-1/3 flex flex-col items-center justify-center'>
              <p className='text-white/40 text-sm font-semibold tracking-wider mb-2'>Confidence Index</p>
              <div className='relative'>
                <svg width={150} height={150} viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={10} />
                  <circle
                    cx="60" cy="60" r="48" fill="none"
                    stroke="#22c55e"
                    strokeWidth={10}
                    strokeDasharray={`${(72 / 100) * 2 * Math.PI * 48} ${(1 - 72 / 100) * 2 * Math.PI * 48}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-2xl font-bold text-white/90'>72%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Strategic Interpretation */}
      <div className='w-full border border-white/10 rounded-[5px]'>
        <div className='w-full h-auto px-4 py-2 border-b border-white/10 bg-white/5 rounded-t-[5px] flex items-center justify-between gap-2 text-sm'>
          <h1 className='text-xl text-white/80'>Strategic Interpretation</h1>
          <BsThreeDots className='text-white/50 hover:text-white cursor-pointer' />
        </div>
        <div className='w-full h-full flex'>
          <p className='text-sm p-4 leading-5 text-white/80'>
            {/* IA mora highlight-at pomembne dele v besedilu */}
            The idea shows strong market demand with a moderate problem severity.
            While customer clarity is reasonable, differentiation remains a concern.
            The current pre-validation STAGE is justified, and it is recommended to
            refine positioning before proceeding with further development to
            mitigate competitive risks.
          </p>
        </div>
      </div>

      {/* Core Metric Analysis */}
      <div className='w-full border border-white/10 rounded-[5px]'>
        <div className='w-full h-auto px-4 py-2 border-b border-white/10 bg-white/5 rounded-t-[5px] flex items-center justify-between gap-2 text-sm'>
          <h1 className='text-xl text-white/80'>Core Metric Analysis</h1>
          <BsThreeDots className='text-white/50 hover:text-white cursor-pointer' />
        </div>
        <div className='w-full divide-y divide-white/10'>
          {[
            { score: 8.5, label: 'Market Demand', color: '#22c55e', description: <>High level of <strong>interest and demand</strong> in the market segment.</> },
            { score: 6, label: 'Problem Severity', color: '#eab308', description: <>Moderate <strong>problem</strong> being addressed, not critical.</> },
            { score: 6.5, label: 'Customer Clarity', color: '#3b82f6', description: <>Reasonable understanding of <strong>customer</strong> needs and personas.</> },
            { score: 4.5, label: 'Differentiation', color: '#3b82f6', description: <>Limited unique advantage over existing solutions.</> },
            { score: 7, label: 'Monetization', color: '#eab308', description: <>Clear <strong>monetization</strong> principles but requires validation.</> },
            { score: 7.5, label: 'Scalability', color: '#3b82f6', description: <>Good potential to <strong className='underline'>scale</strong> with targeted investment.</> },
          ].map((metric) => (
            <div key={metric.label} className='flex items-center gap-6 px-6 py-5'>
              <span className='text-3xl font-light text-white/60 w-12 shrink-0'>{metric.score}</span>
              <div className='w-40 shrink-0'>
                <p className='text-sm font-semibold text-white/90 mb-1.5'>{metric.label}</p>
                <div className='w-full h-1.5 bg-white/10 rounded-full'>
                  <div
                    className='h-full rounded-full'
                    style={{ width: `${(metric.score / 10) * 100}%`, backgroundColor: metric.color }}
                  />
                </div>
              </div>
              <p className='text-sm text-white/50'>{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default overview
