
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Utils to test
import { jalaliToGregorian } from '../utils/dateConverter';
import { calculateAspects, degreeToSign, getAbsoluteDegree } from '../utils/astrology';
import { PlanetPosition } from '../types';
import { useAstrologyEngine } from '../hooks/useAstrologyEngine';


describe('Kaavishgar-e-Keyhan Astronomical Engine Tests', () => {

    // --- Scenario 1: Date Conversion Accuracy ---
    describe('Date Conversion (jalaliToGregorian)', () => {
        it('should correctly convert a Jalali leap year date (30 Esfand)', () => {
            const jalaliLeapDate = '1399/12/30';
            const gregorianDate = jalaliToGregorian(jalaliLeapDate);
            // 1399/12/30 corresponds to 2021-03-20
            expect(gregorianDate?.getUTCFullYear()).toBe(2021);
            expect(gregorianDate?.getUTCMonth()).toBe(2); // 0-indexed for March
            expect(gregorianDate?.getUTCDate()).toBe(20);
        });

        it('should correctly convert the first day of a new Jalali year (1 Farvardin)', () => {
            const jalaliNewYear = '1400/01/01';
            const gregorianDate = jalaliToGregorian(jalaliNewYear);
            // 1400/01/01 corresponds to 2021-03-21
            expect(gregorianDate?.getUTCFullYear()).toBe(2021);
            expect(gregorianDate?.getUTCMonth()).toBe(2);
            expect(gregorianDate?.getUTCDate()).toBe(21);
        });

        it('should return null for invalid date formats', () => {
            expect(jalaliToGregorian('invalid-date')).toBeNull();
            expect(jalaliToGregorian('1400/13/01')).toBeNull(); // Simplified check, our parser is basic
        });
    });

    // --- Scenario 2: Degree Calculation ---
    describe('Degree Calculation (degreeToSign & getAbsoluteDegree)', () => {
        // Tests for degreeToSign
        it('should identify 0 degrees as Aries 0°', () => {
            const result = degreeToSign(0);
            expect(result.sign).toBe('Aries');
            expect(result.signDegree).toBeCloseTo(0);
        });
        
        it('should correctly identify a mid-zodiac degree (135°)', () => {
            const result = degreeToSign(135); // 135 = 4 * 30 + 15 -> Leo 15°
            expect(result.sign).toBe('Leo');
            expect(result.signDegree).toBeCloseTo(15);
        });
        
        it('should wrap around from 359.9 to 0.1 degrees correctly', () => {
            const initialDegree = 359.9;
            const movement = 0.2;
            const newDegree = (initialDegree + movement) % 360; // Result is ~0.1

            const result = degreeToSign(newDegree);
            expect(result.sign).toBe('Aries');
            expect(result.signDegree).toBeCloseTo(0.1);
        });

        it('should correctly identify the last degree of Pisces', () => {
            const result = degreeToSign(359.99);
            expect(result.sign).toBe('Pisces');
            expect(result.signDegree).toBeCloseTo(29.99);
        });

        // Tests for getAbsoluteDegree
        it('should convert Aries 0° to 0', () => {
            expect(getAbsoluteDegree('Aries', 0)).toBeCloseTo(0);
        });
        
        it('should convert Leo 15° to 135', () => {
            expect(getAbsoluteDegree('Leo', 15)).toBeCloseTo(135); // Leo is the 5th sign (index 4) -> 4 * 30 + 15
        });

        it('should convert Pisces 29.9° to 359.9', () => {
            expect(getAbsoluteDegree('Pisces', 29.9)).toBeCloseTo(359.9); // Pisces is the 12th sign (index 11) -> 11 * 30 + 29.9
        });
    });


    // --- Scenario 3: Aspect Detection ---
    describe('Aspect Detection (calculateAspects)', () => {
        it('should correctly detect a Conjunction (0 degrees)', () => {
            const planets: PlanetPosition[] = [
                { planet: 'Sun', sign: 'Aries', degree: 10.5 },
                { planet: 'Moon', sign: 'Aries', degree: 12.1 }, // 1.6 orb
            ];
            const aspects = calculateAspects(planets);
            expect(aspects).toHaveLength(1);
            expect(aspects[0].type).toBe('conjunction');
            expect(aspects[0].orb).toBeCloseTo(1.6);
        });

        it('should correctly detect a Sextile (60 degrees)', () => {
            const planets: PlanetPosition[] = [
                { planet: 'Mars', sign: 'Taurus', degree: 25 },    // Absolute: 55
                { planet: 'Venus', sign: 'Cancer', degree: 25 },   // Absolute: 115
            ];
            const aspects = calculateAspects(planets);
            expect(aspects).toHaveLength(1);
            expect(aspects[0].type).toBe('sextile');
            expect(aspects[0].orb).toBeCloseTo(0);
        });

        it('should correctly detect an Opposition (180 degrees)', () => {
            const planets: PlanetPosition[] = [
                { planet: 'Sun', sign: 'Aries', degree: 10 },    // Absolute: 10
                { planet: 'Moon', sign: 'Libra', degree: 10 },   // Absolute: 180 + 10 = 190
            ];
            const aspects = calculateAspects(planets);
            expect(aspects).toHaveLength(1);
            expect(aspects[0].type).toBe('opposition');
            expect(aspects[0].orb).toBeCloseTo(0);
        });

        it('should correctly detect a Trine (120 degrees)', () => {
            const planets: PlanetPosition[] = [
                { planet: 'Mars', sign: 'Leo', degree: 5 },      // Absolute: 120 + 5 = 125
                { planet: 'Jupiter', sign: 'Sagittarius', degree: 5 }, // Absolute: 240 + 5 = 245
            ];
            const aspects = calculateAspects(planets);
            expect(aspects).toHaveLength(1);
            expect(aspects[0].type).toBe('trine');
            expect(aspects[0].orb).toBeCloseTo(0);
        });
        
        it('should correctly detect a Square (90 degrees) with orb', () => {
            const planets: PlanetPosition[] = [
                { planet: 'Venus', sign: 'Taurus', degree: 15 },    // Absolute: 30 + 15 = 45
                { planet: 'Saturn', sign: 'Leo', degree: 20 },      // Absolute: 120 + 20 = 140
            ]; // Difference = 95 degrees, which is within 8-degree orb for a square
            const aspects = calculateAspects(planets);
            expect(aspects).toHaveLength(1);
            expect(aspects[0].type).toBe('square');
            expect(aspects[0].orb).toBeCloseTo(5);
        });

        it('should detect an aspect that wraps around the 0/360 degree point', () => {
            const planets: PlanetPosition[] = [
                { planet: 'Sun', sign: 'Pisces', degree: 28 },    // Absolute: 358
                { planet: 'Moon', sign: 'Gemini', degree: 1 },    // Absolute: 61
            ]; // Difference = 63 degrees
            const aspects = calculateAspects(planets);
            expect(aspects).toHaveLength(1);
            expect(aspects[0].type).toBe('sextile');
            expect(aspects[0].orb).toBeCloseTo(3);
        });

        it('should not detect an aspect for a 45-degree difference', () => {
            const planets: PlanetPosition[] = [
                { planet: 'Sun', sign: 'Aries', degree: 10 },    // Absolute: 10
                { planet: 'Moon', sign: 'Taurus', degree: 25 },  // Absolute: 30 + 25 = 55
            ];
            const aspects = calculateAspects(planets);
            expect(aspects).toHaveLength(0);
        });
    });


    // --- Scenario 4: Hook Stability ---
    describe('Hook Stability (useAstrologyEngine)', () => {
        it('should not crash and should return default values with incomplete input', async () => {
            const { result } = renderHook(() => useAstrologyEngine({
                jalaliDate: '1370/01/01',
                jalaliTime: null, // Incomplete data
                city: 'تهران',
            }));

            // It should not be loading because it shouldn't have started the process
            expect(result.current.isLoading).toBe(false);
            
            // Wait for any potential async state updates to settle
            await waitFor(() => {
                // The hook should gracefully handle the null input without starting
                expect(result.current.zodiacData).toBeNull();
                expect(result.current.error).toBeNull();
                expect(result.current.isLoading).toBe(false);
            });
        });
    });
});
