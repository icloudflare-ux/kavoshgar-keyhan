
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, ZodiacSignName, PlanetInfo } from '../types';

// Define the shape of a trading signal
export interface TradingSignal {
  symbol: string;
  type: 'BUY' | 'SELL'; 
  price: string;
}

export interface CosmicState {
  activeProfile: Profile | null;
  calculatedZodiacSign: ZodiacSignName | null;
  calculatedAbjad: number | null;
  isNahs: boolean;
  tradingSignal: TradingSignal | null;
  currentPlanet: PlanetInfo | null;
  
  setActiveProfile: (profile: Profile | null) => void;
  setCalculatedZodiacSign: (sign: ZodiacSignName | null) => void;
  setCalculatedAbjad: (abjad: number | null) => void;
  setIsNahs: (isNahs: boolean) => void;
  setTradingSignal: (signal: TradingSignal | null) => void;
  setCurrentPlanet: (planet: PlanetInfo | null) => void;
}

// This function now sends the signal to our own secure backend endpoint
async function broadcastSignal(signal: TradingSignal, isNahs: boolean, currentPlanet: PlanetInfo | null) {
  try {
    const response = await fetch('/api/send-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        signal,
        isNahs,
        currentPlanet,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API function Error:', errorData);
    }
  } catch (error) {
    console.error('Network Error: Could not broadcast signal via API function.', error);
  }
}


// Create the store using persist middleware for localStorage
export const useCosmicStore = create<CosmicState>()(
  persist(
    (set, get) => ({
      // Initial state values
      activeProfile: null,
      calculatedZodiacSign: null,
      calculatedAbjad: null,
      isNahs: false,
      tradingSignal: null,
      currentPlanet: null,

      // Action implementations
      setActiveProfile: (profile) => set({ 
        activeProfile: profile, 
        calculatedZodiacSign: null, 
        calculatedAbjad: null 
      }),
      setCalculatedZodiacSign: (sign) => set({ calculatedZodiacSign: sign }),
      setCalculatedAbjad: (abjad) => set({ calculatedAbjad: abjad }),
      setIsNahs: (isNahs) => set({ isNahs }),
      setCurrentPlanet: (planet) => set({ currentPlanet: planet }),
      
      // Action to set the signal and broadcast it via the secure backend
      setTradingSignal: (signal) => {
        set({ tradingSignal: signal });
        if (signal) {
          // `get()` allows us to access the current state inside an action
          broadcastSignal(signal, get().isNahs, get().currentPlanet);
        }
      },
    }),
    {
      name: 'cosmic-storage', // The key used in localStorage
    }
  )
);