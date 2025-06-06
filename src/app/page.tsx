'use client'

import { Input } from '@/components/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import useFetch from './hook/useFetch'
import type { GeocodingResponse } from './type'

export default function Home() {
  const [searchText, setSearchText] = useState('')
  const lastFetchedText = useRef('')
  const { data: weatherData, loading, error, refetchWithParams } =
    useFetch<GeocodingResponse>('/api/weather',{q:" "})

  // Debounce input and trigger API only when valid
  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = searchText.trim()
      const shouldFetch =
        trimmed.length >= 3 && trimmed !== lastFetchedText.current

      if (shouldFetch) {
        lastFetchedText.current = trimmed
        refetchWithParams({ q: trimmed })
      }
    }, 500) // ⏳ adjust delay as needed

    return () => clearTimeout(timeout)
  }, [searchText, refetchWithParams])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center w-full max-w-sm space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3.5 py-2">
        <SearchIcon className="h-4 w-4" />
        <Input
          type="search"
          placeholder="Search"
          className="w-full border-0 h-8 font-semibold"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">Error fetching data.</p>}
      {weatherData && weatherData.length > 0 && (
        <ul className="mt-6 space-y-2 text-left text-sm">
          {weatherData.map((item, idx) => (
            <li key={idx}>
              📍 <strong>{item.name}</strong>, {item.country} — lat: {item.lat}, lon: {item.lon}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
