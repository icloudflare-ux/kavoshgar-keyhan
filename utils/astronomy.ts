
// --- Astronomical Sunrise/Sunset Calculation ---

// Helper functions to convert between degrees and radians
const toRadians = (deg: number) => deg * (Math.PI / 180);
const toDegrees = (rad: number) => rad * (180 / Math.PI);

// Function to get the day of the year (1-366)
const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getUTCFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/**
 * Calculates sunrise and sunset times for a given date and location using astronomical formulas.
 * This implementation is based on the algorithm from the NOAA Solar Calculations page.
 * All calculations are performed in UTC.
 * @param date The date for which to calculate sunrise/sunset.
 * @param latitude The latitude of the location.
 * @param longitude The longitude of the location.
 * @returns { sunrise: Date, sunset: Date } in UTC.
 */
export const calculateSunriseSunset = (date: Date, latitude: number, longitude: number): { sunrise: Date, sunset: Date } => {
    const N = getDayOfYear(date);

    // Function to calculate solar transit, sunrise, or sunset time in UTC hours
    const calculateTime = (isSunrise: boolean) => {
        const lngHour = longitude / 15;
        const approxTime = N + (((isSunrise ? 6 : 18) - lngHour) / 24);

        // Sun's mean anomaly
        const M = (0.9856 * approxTime) - 3.289;

        // Sun's true longitude
        let L = M + (1.916 * Math.sin(toRadians(M))) + (0.020 * Math.sin(toRadians(2 * M))) + 282.634;
        L = (L + 360) % 360;

        // Sun's right ascension (RA)
        let RA = toDegrees(Math.atan(0.91764 * Math.tan(toRadians(L))));
        RA = (RA + 360) % 360;
        const Lquadrant = Math.floor(L / 90) * 90;
        const RAquadrant = Math.floor(RA / 90) * 90;
        RA = (RA + (Lquadrant - RAquadrant)) / 15;

        // Sun's declination
        const sinDec = 0.39782 * Math.sin(toRadians(L));
        const cosDec = Math.cos(Math.asin(sinDec));
        
        // Sun's local hour angle
        const zenith = 90.833;
        const cosH = (Math.cos(toRadians(zenith)) - (sinDec * Math.sin(toRadians(latitude)))) / (cosDec * Math.cos(toRadians(latitude)));

        if (cosH > 1 || cosH < -1) {
            // No sunrise/sunset (polar day/night)
            return NaN;
        }

        const H = (isSunrise ? 360 - toDegrees(Math.acos(cosH)) : toDegrees(Math.acos(cosH))) / 15;

        // Local mean time
        const T = H + RA - (0.06571 * approxTime) - 6.622;

        // Convert to UTC hours
        let UT = T - lngHour;
        UT = (UT + 24) % 24;

        return UT;
    };
    
    const sunriseUTC = calculateTime(true);
    const sunsetUTC = calculateTime(false);

    const createUTCDate = (hours: number) => {
        if (isNaN(hours)) return new Date(NaN);
        const d = new Date(date);
        d.setUTCHours(0, 0, 0, 0);
        d.setTime(d.getTime() + hours * 3600 * 1000);
        return d;
    };

    return {
        sunrise: createUTCDate(sunriseUTC),
        sunset: createUTCDate(sunsetUTC),
    };
};

// --- Live Sky Map Calculations ---

/**
 * Calculates the Local Sidereal Time (LST) for a given date and longitude.
 * LST is crucial for determining which part of the sky is overhead.
 * @param date The current Date object.
 * @param longitude The observer's longitude.
 * @returns LST in degrees.
 */
export const calculateLST = (date: Date, longitude: number): number => {
    const JD = (date.getTime() / 86400000) + 2440587.5; // Julian Date
    const d = JD - 2451545.0; // Days since J2000.0

    // Greenwich Mean Sidereal Time (GMST)
    const GMST = 18.697374558 + 24.06570982441908 * d;
    const GMST_hours = GMST % 24;

    // Local Sidereal Time in hours
    const LST_hours = GMST_hours + longitude / 15;

    return (LST_hours * 15) % 360; // Convert to degrees
};

/**
 * Converts celestial coordinates (Right Ascension, Declination) to horizontal coordinates (Azimuth, Altitude).
 * @param ra Right Ascension in hours.
 * @param dec Declination in degrees.
 * @param lat Observer's latitude in degrees.
 * @param lst Local Sidereal Time in degrees.
 * @returns { az: Azimuth, alt: Altitude } in degrees.
 */
export const raDecToAzAlt = (ra: number, dec: number, lat: number, lst: number): { az: number, alt: number } => {
    const raDeg = ra * 15;
    const ha = toRadians(lst - raDeg); // Hour Angle in radians
    const decRad = toRadians(dec);
    const latRad = toRadians(lat);

    // Altitude calculation
    const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(ha);
    const alt = Math.asin(sinAlt);

    // Azimuth calculation
    const cosAz = (Math.sin(decRad) - Math.sin(alt) * Math.sin(latRad)) / (Math.cos(alt) * Math.cos(latRad));
    let az = Math.acos(cosAz);

    if (Math.sin(ha) > 0) {
        az = 2 * Math.PI - az;
    }

    return { az: toDegrees(az), alt: toDegrees(alt) };
};
