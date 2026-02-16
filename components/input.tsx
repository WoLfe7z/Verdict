import React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div>
      {label && <label className="block text-sm text-white/60 mb-1">{label}</label>}
      <input
        className={`w-full px-3 py-1 bg-[#252525] border border-white/10 rounded-[5px] text-sm outline-none focus:ring-1 focus:ring-white/30 ${className}`}
        {...props}
      />
    </div>
  )
}
