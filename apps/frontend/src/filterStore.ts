import { create } from 'zustand';

interface FilterState {
  name: string;
  city: string;
  starRating: number | null;
  naicsCode: string;
  yearStarted: number | null;
  setName: (name: string) => void;
  setCity: (city: string) => void;
  setStarRating: (starRating: number | null) => void;
  setNaicsCode: (naicsCode: string) => void;
  setYearStarted: (yearStarted: number | null) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  name: '',
  city: '',
  starRating: null,
  naicsCode: '',
  yearStarted: null,
  setName: (name) => set({ name }),
  setCity: (city) => set({ city }),
  setStarRating: (starRating) => set({ starRating }),
  setNaicsCode: (naicsCode) => set({ naicsCode }),
  setYearStarted: (yearStarted) => set({ yearStarted }),
  reset: () => set({ name: '', city: '', starRating: null, naicsCode: '', yearStarted: null }),
})); 