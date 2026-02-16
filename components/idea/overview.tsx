import React from 'react'

// Icons
import { LuDot } from "react-icons/lu";

function overview() {
  return (
    <div className='w-full h-full space-y-4 font-primary'>
      <div className='w-full h-full bg-[#252525]/80 rounded-[10px] border-[1px] border-white/30'>
        <div className='w-full h-fit p-4 bg-white/10 rounded-t-[10px] border-b-[1px] border-white/30'>
          <p className='text-sm text-white/50'>Idea Name</p>
          <h1 className='text-2xl text-white'>Marketplace for Freelance Marketers</h1>
          <p className='flex items-center text-sm text-white/50 mt-2'>Last analyzed: Today <LuDot/> Version</p>
        </div>
      </div>
    </div>
  )
}

export default overview
