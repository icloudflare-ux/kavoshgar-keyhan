
import { PlanetPosition, ZodiacSignName, Aspect, AspectType, NatalChartData, Transit } from '../types';

export const ZODIAC_SIGNS_INFO: { name: ZodiacSignName, symbol: string }[] = [
    { name: 'Aries', symbol: '♈︎' }, { name: 'Taurus', symbol: '♉︎' }, { name: 'Gemini', symbol: '♊︎' },
    { name: 'Cancer', symbol: '♋︎' }, { name: 'Leo', symbol: '♌︎' }, { name: 'Virgo', symbol: '♍︎' },
    { name: 'Libra', symbol: '♎︎' }, { name: 'Scorpio', symbol: '♏︎' }, { name: 'Sagittarius', symbol: '♐︎' },
    { name: 'Capricorn', symbol: '♑︎' }, { name: 'Aquarius', symbol: '♒︎' }, { name: 'Pisces', symbol: '♓︎' },
];

export const ASPECT_INFO: { [key in AspectType]: { angle: number, orb: number, color: string, type: 'harmonious' | 'challenging' | 'neutral' } } = {
    conjunction: { angle: 0, orb: 8, color: '#a5b4fc', type: 'neutral' }, // قران
    sextile: { angle: 60, orb: 6, color: '#22c55e', type: 'harmonious' }, // تسدیس
    square: { angle: 90, orb: 8, color: '#facc15', type: 'challenging' }, // تربیع
    trine: { angle: 120, orb: 8, color: '#3b82f6', type: 'harmonious' }, // تثلیث
    opposition: { angle: 180, orb: 8, color: '#ef4444', type: 'challenging' }, // مقابله
};


export const getAbsoluteDegree = (sign: ZodiacSignName, degree: number): number => {
    const signIndex = ZODIAC_SIGNS_INFO.findIndex(s => s.name === sign);
    if (signIndex === -1) return 0;
    return (signIndex * 30) + degree;
};

// FIX: Add missing degreeToSign function
export const degreeToSign = (degree: number): { sign: ZodiacSignName; signDegree: number } => {
    const safeDegree = (degree % 360 + 360) % 360; // Ensure degree is within 0-359.99 range
    const signIndex = Math.floor(safeDegree / 30);
    const signDegree = safeDegree % 30;
    const sign = ZODIAC_SIGNS_INFO[signIndex].name;
    return { sign, signDegree };
};

export const calculateAspects = (planets: (PlanetPosition & { absoluteDegree?: number })[]): Aspect[] => {
    const aspects: Aspect[] = [];
    const uniquePlanets = planets.filter((p, i, arr) => arr.findIndex(t => t.planet === p.planet) === i);

    for (let i = 0; i < uniquePlanets.length; i++) {
        for (let j = i + 1; j < uniquePlanets.length; j++) {
            const planet1 = uniquePlanets[i];
            const planet2 = uniquePlanets[j];

            const deg1 = planet1.absoluteDegree ?? getAbsoluteDegree(planet1.sign, planet1.degree);
            const deg2 = planet2.absoluteDegree ?? getAbsoluteDegree(planet2.sign, planet2.degree);

            let angleDiff = Math.abs(deg1 - deg2);
            if (angleDiff > 180) {
                angleDiff = 360 - angleDiff;
            }

            for (const key in ASPECT_INFO) {
                const aspectType = key as AspectType;
                const aspectInfo = ASPECT_INFO[aspectType];
                if (Math.abs(angleDiff - aspectInfo.angle) <= aspectInfo.orb) {
                    aspects.push({
                        planet1,
                        planet2,
                        type: aspectType,
                        orb: Math.abs(angleDiff - aspectInfo.angle)
                    });
                    break; 
                }
            }
        }
    }
    return aspects;
};

// FIX: Add missing findSignificantTransits function
export const findSignificantTransits = (natalChart: NatalChartData, transitingPlanets: PlanetPosition[]): Transit[] => {
    const significantTransits: Transit[] = [];
    const natalPoints = natalChart.planets;

    for (const transitingPlanet of transitingPlanets) {
        for (const natalPoint of natalPoints) {
            // Skip transits to the Midheaven for simplicity unless specified
            if (natalPoint.planet === 'Midheaven') continue;

            const transitingDegree = getAbsoluteDegree(transitingPlanet.sign, transitingPlanet.degree);
            const natalDegree = getAbsoluteDegree(natalPoint.sign, natalPoint.degree);

            let angleDiff = Math.abs(transitingDegree - natalDegree);
            if (angleDiff > 180) {
                angleDiff = 360 - angleDiff;
            }

            for (const key in ASPECT_INFO) {
                const aspectType = key as AspectType;
                const aspectInfo = ASPECT_INFO[aspectType];
                
                // For transits, we often focus on major aspects. Let's include sextile as it's often considered.
                if (['conjunction', 'opposition', 'square', 'trine', 'sextile'].includes(aspectType)) {
                    // Use a tighter orb for transits for more significance, e.g., 3 degrees.
                    // For now, we use the defined orbs but this could be stricter.
                    const orb = aspectInfo.orb;

                    if (Math.abs(angleDiff - aspectInfo.angle) <= orb) {
                        significantTransits.push({
                            transitingPlanet,
                            natalPoint,
                            type: aspectType,
                            orb: Math.abs(angleDiff - aspectInfo.angle)
                        });
                        break; 
                    }
                }
            }
        }
    }
    return significantTransits;
};
