import { create } from 'zustand';

export type LocationCard = {
  id: string;
  displayName: string;
  lat: string;
  lon: string;
};

type LocationStore = {
  locationCards: LocationCard[];
  addLocationCard: (newCard: LocationCard) => void;
  removeLocationCard: (id: string) => void;
  updateLocationCard: (updatedCard: LocationCard) => void;
};

const useLocationStore = create<LocationStore>((set) => ({
  locationCards: [],

  addLocationCard: (newCard) =>
    set((state) => ({
      locationCards: [...state.locationCards, newCard],
    })),

  removeLocationCard: (id) =>
    set((state) => ({
      locationCards: state.locationCards.filter((card) => card.id !== id),
    })),

  updateLocationCard: (updatedCard) =>
    set((state) => ({
      locationCards: state.locationCards.map((card) =>
        (card.id === updatedCard.id ? updatedCard : card)
      ),
    })),
}));

export default useLocationStore;
