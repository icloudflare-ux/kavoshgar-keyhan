
import { useMemo } from 'react';
import { PlanetaryPositionsMap } from '../services/astrologyEngine';
import { PlanetName, PlanetPosition, ZodiacSignName, Aspect } from '../types';
import { calculateAspects } from '../utils/astrology';

/**
 * Calculates a market sentiment score (-100 to +100) based on astrological aspects.
 * @param zodiacData The current planetary positions.
 * @returns A numerical score representing market sentiment, or null if no data is available.
 */
export const useMarketOracle = (zodiacData: PlanetaryPositionsMap | null): number | null => {
    return useMemo(() => {
        if (!zodiacData) return null;

        // 1. Prepare planet data
        const planetsArray = Object.entries(zodiacData)
            .map(([planet, data]) => {
                if (!data) return null;
                const typedData = data as { sign: ZodiacSignName; signDegree: number; degree: number };
                return {
                    planet: planet as PlanetName,
                    sign: typedData.sign,
                    degree: typedData.signDegree,
                    absoluteDegree: typedData.degree
                };
            })
            .filter((p): p is PlanetPosition & { absoluteDegree: number } => p !== null);
        
        // 2. Calculate aspects
        const aspects: Aspect[] = calculateAspects(planetsArray);
        
        // 3. Define weights
        const planetWeights: Record<string, number> = {
            Jupiter: 3, Venus: 2.5, Sun: 2, Moon: 1.5, Mercury: 1, // Benefics/Neutrals
            Mars: -2.5, Saturn: -3, // Malefics
        };

        const aspectWeights = {
            trine: 2, sextile: 1.5, // Harmonious
            square: -2, opposition: -2.5, // Challenging
            conjunction: 1, // Neutral, depends on planets
        };

        let totalScore = 0;
        let maxPossibleScore = 0;

        // 4. Score calculation
        for (const aspect of aspects) {
            const p1Weight = planetWeights[aspect.planet1.planet] || 0;
            const p2Weight = planetWeights[aspect.planet2.planet] || 0;
            let aspectScore: number;

            // For conjunctions, the nature is determined by the planets involved
            if (aspect.type === 'conjunction') {
                if (p1Weight < 0 || p2Weight < 0) { // If a malefic is involved
                    aspectScore = -1.5 * (Math.abs(p1Weight) + Math.abs(p2Weight)) / 2;
                } else {
                    aspectScore = (p1Weight + p2Weight) / 2;
                }
            } else {
                // For other aspects, multiply base weight by average planet weight
                aspectScore = aspectWeights[aspect.type] * ((p1Weight + p2Weight) / 2);
            }

            // Orb makes aspect stronger (smaller orb = more power)
            const orbFactor = 1 - (aspect.orb / 8); // 8 is max orb
            
            totalScore += aspectScore * orbFactor;
            maxPossibleScore += Math.abs(aspectWeights[aspect.type]) * ((Math.abs(p1Weight) + Math.abs(p2Weight)) / 2);
        }

        if (maxPossibleScore === 0) return 50; // Neutral score if no significant aspects

        // 5. Normalize score to [-100, 100]
        const normalizedScore = (totalScore / (maxPossibleScore || 1)) * 100;
        
        return Math.round(Math.max(-100, Math.min(100, normalizedScore)));

    }, [zodiacData]);
};
