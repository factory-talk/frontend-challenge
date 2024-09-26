import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TemperatureUnit =
  | { unit: 'kelvin'; type: 'standard'; label: 'Kelvin'; symbol: 'K' }
  | { unit: 'celsius'; type: 'metric'; label: 'Celsius'; symbol: '°C' }
  | { unit: 'fahrenheit'; type: 'imperial'; label: 'Fahrenheit'; symbol: '°F' };

type TemperatureStore = {
  unit: TemperatureUnit;
  setUnit: (unit: 'kelvin' | 'celsius' | 'fahrenheit') => void;
  toggleUnit: (onSuccess?: () => void) => void;
};

// Map of unit details
const unitDetailsMap: Record<string, TemperatureUnit> = {
  kelvin: { unit: 'kelvin', type: 'standard', label: 'Kelvin', symbol: 'K' },
  celsius: { unit: 'celsius', type: 'metric', label: 'Celsius', symbol: '°C' },
  fahrenheit: { unit: 'fahrenheit', type: 'imperial', label: 'Fahrenheit', symbol: '°F' },
};

// Array of unit keys for cycling
const unitKeys = Object.keys(unitDetailsMap) as Array<'kelvin' | 'celsius' | 'fahrenheit'>;

const useTemperatureUnitStore = create<TemperatureStore>()(
  persist((set) => ({
    unit: unitDetailsMap.celsius, // Default state
    setUnit: (unit) => set({ unit: unitDetailsMap[unit] }),
    toggleUnit: (onSuccess) => set((state) => {
      const currentIndex = unitKeys.indexOf(state.unit.unit);
      const nextIndex = (currentIndex + 1) % unitKeys.length;

      // Update the state
      const updatedState = { unit: unitDetailsMap[unitKeys[nextIndex]] };

      if (onSuccess) {
        setTimeout(() => onSuccess(), 0);
      }

      return updatedState;
    })
  }),
    {
      name: 'location-store', // Name of the item in localStorage
    })

);

export default useTemperatureUnitStore;
