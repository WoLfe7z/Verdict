import React from 'react'

function chat() {
  return (
    <div className='w-[450px] min-w-[400px] h-full bg-[#252525]/80 rounded-[10px] border-[1px] border-white/30 font-primary flex flex-col'>
      {/* Top chat */}
      <h1>Popravi dizajn!</h1>
      <div className='w-full bg-white/10 rounded-t-[10px] p-2 text-center'>
        Chat
      </div>

      {/* Mid chat */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        <div className='flex-col space-y-4 justify-start'>
          <div className='max-w-[75%] bg-white/10 rounded-[5px] px-4 py-2 text-sm text-white'>
            Hey! How can I help you with your idea?
            <button className='text-start w-full rounded-[5px] bg-white/20 p-2 mt-2'>
              How can i improve my idea?
            </button>
            <button className='text-start w-full rounded-[5px] bg-white/20 p-2 mt-2'>
              What could i do better?
            </button>
            <button className='text-start w-full rounded-[5px] bg-white/20 p-2 mt-2'>
              Do you have any better idea?
            </button>
          </div>
          {/* <div className='max-w-[75%] bg-white/10 rounded-[5px] px-4 py-2 text-sm text-white'>
            Hey! How can I help you with your idea?
          </div> */}
        </div>
        <div className='flex justify-end'>
          <div className='max-w-[75%] bg-blue-600 rounded-[5px] px-4 py-2 text-sm text-white'>
            How can i improve my idea?
          </div>
        </div>
      </div>

      {/* Bottom chat */}
      <div className='p-3 border-t border-white/20'>
        <div className='flex items-center gap-2'>
          <input
            type='text'
            placeholder='Type a message...'
            className='flex-1 bg-white/10 text-white text-sm rounded-full px-4 py-2 outline-none placeholder-white/50 border border-white/20 focus:border-white/40'
          />
          <button className='bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors'>
            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M22 2L11 13' />
              <path d='M22 2L15 22L11 13L2 9L22 2Z' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default chat
