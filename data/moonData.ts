
import { Sparkles, Leaf, Zap, PenSquare, Star, HandHeart, Wind, Droplets, BrainCircuit, TrendingUp, Anchor, Hourglass, CircleDollarSign, Trash2, Bed } from 'lucide-react';
import React from 'react';

// Define action types with specific labels and icons
type TradingAction = {
  labelKey: 'moonPhases.new_moon_trading_action' | 'moonPhases.waxing_crescent_trading_action' | 'moonPhases.first_quarter_trading_action' | 'moonPhases.waxing_gibbous_trading_action' | 'moonPhases.full_moon_trading_action' | 'moonPhases.waning_gibbous_trading_action' | 'moonPhases.last_quarter_trading_action' | 'moonPhases.waning_crescent_trading_action';
  icon: React.ElementType;
};

type MetaphysicsAction = {
  labelKey: 'moonPhases.new_moon_metaphysics_action' | 'moonPhases.waxing_crescent_metaphysics_action' | 'moonPhases.first_quarter_metaphysics_action' | 'moonPhases.waxing_gibbous_metaphysics_action' | 'moonPhases.full_moon_metaphysics_action' | 'moonPhases.waning_gibbous_metaphysics_action' | 'moonPhases.last_quarter_metaphysics_action' | 'moonPhases.waning_crescent_metaphysics_action';
  icon: React.ElementType;
};


export interface MoonPhaseDetail {
  id: string;
  nameKey: string;
  nameEnglish: string;
  icon: string;
  whatIsKey: string; 
  applicationKey: string;
  mantraKey: string; 
  readingGuideKey: string;
  encyclopediaDescriptionKey: string;
  tradingAction: TradingAction;
  metaphysicsAction: MetaphysicsAction;
  representativePhaseValue: number;
}

export const moonPhases: Record<string, MoonPhaseDetail> = {
  "new_moon": {
    id: "1",
    nameKey: "moonPhases.new_moon_name",
    nameEnglish: "New Moon",
    icon: "🌑",
    whatIsKey: "moonPhases.new_moon_what_is",
    applicationKey: "moonPhases.new_moon_application",
    mantraKey: "moonPhases.new_moon_mantra",
    readingGuideKey: "moonPhases.new_moon_reading_guide",
    encyclopediaDescriptionKey: "moonPhases.new_moon_encyclopedia",
    tradingAction: { labelKey: "moonPhases.new_moon_trading_action", icon: BrainCircuit },
    metaphysicsAction: { labelKey: "moonPhases.new_moon_metaphysics_action", icon: Sparkles },
    representativePhaseValue: 0,
  },
  "waxing_crescent": {
    id: "2",
    nameKey: "moonPhases.waxing_crescent_name",
    nameEnglish: "Waxing Crescent",
    icon: "🌒",
    whatIsKey: "moonPhases.waxing_crescent_what_is",
    applicationKey: "moonPhases.waxing_crescent_application",
    mantraKey: "moonPhases.waxing_crescent_mantra",
    readingGuideKey: "moonPhases.waxing_crescent_reading_guide",
    encyclopediaDescriptionKey: "moonPhases.waxing_crescent_encyclopedia",
    tradingAction: { labelKey: "moonPhases.waxing_crescent_trading_action", icon: TrendingUp },
    metaphysicsAction: { labelKey: "moonPhases.waxing_crescent_metaphysics_action", icon: Leaf },
    representativePhaseValue: 0.125,
  },
  "first_quarter": {
    id: "3",
    nameKey: "moonPhases.first_quarter_name",
    nameEnglish: "First Quarter",
    icon: "🌓",
    whatIsKey: "moonPhases.first_quarter_what_is",
    applicationKey: "moonPhases.first_quarter_application",
    mantraKey: "moonPhases.first_quarter_mantra",
    readingGuideKey: "moonPhases.first_quarter_reading_guide",
    encyclopediaDescriptionKey: "moonPhases.first_quarter_encyclopedia",
    tradingAction: { labelKey: "moonPhases.first_quarter_trading_action", icon: Anchor },
    metaphysicsAction: { labelKey: "moonPhases.first_quarter_metaphysics_action", icon: Zap },
    representativePhaseValue: 0.25,
  },
  "waxing_gibbous": {
    id: "4",
    nameKey: "moonPhases.waxing_gibbous_name",
    nameEnglish: "Waxing Gibbous",
    icon: "🌔",
    whatIsKey: "moonPhases.waxing_gibbous_what_is",
    applicationKey: "moonPhases.waxing_gibbous_application",
    mantraKey: "moonPhases.waxing_gibbous_mantra",
    readingGuideKey: "moonPhases.waxing_gibbous_reading_guide",
    encyclopediaDescriptionKey: "moonPhases.waxing_gibbous_encyclopedia",
    tradingAction: { labelKey: "moonPhases.waxing_gibbous_trading_action", icon: Hourglass },
    metaphysicsAction: { labelKey: "moonPhases.waxing_gibbous_metaphysics_action", icon: PenSquare },
    representativePhaseValue: 0.375,
  },
  "full_moon": {
    id: "5",
    nameKey: "moonPhases.full_moon_name",
    nameEnglish: "Full Moon",
    icon: "🌕",
    whatIsKey: "moonPhases.full_moon_what_is",
    applicationKey: "moonPhases.full_moon_application",
    mantraKey: "moonPhases.full_moon_mantra",
    readingGuideKey: "moonPhases.full_moon_reading_guide",
    encyclopediaDescriptionKey: "moonPhases.full_moon_encyclopedia",
    tradingAction: { labelKey: "moonPhases.full_moon_trading_action", icon: CircleDollarSign },
    metaphysicsAction: { labelKey: "moonPhases.full_moon_metaphysics_action", icon: Star },
    representativePhaseValue: 0.5,
  },
  "waning_gibbous": {
    id: "6",
    nameKey: "moonPhases.waning_gibbous_name",
    nameEnglish: "Waning Gibbous",
    icon: "🌖",
    whatIsKey: "moonPhases.waning_gibbous_what_is",
    applicationKey: "moonPhases.waning_gibbous_application",
    mantraKey: "moonPhases.waning_gibbous_mantra",
    readingGuideKey: "moonPhases.waning_gibbous_reading_guide",
    encyclopediaDescriptionKey: "moonPhases.waning_gibbous_encyclopedia",
    tradingAction: { labelKey: "moonPhases.waning_gibbous_trading_action", icon: HandHeart },
    metaphysicsAction: { labelKey: "moonPhases.waning_gibbous_metaphysics_action", icon: HandHeart },
    representativePhaseValue: 0.625,
  },
  "last_quarter": {
    id: "7",
    nameKey: "moonPhases.last_quarter_name",
    nameEnglish: "Last Quarter",
    icon: "🌗",
    whatIsKey: "moonPhases.last_quarter_what_is",
    applicationKey: "moonPhases.last_quarter_application",
    mantraKey: "moonPhases.last_quarter_mantra",
    readingGuideKey: "moonPhases.last_quarter_reading_guide",
    encyclopediaDescriptionKey: "moonPhases.last_quarter_encyclopedia",
    tradingAction: { labelKey: "moonPhases.last_quarter_trading_action", icon: Trash2 },
    metaphysicsAction: { labelKey: "moonPhases.last_quarter_metaphysics_action", icon: Wind },
    representativePhaseValue: 0.75,
  },
  "waning_crescent": {
    id: "8",
    nameKey: "moonPhases.waning_crescent_name",
    nameEnglish: "Waning Crescent",
    icon: "🌘",
    whatIsKey: "moonPhases.waning_crescent_what_is",
    applicationKey: "moonPhases.waning_crescent_application",
    mantraKey: "moonPhases.waning_crescent_mantra",
    readingGuideKey: "moonPhases.waning_crescent_reading_guide",
    encyclopediaDescriptionKey: "moonPhases.waning_crescent_encyclopedia",
    tradingAction: { labelKey: "moonPhases.waning_crescent_trading_action", icon: Bed },
    metaphysicsAction: { labelKey: "moonPhases.waning_crescent_metaphysics_action", icon: Droplets },
    representativePhaseValue: 0.875,
  }
};
