
import { parseFlexibleDate } from './dateConverter';
import { ZodiacSignName } from '../types';

export function getZodiacSign(dateStr: string): ZodiacSignName | null {
    const parsed = parseFlexibleDate(dateStr);
    if (!parsed) return null;

    // Check if it's likely Jalali or Gregorian
    const year = parseInt(parsed.year);
    const month = parseInt(parsed.month);
    const day = parseInt(parsed.day);

    if (year < 1500) { // Likely Jalali
        // This is a common approximation for Jalali calendar.
        switch(month) {
            case 1: return day <= 31 ? 'Aries' : null; // Farvardin
            case 2: return day <= 31 ? 'Taurus' : null; // Ordibehesht
            case 3: return day <= 31 ? 'Gemini' : null; // Khordad
            case 4: return day <= 31 ? 'Cancer' : null; // Tir
            case 5: return day <= 31 ? 'Leo' : null; // Mordad
            case 6: return day <= 31 ? 'Virgo' : null; // Shahrivar
            case 7: return day <= 30 ? 'Libra' : null; // Mehr
            case 8: return day <= 30 ? 'Scorpio' : null; // Aban
            case 9: return day <= 30 ? 'Sagittarius' : null; // Azar
            case 10: return day <= 30 ? 'Capricorn' : null; // Dey
            case 11: return day <= 30 ? 'Aquarius' : null; // Bahman
            case 12: return day <= 30 ? 'Pisces' : null; // Esfand (including leap years for simplicity)
            default: return null;
        }
    } else { // Likely Gregorian
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return 'Gemini';
        if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return 'Cancer';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return 'Libra';
        if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) return 'Scorpio';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
        return null;
    }
}
