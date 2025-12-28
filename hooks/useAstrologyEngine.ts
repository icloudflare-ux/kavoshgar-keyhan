
import { useState, useEffect } from 'react';
import { parseJalaliDateTime } from '../utils/dateConverter';
import { getCoordinatesForCity } from '../utils/location';
import { calculatePlanetaryPositions, PlanetaryPositionsMap } from '../services/astrologyEngine';

// Add local interface as utils/location.ts is not provided for modification
interface Coordinates {
    latitude: number;
    longitude: number;
}

interface AstrologyEngineInput {
    jalaliDate: string | null;
    jalaliTime: string | null;
    city: string | null;
    latitude?: number | null;
    longitude?: number | null;
}

/**
 * A custom hook that serves as a professional astrology calculation service.
 * It handles date conversion, location lookup, and calls the calculation engine.
 *
 * @param input - An object containing jalaliDate, jalaliTime, and city.
 * @returns An object with zodiacData, isLoading status, and any errors.
 */
export const useAstrologyEngine = (input: AstrologyEngineInput | null) => {
    const { jalaliDate, jalaliTime, city, latitude, longitude } = input || {
        jalaliDate: null,
        jalaliTime: null,
        city: null,
        latitude: null,
        longitude: null,
    };

    const [zodiacData, setZodiacData] = useState<PlanetaryPositionsMap | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const processRequest = async () => {
            if (!jalaliDate || !jalaliTime || !city) {
                // Not enough data to start, reset to initial state
                setZodiacData(null);
                setIsLoading(false);
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);
            setZodiacData(null); // Clear previous data before new calculation

            // 1. Manage Date
            const gregorianDateTime = parseJalaliDateTime(jalaliDate, jalaliTime);
            if (!gregorianDateTime) {
                setError("تاریخ یا زمان وارد شده نامعتبر است.");
                setIsLoading(false);
                return;
            }

            // 2. Extract Location Coordinates
            let coordinates: Coordinates | null = null;
            if (latitude != null && longitude != null) {
                coordinates = { latitude, longitude };
            } else if (city) {
                coordinates = getCoordinatesForCity(city);
            }


            if (!coordinates) {
                setError(`مختصات شهر '${city}' یافت نشد. لطفاً نام شهر را بررسی کنید.`);
                setIsLoading(false);
                return;
            }

            // 3. Run the Engine
            try {
                const positions = await calculatePlanetaryPositions(gregorianDateTime, coordinates);
                setZodiacData(positions);
            } catch (e) {
                console.error("Astrology engine calculation failed:", e);
                setError("خطایی در موتور محاسباتی رخ داد.");
            } finally {
                setIsLoading(false);
            }
        };

        processRequest();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jalaliDate, jalaliTime, city, latitude, longitude]);

    return { zodiacData, isLoading, error };
};
