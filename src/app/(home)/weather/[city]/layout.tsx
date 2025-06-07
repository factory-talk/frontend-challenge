// app/weather/[city]/layout.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function CityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="p-4">
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
