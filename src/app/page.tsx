'use client'

import { SearchIcon } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import useFetch from './hook/useFetch'
import type { GeocodingLocation, GeocodingResponse } from './type'
import { Combobox } from '@/components/components/ui/custom/combobox'
import { CityCard } from './(home)/components/CityCard'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
   const [selectedCities, setSelectedCities] = useState<GeocodingLocation[]>([])
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

  const handleAddCity = (city: GeocodingLocation) => {
    const exists = selectedCities.some(
      (c) => c.name === city.name && c.lat === city.lat && c.lon === city.lon
    )
    if (!exists) {
      setSelectedCities((prev) => [...prev, city])
    }else{
      window.alert('City already added')
    }
  }

  const handleRemoveCity = (city: GeocodingLocation) => {
    setSelectedCities((prev) =>
      prev.filter((c) => !(c.name === city.name && c.lat === city.lat && c.lon === city.lon))
    )
  }

  const handleClickCity = (city: GeocodingLocation) => {
    router.push(`/weather/${city.name}`)
    console.log(city.name)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <div className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3.5 py-2">
          <SearchIcon className="h-4 w-4" />
          <Combobox<GeocodingLocation>
            onSearchChange={setSearchText}
            onSelectOption={handleAddCity}
            options={weatherData ?? []}
            getLabel={(item) => `${item.name}, ${item.country}`}
            getKey={(item) => `${item.name}-${item.lat}-${item.lon}`}
          />
        </div>
      </div>

      <div className="mt-6 w-full max-w-sm space-y-4">
        {selectedCities.map((city, idx) => (
          <CityCard 
          key={`${city.name}-${idx}`} 
          item={city} 
          onDelete={() => handleRemoveCity(city)} 
          onClickCity={() => handleClickCity(city)}
          />
        ))}
      </div>
    </main>
  )
}




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
