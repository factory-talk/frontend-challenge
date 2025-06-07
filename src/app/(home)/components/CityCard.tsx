import { X } from 'lucide-react'

type City = {
  name: string
  lat: number
  lon: number
  country: string
}

const CityCard = ({
  item,
  onDelete,
  onClickCity,
}: {
  item: City
  onDelete?: () => void
  onClickCity?: () => void
}) => {
  return (
    <div className="relative p-4 border rounded-lg shadow bg-white dark:bg-gray-800"
    onClick={onClickCity}
    >
      <button
        onClick={onDelete}
        className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
        title="Remove"
      >
        <X size={16} />
      </button>
      <p>📍 <strong>{item.name}</strong>, {item.country}</p>
      <p>🌐 Latitude: {item.lat}</p>
      <p>🌐 Longitude: {item.lon}</p>
    </div>
  )
}

export { CityCard }
