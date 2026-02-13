import "./globals.css"
import Navbar from "@/components/Navbar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-gray-200">
        <Navbar />

        <div className="min-h-screen w-full">
          {children}
        </div>
      </body>
    </html>
  )
}
