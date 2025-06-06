export interface GeocodingLocation {
  name: string
  local_names?: Record<string, string> // keys like 'en', 'th', 'ja', etc.
  lat: number
  lon: number
  country: string
}
export type GeocodingResponse = GeocodingLocation[]
