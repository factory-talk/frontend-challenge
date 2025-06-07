// app/weather/[city]/layout.tsx
'use client'

import { useRouter } from 'next/navigation'
import { createPortal } from "react-dom";

export default function CityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    
    <div className="p-4">
        {/* {typeof window !== "undefined" &&
  createPortal(
    <div className="fixed inset-0 z-[2147483647] bg-red-500/50 backdrop-blur-sm" />,
    document.body
  )} */}

      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        ← Back
      </button>

      {children}
    </div>
  )

  
}
