import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Location = {
  id: string;
  displayPlace: string;
  displayAddress: string;
  lat: string;
  lon: string;
};

type LocationStore = {
  location: Location[];
  addLocation: (newCard: Location) => void;
  removeLocation: (id: string) => void;
  updateLocation: (updatedCard: Location) => void;
};

const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      location: [],

      addLocation: (newCard) =>
        set((state) => ({
          location: [...state.location, newCard],
        })),

      removeLocation: (id) =>
        set((state) => ({
          location: state.location.filter((card) => card.id !== id),
        })),

      updateLocation: (updatedCard) =>
        set((state) => ({
          location: state.location.map((card) =>
            (card.id === updatedCard.id ? updatedCard : card)
          ),
        })),
    }),
    {
      name: 'location-store', // Name of the item in localStorage
    }
  )
);

export default useLocationStore;
