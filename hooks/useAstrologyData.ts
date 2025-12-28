
import { useState, useEffect } from 'react';
import { NatalChartData, PlanetPosition, HouseCusp } from '../types';
import { jalaliToGregorian } from '../utils/dateConverter';

// --- 2. موتور محاسباتی (آزمایشی) ---
// این تابع یک تماس به یک موتور واقعی نجومی مانند Swiss Ephemeris را شبیه‌سازی می‌کند.
// در حال حاضر، یک مجموعه داده ثابت را بدون توجه به تاریخ برمی‌گرداند.
const calculatePlanetPositions = async (date: Date): Promise<NatalChartData> => {
    console.log('Calculating astrological data for date:', date); // برای نمایش اینکه تاریخ در حال استفاده است
    
    // شبیه‌سازی تأخیر شبکه
    await new Promise(resolve => setTimeout(resolve, 700));

    // داده‌های آزمایشی. در یک سناریوی واقعی، این داده‌ها بر اساس تاریخ محاسبه می‌شوند.
    const mockPlanets: PlanetPosition[] = [
        { planet: 'Sun', sign: 'Leo', degree: 15.5 },
        { planet: 'Moon', sign: 'Taurus', degree: 22.1 },
        { planet: 'Mercury', sign: 'Virgo', degree: 2.8 },
        { planet: 'Venus', sign: 'Cancer', degree: 28.3 },
        { planet: 'Mars', sign: 'Aries', degree: 10.2 },
        { planet: 'Jupiter', sign: 'Sagittarius', degree: 5.9 },
        { planet: 'Saturn', sign: 'Aquarius', degree: 19.7 },
        { planet: 'Ascendant', sign: 'Scorpio', degree: 8.4 },
    ];
    
    const mockHouses: HouseCusp[] = [
        { house: 1, sign: 'Scorpio', degree: 8.4 },
        { house: 2, sign: 'Sagittarius', degree: 12 },
        { house: 3, sign: 'Capricorn', degree: 18 },
        { house: 4, sign: 'Aquarius', degree: 22 },
        { house: 5, sign: 'Pisces', degree: 24 },
        { house: 6, sign: 'Aries', degree: 21 },
        { house: 7, sign: 'Taurus', degree: 8.4 },
        { house: 8, sign: 'Gemini', degree: 12 },
        { house: 9, sign: 'Cancer', degree: 18 },
        { house: 10, sign: 'Leo', degree: 22 },
        { house: 11, sign: 'Virgo', degree: 24 },
        { house: 12, sign: 'Libra', degree: 21 },
    ];

    return { planets: mockPlanets, houses: mockHouses };
};


// --- 4. هوک سفارشی ---
export const useAstrologyData = (jalaliDateString: string | null) => {
    const [chartData, setChartData] = useState<NatalChartData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const calculate = async () => {
            if (!jalaliDateString) {
                setChartData(null);
                return;
            }

            setIsLoading(true);
            setError(null);
            
            // ۱. تبدیل تاریخ
            const gregorianDate = jalaliToGregorian(jalaliDateString);
            if (!gregorianDate) {
                setError('فرمت تاریخ شمسی نامعتبر است.');
                setIsLoading(false);
                return;
            }
            
            try {
                // ۲. محاسبه موقعیت‌ها
                const rawData = await calculatePlanetPositions(gregorianDate);
                // ۳. تنظیم خروجی استاندارد
                setChartData(rawData);
            } catch (err) {
                setError('خطا در محاسبه داده‌های نجومی.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        calculate();
    }, [jalaliDateString]);

    return { chartData, isLoading, error };
};
