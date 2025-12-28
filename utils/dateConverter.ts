
export const getJalaliInfo = (date: Date) => {
    try {
        const monthYear = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: 'long',
        }).format(date);
        const day = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            day: 'numeric',
        }).format(date);
        return { monthYear, day };
    } catch (e) {
        console.error("Jalali conversion failed", e);
        return { monthYear: "Error", day: "!" };
    }
};

export const getGregorianInfo = (date: Date, lang: string = 'en') => {
    const locale = lang === 'fa' ? 'fa-IR-u-ca-gregory' : lang;
    try {
        const monthYear = new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
        }).format(date);
        const day = new Intl.DateTimeFormat(locale, {
            day: 'numeric',
        }).format(date);
        return { monthYear, day };
    } catch (e) {
        console.error("Gregorian conversion failed", e);
        return { monthYear: "Error", day: "!" };
    }
};

export const getIslamicInfo = (date: Date) => {
    try {
        // Using fa-IR locale to get Persian script for month names
        const monthYear = new Intl.DateTimeFormat('fa-IR-u-ca-islamic', {
            year: 'numeric',
            month: 'long',
        }).format(date);
        const day = new Intl.DateTimeFormat('fa-IR-u-ca-islamic', {
            day: 'numeric',
        }).format(date);
        return { monthYear, day };
    } catch (e) {
        // Fallback for environments that might not support islamic calendar
        console.error("Islamic conversion failed, falling back.", e);
         try {
            const fallback = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
            const parts = fallback.split(' ');
            return { monthYear: `${parts[1]} ${parts[2]}`, day: parts[0] };
         } catch (e2) {
            console.error("Islamic conversion fallback failed", e2);
            return { monthYear: "Error", day: "!" };
         }
    }
};

export const parseFlexibleDate = (dateStr: string): { day: string; month: string; year: string } | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;

    const [p1, p2, p3] = parts.map(p => p.trim());

    const isYear = (s: string) => /^(13|14|19|20)\d{2}$/.test(s);

    if (isYear(p1)) { // YYYY/MM/DD
        return { year: p1, month: p2, day: p3 };
    }
    if (isYear(p3)) { // DD/MM/YYYY
        return { year: p3, month: p2, day: p1 };
    }
    
    return null; // Could not determine format
};

/**
 * Converts a Jalali date string (e.g., "1370/05/24") to a Gregorian Date object.
 * NOTE: This is a simplified implementation for demonstration. For production,
 * a robust library like `date-fns-jalali` is recommended.
 * This implementation assumes the input is a valid Jalali date.
 * @param jalaliDateString The date string in "YYYY/MM/DD" format.
 * @returns A Gregorian Date object.
 */
export const jalaliToGregorian = (jalaliDateString: string): Date | null => {
    const parsed = parseFlexibleDate(jalaliDateString);
    if (!parsed) return null;

    let jy = parseInt(parsed.year);
    let jm = parseInt(parsed.month);
    let jd = parseInt(parsed.day);
    
    // A simplified conversion logic. For high accuracy, a dedicated library is required.
    let gy = jy + 621;

    const jalaliMonthStartInGregorian = [
        [3, 21], [4, 21], [5, 22], [6, 22], [7, 23], [8, 23],
        [9, 23], [10, 23], [11, 22], [12, 22], [1, 21], [2, 20]
    ];
    
    const [gMonth, gDay] = jalaliMonthStartInGregorian[jm - 1];
    // Create a UTC date to avoid timezone issues during calculation
    const epoch = new Date(Date.UTC(gy, gMonth - 1, gDay));
    epoch.setUTCDate(epoch.getUTCDate() + jd - 1);

    return epoch;
};

/**
 * Converts Jalali date and time strings to a standard Gregorian UTC Date object.
 * @param jalaliDate The Jalali date string (e.g., "1370/05/24").
 * @param jalaliTime The time string (e.g., "18:45").
 * @returns A Gregorian Date object in UTC, or null if parsing fails.
 */
export const parseJalaliDateTime = (jalaliDate: string, jalaliTime: string): Date | null => {
    const gregorianDate = jalaliToGregorian(jalaliDate);
    if (!gregorianDate) return null;

    const timeParts = jalaliTime.split(':');
    if (timeParts.length < 2) return gregorianDate; // Return date only if time is invalid

    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return gregorianDate; // Return date part if time components are invalid
    }

    // Set time on the UTC date object
    gregorianDate.setUTCHours(hours);
    gregorianDate.setUTCMinutes(minutes);
    gregorianDate.setUTCSeconds(0);
    gregorianDate.setUTCMilliseconds(0);
    
    return gregorianDate;
};
