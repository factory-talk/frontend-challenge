// temperatureStore.ts
import { create } from 'zustand';

// Updated TemperatureUnit type
export type TemperatureUnit =
  | { unit: 'kelvin'; type: 'standard'; label: 'Kelvin'; symbol: 'K' }
  | { unit: 'celsius'; type: 'metric'; label: 'Celsius'; symbol: '°C' }
  | { unit: 'fahrenheit'; type: 'imperial'; label: 'Fahrenheit'; symbol: '°F' };

type TemperatureStore = {
  unit: TemperatureUnit;
  setUnit: (unit: 'kelvin' | 'celsius' | 'fahrenheit') => void;
  toggleUnit: () => void;
};

// Map of unit details
const unitDetailsMap: Record<string, TemperatureUnit> = {
  kelvin: { unit: 'kelvin', type: 'standard', label: 'Kelvin', symbol: 'K' },
  celsius: { unit: 'celsius', type: 'metric', label: 'Celsius', symbol: '°C' },
  fahrenheit: { unit: 'fahrenheit', type: 'imperial', label: 'Fahrenheit', symbol: '°F' },
};

// Array of unit keys for cycling
const unitKeys = Object.keys(unitDetailsMap) as Array<'kelvin' | 'celsius' | 'fahrenheit'>;

const useTemperatureUnitStore = create<TemperatureStore>((set) => ({
  unit: unitDetailsMap.celsius, // Default state
  setUnit: (unit) => set({ unit: unitDetailsMap[unit] }),
  toggleUnit: () => set((state) => {
    const currentIndex = unitKeys.indexOf(state.unit.unit);
    const nextIndex = (currentIndex + 1) % unitKeys.length; // Cycle through units

    return { unit: unitDetailsMap[unitKeys[nextIndex]] };
  }),
}));

export default useTemperatureUnitStore;
