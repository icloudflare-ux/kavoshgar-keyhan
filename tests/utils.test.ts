
import { describe, it, expect } from 'vitest';
import { calculateAbjad } from '../utils/abjad';
import { getZodiacSign } from '../utils/zodiac';

describe('Core Utility Function Tests', () => {

    // --- Testing Abjad Calculation ---
    describe('calculateAbjad', () => {
        it('should correctly calculate the Abjad value of a simple Arabic name', () => {
            expect(calculateAbjad('محمد')).toBe(92); // 40+8+40+4
            expect(calculateAbjad('علی')).toBe(110); // 70+30+10
        });

        it('should correctly handle Persian characters (پ, چ, ژ, گ)', () => {
            expect(calculateAbjad('پژمان')).toBe(100); // 2+7+40+1+50
        });

        it('should handle different forms of letters like aleph and ya', () => {
            expect(calculateAbjad('اآأ')).toBe(3); // 1+1+1
            expect(calculateAbjad('یيئ')).toBe(30); // 10+10+10
        });

        it('should return 0 for an empty string', () => {
            expect(calculateAbjad('')).toBe(0);
        });

        it('should ignore spaces and non-Arabic/Persian characters', () => {
            expect(calculateAbjad('مرتضی حق وردی')).toBe(1778);
            expect(calculateAbjad('Test 123')).toBe(0);
        });
    });

    // --- Testing Zodiac Sign Calculation ---
    describe('getZodiacSign', () => {
        it('should correctly identify zodiac signs for Jalali dates', () => {
            expect(getZodiacSign('1403/01/15')).toBe('Aries');    // Farvardin
            expect(getZodiacSign('1370/05/24')).toBe('Leo');      // Mordad
            expect(getZodiacSign('1399/12/30')).toBe('Pisces');   // Esfand (Leap Year)
        });

        it('should correctly identify zodiac signs for Gregorian dates', () => {
            expect(getZodiacSign('1991/08/16')).toBe('Leo');
            expect(getZodiacSign('2024/10/25')).toBe('Scorpio');
            expect(getZodiacSign('2000/03/20')).toBe('Pisces'); // Cusp date
            expect(getZodiacSign('2000/03/21')).toBe('Aries');   // Cusp date
        });
        
        it('should handle different date formats like DD/MM/YYYY', () => {
            expect(getZodiacSign('16/08/1991')).toBe('Leo');
        });

        it('should return null for invalid or ambiguous date strings', () => {
            expect(getZodiacSign('invalid-date')).toBeNull();
            expect(getZodiacSign('13/13/2024')).toBeNull();
        });
    });

});
