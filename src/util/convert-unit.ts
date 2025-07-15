import { Units } from "@/interface/units"

export const convertUnits = (unit: Units) => {
    return unit === 'metric' ? '°C' : unit === 'imperial' ? '°F' : '°K'
}