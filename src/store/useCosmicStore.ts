
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, ZodiacSignName } from '../types';

export interface CosmicState {
  activeProfile: Profile | null;
  calculatedZodiacSign: ZodiacSignName | null;
  calculatedAbjad: number | null;
  isNahs: boolean;
  
  setActiveProfile: (profile: Profile | null) => void;
  setCalculatedZodiacSign: (sign: ZodiacSignName | null) => void;
  setCalculatedAbjad: (abjad: number | null) => void;
  setIsNahs: (isNahs: boolean) => void;
}

export const useCosmicStore = create<CosmicState>()(
  persist(
    (set) => ({
      activeProfile: null,
      calculatedZodiacSign: null,
      calculatedAbjad: null,
      isNahs: false,

      setActiveProfile: (profile) => set({ activeProfile: profile, calculatedZodiacSign: null, calculatedAbjad: null }),
      setCalculatedZodiacSign: (sign) => set({ calculatedZodiacSign: sign }),
      setCalculatedAbjad: (abjad) => set({ calculatedAbjad: abjad }),
      setIsNahs: (isNahs) => set({ isNahs }),
    }),
    {
      name: 'cosmic-storage', // The key used in localStorage
    }
  )
);
