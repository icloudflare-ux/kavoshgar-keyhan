
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

const toEnglishDigits = (s: string): string =>
    s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
     .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

/**
 * Converts a Jalali date string (e.g., "1370/05/24") to a Gregorian Date object.
 * Uses the platform's built-in Persian calendar (Intl `fa-IR-u-ca-persian`)
 * to find the exact Gregorian date, so leap years and Nowruz (Mar 20/21)
 * are handled correctly without a hand-rolled approximation table.
 * @param jalaliDateString The date string in "YYYY/MM/DD" format.
 * @returns A Gregorian Date object (UTC midnight), or null if invalid.
 */
export const jalaliToGregorian = (jalaliDateString: string): Date | null => {
    const parsed = parseFlexibleDate(toEnglishDigits(jalaliDateString));
    if (!parsed) return null;

    if (![parsed.year, parsed.month, parsed.day].every(p => /^\d+$/.test(p))) return null;
    const jy = Number(parsed.year);
    const jm = parseInt(parsed.month, 10);
    const jd = parseInt(parsed.day, 10);

    // Validate numeric ranges — return null for invalid dates instead of crashing.
    if (isNaN(jy) || isNaN(jm) || isNaN(jd)) return null;
    if (jm < 1 || jm > 12) return null;
    if (jd < 1 || jd > 31) return null;

    try {
        const fmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timeZone: 'UTC',
        });
        // Jalali year jy starts around March of Gregorian year jy+621.
        // Search forward from March 1 of that year (covers Esfand in jy+622).
        const start = Date.UTC(jy + 621, 2, 1);
        for (let offset = 0; offset < 400; offset += 1) {
            const candidate = new Date(start + offset * 86400000);
            const parts = fmt.formatToParts(candidate);
            const get = (type: string) => {
                const part = parts.find((p) => p.type === type);
                return part ? parseInt(toEnglishDigits(part.value), 10) : NaN;
            };
            if (get('year') === jy && get('month') === jm && get('day') === jd) {
                return candidate;
            }
            // Stop once we've passed the target Jalali year entirely.
            if (get('year') > jy) break;
        }
        return null;
    } catch {
        return null;
    }
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
