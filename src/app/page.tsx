'use client'

import { SearchIcon } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import useFetch from './hook/useFetch'
import type { GeocodingLocation, GeocodingResponse } from './type'
import { Combobox } from '@/components/components/ui/custom/combobox'
import { CityCard } from './(home)/components/CityCard'

export default function Home() {
  const [searchText, setSearchText] = useState('')
  const [selectedCity, setSelectedCity] = useState<GeocodingLocation | null>(null)
  const lastFetchedText = useRef('')
  const isZipCode = /^\d+$/.test(searchText.trim()) // check if numeric

  const weatherFetch = useFetch<GeocodingResponse>('/api/city', { q: ' ' })
  // #TODO find api to return array of zipcodes
  // const zipFetch = useFetch<ZipcodeResponse>('/api/zipcode', { zip: 90035 })

  // const activeFetch = isZipCode ? zipFetch : weatherFetch
  const activeFetch =  weatherFetch
  const { data: weatherData, loading, error, refetchWithParams } = activeFetch

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = searchText.trim()
      const shouldFetch =
        trimmed.length >= 3 && trimmed !== lastFetchedText.current

      if (shouldFetch) {
        lastFetchedText.current = trimmed
        refetchWithParams(isZipCode? { zip: trimmed } : { q: trimmed })
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [searchText, refetchWithParams])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <div className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3.5 py-2">
          <SearchIcon className="h-4 w-4" />


<Combobox<GeocodingLocation>
  onSearchChange={setSearchText}
  onSelectOption={(item) => setSelectedCity(item)}
  options={weatherData ?? []}
  getLabel={(item) => `${item.name}, ${item.country}`}
  getKey={(item) => `${item.name}-${item.lat}-${item.lon}`}
/>


          
        </div>

        {/* {loading && <p className="text-sm text-muted">Loading...</p>}
        {error && <p className="text-sm text-red-500">Error fetching data.</p>}
        {weatherData && weatherData.length > 0 && (
          <ul className="space-y-2 text-left text-sm mt-4">
            {weatherData.map((item, idx) => (
              <li
              onClick={()=>{
                setCityName(item.name)
                console.log(item.name)}}
              key={idx}>
              
                📍 <strong>{item.name}</strong>, {item.country} — lat: {item.lat}, lon: {item.lon}
              </li>
            ))}
          </ul>
        )} */}
      </div>

      <CityCard  item={selectedCity}/>
    </main>
  )
}
