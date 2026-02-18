import Navbar from "@/components/Navbar"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      {children}
    </div>
  )
}
