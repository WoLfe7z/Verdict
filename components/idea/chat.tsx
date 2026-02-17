import React, { useRef, useCallback } from 'react'

// Icons
import { BsThreeDots } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { IoMicOutline } from "react-icons/io5";

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
      // TODO: handle send message
    }
  };

  return (
    <div className='w-full max-w-[450px] h-[600px] rounded-[5px] border-[1px] border-white/30 font-primary flex flex-col'>
      {/* Top chat */}
      <div className='w-full h-auto px-4 py-2 border-b border-white/10 bg-white/5 rounded-t-[5px] flex items-center justify-between gap-2 text-sm'>
        <h1 className='text-lg text-white/80'>Assistant</h1>
        <BsThreeDots className='text-white/50 hover:text-white cursor-pointer' />
      </div>

      {/* Mid chat */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        <div className='flex-col space-y-4 justify-start'>
          <div className='max-w-[75%] bg-white/10 rounded-[5px] px-2 py-2 text-sm text-white'>
            Hey! How can I help you with your idea?
            <button className='text-start w-full rounded-[5px] bg-white/10 p-2 mt-2'>
              How can i improve my idea?
            </button>
            <button className='text-start w-full rounded-[5px] bg-white/10 p-2 mt-2'>
              What could i do better?
            </button>
            <button className='text-start w-full rounded-[5px] bg-white/10 p-2 mt-2'>
              Do you have any better idea?
            </button>
          </div>
          {/* <div className='max-w-[75%] bg-white/10 rounded-[5px] px-4 py-2 text-sm text-white'>
            Hey! How can I help you with your idea?
          </div> */}
        </div>
        <div className='flex justify-end'>
          <div className='max-w-[75%] bg-[#7C5CFF] rounded-[5px] px-4 py-2 text-sm text-white'>
            How can i improve my idea?
          </div>
        </div>
      </div>

      {/* Bottom chat */}
      <div className='p-3'>
        <div className='bg-white/10 border border-white/20 rounded-[5px] focus-within:border-white/40'>
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder='Type a message...'
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className='w-full bg-transparent
            overflow-y-auto
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#ffffff]/20
            [&::-webkit-scrollbar-thumb]:rounded-full
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 
            text-white text-sm px-4 pt-3 pb-1 outline-none placeholder-white/50 resize-none max-h-[150px] custom-scrollbar'
          />
          <div className='flex items-center justify-between px-3 pb-2'>
            <button className='text-white/50 hover:text-white transition-colors'>
              <GoPlus size={20} />
            </button>
            <div className='flex items-center gap-1'>
              <button className='text-white/50 hover:text-white p-1 transition-colors'>
                <IoMicOutline size={20} />
              </button>
              <button className='bg-[#7C5CFF] hover:bg-[#7C5CFF]/70 hover:cursor-pointer text-white rounded-[5px] p-1.5 transition-colors'>
                <IoIosSend size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
