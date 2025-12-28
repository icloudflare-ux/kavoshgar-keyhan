
import { useMemo } from 'react';

type IntentionQuality = 'عالی' | 'خوب' | 'ضعیف' | 'بد';

export const usePlanetaryHoursData = () => {
    const planets = useMemo(() => [
        { 
            name: 'Saturn', 
            persian: 'زحل', 
            icon: '🪐', 
            auspiciousness: 'نحس اکبر', 
            auspiciousnessKey: 'quality_major_malefic', 
            recommendation: 'امور ساختمانی، کشاورزی، امور مربوط به افراد مسن، صبر و استقامت',
            intentions: { mohabbat: 'بد', rizq: 'بد', zabanband: 'عالی' } as Record<string, IntentionQuality>
        },
        { 
            name: 'Jupiter', 
            persian: 'مشتری', 
            icon: '✨', 
            auspiciousness: 'سعد اکبر', 
            auspiciousnessKey: 'quality_major_benefic', 
            recommendation: 'امور مالی، شروع کسب و کار، امور قانونی، ازدواج، دانش‌اندوزی',
            intentions: { mohabbat: 'عالی', rizq: 'عالی', zabanband: 'ضعیف' } as Record<string, IntentionQuality>
        },
        { 
            name: 'Mars', 
            persian: 'مریخ', 
            icon: '🔥', 
            auspiciousness: 'نحس اصغر', 
            auspiciousnessKey: 'quality_minor_malefic', 
            recommendation: 'امور ورزشی، رقابت، امور نظامی، جراحی، کارهای نیازمند شجاعت',
            intentions: { mohabbat: 'بد', rizq: 'ضعیف', zabanband: 'خوب' } as Record<string, IntentionQuality>
        },
        { 
            name: 'Sun', 
            persian: 'خورشید', 
            icon: '☀️', 
            auspiciousness: 'سعد (نیر اعظم)', 
            auspiciousnessKey: 'quality_sun_ruler', 
            recommendation: 'ملاقات با افراد مهم، درخواست از مقامات، امور مربوط به شهرت و رهبری',
            intentions: { mohabbat: 'خوب', rizq: 'خوب', zabanband: 'خوب' } as Record<string, IntentionQuality>
        },
        { 
            name: 'Venus', 
            persian: 'زهره', 
            icon: '💖', 
            auspiciousness: 'سعد اصغر', 
            auspiciousnessKey: 'quality_minor_benefic', 
            recommendation: 'امور عاطفی، ازدواج، خرید و فروش، هنر، تفریح و لذت',
            intentions: { mohabbat: 'عالی', rizq: 'خوب', zabanband: 'ضعیف' } as Record<string, IntentionQuality>
        },
        { 
            name: 'Mercury', 
            persian: 'عطارد', 
            icon: '✍️', 
            auspiciousness: 'ممتزج', 
            auspiciousnessKey: 'quality_neutral', 
            recommendation: 'نوشتن، مطالعه، مذاکره، امور تجاری، یادگیری، کارهای دقیق',
            intentions: { mohabbat: 'خوب', rizq: 'خوب', zabanband: 'خوب' } as Record<string, IntentionQuality>
        },
        { 
            name: 'Moon', 
            persian: 'ماه', 
            icon: '🌙', 
            auspiciousness: 'سعد (نیر اصغر)', 
            auspiciousnessKey: 'quality_moon_ruler', 
            recommendation: 'امور روزمره، سفر کوتاه، امور خانگی، ارتباط با عموم مردم',
            intentions: { mohabbat: 'خوب', rizq: 'خوب', zabanband: 'ضعیف' } as Record<string, IntentionQuality>
        },
    ], []);

    const dayNames = useMemo(() => ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'], []);
    
    return { planets, dayNames };
};

const staticData = {
    chaldeanOrder: ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'],
    dayStarters: [
      'Saturn',    // شنبه
      'Sun',       // یک‌شنبه
      'Moon',      // دوشنبه
      'Mars',      // سه‌شنبه
      'Mercury',   // چهارشنبه
      'Jupiter',   // پنج‌شنبه
      'Venus',     // جمعه
    ],
};

export const generateHoursForDay = (dayIndex: number, planets: ReturnType<typeof usePlanetaryHoursData>['planets']) => {
    const planetMap = new Map(planets.map(p => [p.name, p]));
    const startPlanetName = staticData.dayStarters[dayIndex];
    const startIndex = staticData.chaldeanOrder.indexOf(startPlanetName);
    
    const allHours = [];
    for (let i = 0; i < 24; i++) {
        const planetIndex = (startIndex + i) % staticData.chaldeanOrder.length;
        const planetName = staticData.chaldeanOrder[planetIndex];
        allHours.push(planetMap.get(planetName));
    }
    
    return {
        dayHours: allHours.slice(0, 12),
        nightHours: allHours.slice(12, 24),
    };
};
