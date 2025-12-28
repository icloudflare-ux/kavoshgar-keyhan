
export interface Coordinates {
    latitude: number;
    longitude: number;
}

const cityCoordinates: Record<string, Coordinates> = {
    'تهران': { latitude: 35.6892, longitude: 51.3890 },
    'مشهد': { latitude: 36.2970, longitude: 59.6062 },
    'اصفهان': { latitude: 32.6546, longitude: 51.6680 },
    'شیراز': { latitude: 29.5918, longitude: 52.5841 },
    'تبریز': { latitude: 38.0700, longitude: 46.2900 },
    'کرج': { latitude: 35.8327, longitude: 50.9915 },
    'اهواز': { latitude: 31.3183, longitude: 48.6706 },
    'کرمانشاه': { latitude: 34.3142, longitude: 47.0650 },
    'ارومیه': { latitude: 37.5527, longitude: 45.0756 },
    'یزد': { latitude: 31.8974, longitude: 54.3675 },
};

/**
 * Retrieves the geographical coordinates for a given city name.
 * @param city The name of the city in Persian.
 * @returns A Coordinates object { latitude, longitude } or null if not found.
 */
export function getCoordinatesForCity(city: string): Coordinates | null {
    const normalizedCity = city.trim();
    return cityCoordinates[normalizedCity] || null;
}
