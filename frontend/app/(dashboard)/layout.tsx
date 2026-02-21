import React from 'react'
import Navbar from '@/components/layout/navbar'
import Sidebar from '@/components/layout/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-primary min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <Sidebar />
      
      <main className="ml-16 pt-14 min-h-screen">  {/* ← ml-16 za sidebar, pt-14 za navbar */}
        {children}
      </main>
    </div>
  )
}