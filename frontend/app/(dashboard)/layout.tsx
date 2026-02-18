import React from 'react'

export default function layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#141414]">
      {/* Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
