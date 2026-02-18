import React, { useRef, useCallback } from 'react'

// Icons
import { BsThreeDots } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import {
  LuTarget, LuDollarSign, LuShield, LuTrendingUp, LuUsers, LuSearch
} from "react-icons/lu";

function Chat() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // TODO: handle send query
    }
  };

  return (
    <div className='w-full max-w-[450px] h-[600px] rounded-[5px] border border-white/8 bg-white/2 font-primary flex flex-col'>
      {/* Header */}
      <div className='w-full px-4 py-3 border-b border-white/8 bg-white/3 rounded-t-[5px] flex items-center justify-between'>
        <div className='flex items-center gap-2.5'>
          <h1 className='text-sm font-medium text-white/70 tracking-wide'>Strategic Advisor</h1>
          <span className='text-[9px] text-white/20 uppercase tracking-widest font-medium'>Context-Aware</span>
        </div>
        <BsThreeDots className='text-white/30 hover:text-white/50 cursor-pointer transition-colors' />
      </div>

      {/* Conversation Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-white/10
        [&::-webkit-scrollbar-thumb]:rounded-full'>

        {/* System — Initial Advisory Prompt */}
        <div className='space-y-3'>
          {/* System message */}
          <div className='border-l-2 border-white/8 pl-3'>
            <p className='text-[10px] text-white/20 uppercase tracking-widest font-medium mb-1.5'>Advisory System</p>
            <p className='text-sm text-white/50 leading-relaxed'>
              Strategic analysis loaded. Select a query below or describe a specific area to investigate.
            </p>
          </div>

          {/* Structured Query Prompts */}
          <div className='space-y-1.5 mt-3'>
            <p className='text-[9px] text-white/15 uppercase tracking-widest font-medium px-1 mb-2'>Suggested Queries</p>
            {[
              { icon: <LuTarget className='text-white/25 text-xs' />, label: 'Refine Market Positioning', context: 'Differentiation: 4.5' },
              { icon: <LuDollarSign className='text-white/25 text-xs' />, label: 'Stress-Test Monetization Logic', context: 'Monetization: 7.0' },
              { icon: <LuShield className='text-white/25 text-xs' />, label: 'Simulate Competitive Pressure', context: 'Risk: Moderate' },
              { icon: <LuTrendingUp className='text-white/25 text-xs' />, label: 'Evaluate Scalability Constraints', context: 'Scalability: 7.5' },
              { icon: <LuUsers className='text-white/25 text-xs' />, label: 'Sharpen ICP Definition', context: 'Clarity: 6.5' },
              { icon: <LuSearch className='text-white/25 text-xs' />, label: 'Identify Validation Gaps', context: 'Stage: Pre-validation' },
            ].map((query) => (
              <button
                key={query.label}
                className='w-full flex items-center gap-2.5 px-3 py-2 rounded border border-white/6 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-colors text-left group cursor-pointer'
              >
                <div className='w-5 h-5 shrink-0 rounded border border-white/8 bg-white/3 flex items-center justify-center'>
                  {query.icon}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-xs text-white/50 group-hover:text-white/65 transition-colors'>{query.label}</p>
                </div>
                <span className='text-[9px] text-white/15 shrink-0'>{query.context}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Example: User Query */}
        <div className='flex justify-end'>
          <div className='max-w-[80%] border-l-2 border-[#7C5CFF]/30 pl-3 py-1'>
            <p className='text-[9px] text-white/20 uppercase tracking-widest font-medium mb-1'>Query</p>
            <p className='text-sm text-white/60'>Refine Market Positioning</p>
          </div>
        </div>

        {/* Example: System Response */}
        {/* <div className='border-l-2 border-white/8 pl-3'>
          <p className='text-[10px] text-white/20 uppercase tracking-widest font-medium mb-1.5'>Analysis</p>
          <p className='text-sm text-white/50 leading-relaxed'>
            Current differentiation score (4.5) is below defensibility threshold...
          </p>
        </div> */}
      </div>

      {/* Input Area */}
      <div className='p-3 border-t border-white/6'>
        <div className='bg-white/3 border border-white/8 rounded-[5px] focus-within:border-white/15 transition-colors'>
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder='Describe area to investigate...'
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className='w-full bg-transparent
            overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-white/10
            [&::-webkit-scrollbar-thumb]:rounded-full
            text-white/60 text-sm px-3.5 pt-3 pb-1 outline-none placeholder-white/25 resize-none max-h-37.5'
          />
          <div className='flex items-center justify-between px-3 pb-2'>
            <button className='text-white/20 hover:text-white/40 transition-colors'>
              <GoPlus size={18} />
            </button>
            <button className='bg-white/8 hover:bg-white/12 text-white/40 hover:text-white/60 rounded-lg p-1.5 transition-colors cursor-pointer'>
              <IoIosSend size={14} />
            </button>
          </div>
        </div>
        <div className='flex items-center justify-between mt-2 px-1'>
          <span className='text-[9px] text-white/12'>Context: 6 metrics, 3 risk drivers, Pre-validation stage</span>
        </div>
      </div>
    </div>
  )
}

export default Chat
