
import { PlanetaryPositionsMap } from './services/astrologyEngine';

export enum CalculatorMode {
  Astrological = 'astrological',
  Scientific = 'scientific',
  Qarin = 'qarin',
  Nadi = 'nadi',
  TalehSaadNahs = 'talehSaadNahs',
  Horoscope = 'horoscope',
  Electional = 'electional',
  Horary = 'horary',
  Dignities = 'dignities',
  PersonalDignities = 'personalDignities',
  Dream = 'dream',
  Relationship = 'relationship',
  Compatibility = 'compatibility',
  Jafar = 'jafar',
  RabAlTalehAnalysis = 'rabAlTalehAnalysis',
  Abjad = 'abjad',
  Ofagh = 'ofagh',
  Ramal = 'ramal',
  Transit = 'transit',
  Ephemeris = 'ephemeris',
  VipSignals = 'vipSignals',
  OccultMatrix = 'occultMatrix',
}

export interface QarinResult {
    name: string;
    motherName: string;
    birthDay: number;
    totalAbjad: number;
    rootNumber: number;
    startLetter: string;
    middleLetter: string;
    finalLetter: string;
    qarinName: string;
    explanation: string;
}

export type ZodiacSignName = 
    | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
    | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface BirthChartData {
    sun: ZodiacSignName;
    moon: ZodiacSignName;
    ascendant: ZodiacSignName;
    mercury: ZodiacSignName;
    venus: ZodiacSignName;
    mars: ZodiacSignName;
    jupiter: ZodiacSignName;
    saturn: ZodiacSignName;
}

export type PlanetName = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Ascendant' | 'Midheaven';

export interface PlanetPosition {
    planet: PlanetName;
    sign: ZodiacSignName;
    degree: number;
}

export interface HouseCusp {
    house: number; // 1 to 12
    sign: ZodiacSignName;
    degree: number;
}

export interface NatalChartData {
    planets: PlanetPosition[];
    houses: HouseCusp[];
}

export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';

export interface Aspect {
    planet1: PlanetPosition;
    planet2: PlanetPosition;
    type: AspectType;
    orb: number; // The deviation from the exact angle
}

export interface Transit {
    transitingPlanet: PlanetPosition;
    natalPoint: PlanetPosition; // Could be a planet or a house cusp like AC/MC
    type: AspectType;
    orb: number;
}

export interface EphemerisData {
    planet: PlanetName;
    sign: ZodiacSignName;
    degree: number;
    minute: number;
    motion: 'Direct' | 'Retrograde';
    speed: number; // degrees per day
}


export interface Profile {
  id: string; // Unique ID for each profile
  name: string;
  lastName: string;
  motherName: string;
  birthDate: string; // e.g., "1370/05/24"
  birthTime: string; // e.g., "18:45"
  birthCity: string;
  birthDayOfWeek?: string; // Optional: index of the day ('0' for sat, '1' for sun...)
}

export type SubscriptionTier = 'free' | 'premium';

export interface User {
  id: string;
  username: string;
  email: string;
  subscription: SubscriptionTier;
  // Potentially add more fields like avatarUrl, etc.
}


export type PersonType = 'positive' | 'negative' | 'neutral';

export interface FamousPerson {
    id: string;
    name: string;
    birthDate: string; // YYYY/MM/DD format for consistency
    description: string;
    imageUrl: string;
    type: PersonType;
}

export type ShareData =
  | {
      type: 'rab-al-taleh';
      name: string;
      sign: string;
      ruler: string;
      quote: string;
    }
  | {
      type: 'qarin';
      name: string; // Person's name
      qarinName: string;
      qarinAbjad: number;
    }
  | {
      type: 'horoscope';
      name: string;
      zodiacData: PlanetaryPositionsMap;
      analysisSummary: string;
    };

export interface BlogPost {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  content?: string; // Full markdown/html content for the post page
}

// Types for SolarSystemOrrery
export interface SolarSystemPlanet {
  id: string;
  name: string;
  symbol: string;
  radius: number; // orbital radius
  size: number;   // visual size
  speed: number;  // orbital period multiplier
  color: string;
  description: string;
  ring?: {
    radius: number;
    thickness: number;
  };
}

// Types for OccultMatrix
export interface EsotericRulers {
    malakName: string;
    jinnName: string;
    explanation: string;
}

export interface CleansingRitual {
    title: string;
    ingredients: string[];
    steps: string[];
    advice: string;
}

export interface TradingDayAnalysis {
    day: number;
    rating: 'عالی' | 'خوب' | 'متوسط' | 'پرریسک' | 'بسیار پرریسک';
    summary: string;
    positiveAspects: string[];
    negativeAspects: string[];
    advice: string;
}

export interface TradingSignal {
  symbol: string;
  type: 'BUY' | 'SELL';
  price: string;
}

export interface PlanetInfo {
  name: string;
  persian: string;
  icon: string;
  auspiciousness: string;
  auspiciousnessKey: string;
  recommendation: string;
  intentions: Record<string, 'عالی' | 'خوب' | 'ضعیف' | 'بد'>;
}
