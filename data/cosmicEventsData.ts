
export interface CosmicEvent {
  name: string;
  date: string; // ISO 8601 format
  icon: string; // Emoji
  descriptionKey: string; // Key for Gemini prompt
}

// NOTE: Dates are set in the near future for demonstration purposes.
const now = new Date();

export const cosmicEventsData: CosmicEvent[] = [
  {
    name: 'ماه کامل بعدی',
    date: new Date(now.getFullYear(), now.getMonth() + 1, 19).toISOString(), // Approx. full moon
    icon: '🌕',
    descriptionKey: 'the next Full Moon',
  },
  {
    name: 'ورود خورشید به برج بعدی',
    date: new Date(now.getFullYear(), now.getMonth(), 22).toISOString(), // Approx. sign ingress
    icon: '☀️',
    descriptionKey: 'the Sun entering the next zodiac sign',
  },
  {
    name: 'بارش شهابی برساوشی',
    date: new Date(now.getFullYear(), 7, 12, 22, 0, 0).toISOString(), // Perseids meteor shower peak around Aug 12
    icon: '🌠',
    descriptionKey: 'the Perseid meteor shower peak',
  },
  {
    name: 'خسوف بعدی',
    // Find next plausible eclipse, e.g., March 14, 2025
    date: '2025-03-14T06:55:00Z',
    icon: '🌚',
    descriptionKey: 'the next Lunar Eclipse',
  },
   // Added a very near event to test the 5-second audio trigger
  {
    name: "رویداد آزمایشی",
    date: new Date(Date.now() + 20 * 1000).toISOString(), // 20 seconds from now
    icon: "🧪",
    descriptionKey: "a test event",
  }
];
