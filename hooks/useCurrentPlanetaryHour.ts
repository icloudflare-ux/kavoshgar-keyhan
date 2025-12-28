
import React, { useMemo } from 'react';
import { usePreciseLocation } from './usePreciseLocation';
import { usePlanetaryHoursData, generateHoursForDay } from '../data/planetaryHoursData';
import { calculateSunriseSunset } from '../utils/astronomy';

const getPersianDayIndex = (date: Date = new Date()) => (date.getDay() + 1) % 7;

export const useCurrentPlanetaryHour = () => {
    const { location, status } = usePreciseLocation();
    const { planets } = usePlanetaryHoursData();
    const [now, setNow] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 10000); // Check every 10s
        return () => clearInterval(timer);
    }, []);

    const currentHour = useMemo(() => {
        if (status !== 'success' || !location) {
            return null;
        }

        const nowMs = now.getTime();
        
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todaySunrise = calculateSunriseSunset(today, location.latitude, location.longitude).sunrise;

        let dayIndex, sunrise, sunset, nextSunrise;
        
        if (nowMs >= todaySunrise.getTime()) {
            // After today's sunrise: use today's data
            dayIndex = getPersianDayIndex(today);
            const todayTimes = calculateSunriseSunset(today, location.latitude, location.longitude);
            sunrise = todayTimes.sunrise;
            sunset = todayTimes.sunset;
            nextSunrise = calculateSunriseSunset(tomorrow, location.latitude, location.longitude).sunrise;
        } else {
            // Before today's sunrise: use yesterday's data
            dayIndex = getPersianDayIndex(yesterday);
            const yesterdayTimes = calculateSunriseSunset(yesterday, location.latitude, location.longitude);
            sunrise = yesterdayTimes.sunrise;
            sunset = yesterdayTimes.sunset;
            nextSunrise = todaySunrise; // which is today's sunrise
        }

        if (isNaN(sunrise.getTime()) || isNaN(sunset.getTime()) || isNaN(nextSunrise.getTime())) {
            return null;
        }

        const { dayHours, nightHours } = generateHoursForDay(dayIndex, planets);
            
        const dayDurationMs = sunset.getTime() - sunrise.getTime();
        const nightDurationMs = nextSunrise.getTime() - sunset.getTime();

        // Safety check for invalid durations (e.g., polar regions)
        if (dayDurationMs <= 0 || nightDurationMs <= 0) {
            return null;
        }

        const dayHourLengthMs = dayDurationMs / 12;
        const nightHourLengthMs = nightDurationMs / 12;

        const allHours = [];
        for (let i = 0; i < 12; i++) {
            allHours.push({
                planet: dayHours[i],
                start: new Date(sunrise.getTime() + i * dayHourLengthMs),
                end: new Date(sunrise.getTime() + (i + 1) * dayHourLengthMs),
            });
        }
        for (let i = 0; i < 12; i++) {
            allHours.push({
                planet: nightHours[i],
                start: new Date(sunset.getTime() + i * nightHourLengthMs),
                end: new Date(sunset.getTime() + (i + 1) * nightHourLengthMs),
            });
        }
        
        return allHours.find(hour => nowMs >= hour.start.getTime() && nowMs < hour.end.getTime()) || null;

    }, [location, status, planets, now]);

    return currentHour;
};
