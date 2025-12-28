
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Card from './common/Card';
import { usePlanetaryHoursData, generateHoursForDay } from '../data/planetaryHoursData';
import Spinner from './common/Spinner';
import { useTimeZone } from '../contexts/TimeZoneContext';
import useUnlockOnScroll from '../hooks/useUnlockOnScroll';
import PlanetaryClock from './PlanetaryClock';
import { usePreciseLocation } from '../hooks/usePreciseLocation';
import { calculateSunriseSunset } from '../utils/astronomy';

const getPersianDayIndex = () => (new Date().getDay() + 1) % 7;

const PlanetaryHours: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    useUnlockOnScroll(sectionRef, 'copernican_revolution');
    const { planets, dayNames } = usePlanetaryHoursData();

    const { formattedTimeZone } = useTimeZone();
    const { location, error: locationError, status: locationStatus } = usePreciseLocation();

    const [selectedDay, setSelectedDay] = useState(getPersianDayIndex);
    const [displayTimes, setDisplayTimes] = useState<{ sunrise: string | null; sunset: string | null; }>({ sunrise: null, sunset: null });
    const [celestialDates, setCelestialDates] = useState<{ sunrise: Date; sunset: Date; }[]>([]);
    const [now, setNow] = useState(new Date());

     useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000); // Update every second for smooth hand
        return () => clearInterval(timer);
    }, []);

    const formatTime = useCallback((date: Date) => {
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleTimeString('fa-IR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false,
            timeZone: formattedTimeZone 
        });
    }, [formattedTimeZone]);

    useEffect(() => {
        if (location) {
            const weeklyData = [];
            const today = new Date();
            for (let i = 0; i < 8; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const times = calculateSunriseSunset(date, location.latitude, location.longitude);
                weeklyData.push(times);
            }
            setCelestialDates(weeklyData);
        }
    }, [location]);

    const { timedHours, todayCelestialData } = useMemo(() => {
        if (celestialDates.length < 2 || !location) return { timedHours: null, todayCelestialData: null };
    
        const todayIndex = getPersianDayIndex();
        const displayIndex = (selectedDay - todayIndex + 7) % 7;
        const dayData = celestialDates[displayIndex];
        const nextDayData = celestialDates[displayIndex + 1];

        if (!dayData || !nextDayData || isNaN(dayData.sunrise.getTime()) || isNaN(dayData.sunset.getTime())) {
            setDisplayTimes({ sunrise: 'غیر قابل محاسبه', sunset: 'غیر قابل محاسبه' });
            return { timedHours: null, todayCelestialData: null };
        }

        setDisplayTimes({
            sunrise: formatTime(dayData.sunrise),
            sunset: formatTime(dayData.sunset),
        });

        const { dayHours, nightHours } = generateHoursForDay(selectedDay, planets);
        
        const todaySunriseMs = dayData.sunrise.getTime();
        const todaySunsetMs = dayData.sunset.getTime();
        const nextDaySunriseMs = nextDayData.sunrise.getTime();
        
        const dayDurationMs = todaySunsetMs - todaySunriseMs;
        const nightDurationMs = nextDaySunriseMs - todaySunsetMs;

        const dayHourLengthMs = dayDurationMs / 12;
        const nightHourLengthMs = nightDurationMs / 12;

        const calculatedDayHours = dayHours.map((planet, i) => {
            const startTime = new Date(todaySunriseMs + (i * dayHourLengthMs));
            const endTime = new Date(todaySunriseMs + ((i + 1) * dayHourLengthMs));
            return { planet, startTime, endTime, timeRange: `${formatTime(startTime)} - ${formatTime(endTime)}` };
        });

        const calculatedNightHours = nightHours.map((planet, i) => {
            const startTime = new Date(todaySunsetMs + (i * nightHourLengthMs));
            const endTime = new Date(todaySunsetMs + ((i + 1) * nightHourLengthMs));
            return { planet, startTime, endTime, timeRange: `${formatTime(startTime)} - ${formatTime(endTime)}` };
        });

        const allHours = { day: calculatedDayHours, night: calculatedNightHours };
        const celestialInfo = { sunrise: dayData.sunrise, sunset: dayData.sunset, nextSunrise: nextDayData.sunrise };
        
        return { timedHours: allHours, todayCelestialData: celestialInfo };

    }, [selectedDay, celestialDates, planets, formatTime, location]);

    return (
        <section id="planetary-hours" ref={sectionRef} role="region" aria-labelledby="planetary-hours-title">
            <h3 id="planetary-hours-title" className="text-4xl md:text-5xl font-bold text-center mb-12 font-lalezar tracking-wider bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
                {"ساعات سیارات"}
            </h3>
            <div className="text-center mb-6">
                <span className="bg-slate-800/60 px-3 py-1 rounded-full text-sm text-indigo-300 font-tanha border border-slate-700">
                    {"منطقه زمانی"}: {formattedTimeZone}
                </span>
            </div>
            <Card>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {dayNames.map((day, index) => (
                        <button key={index} onClick={() => setSelectedDay(index)} className={`px-4 py-2 rounded-lg text-sm md:text-lg font-semibold transition-all duration-300 border-2 ${selectedDay === index ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800/60 border-slate-700 hover:bg-slate-700/80 hover:border-slate-600'}`}>
                            {day}
                        </button>
                    ))}
                </div>

                <div className="text-center mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700 min-h-[140px] flex items-center justify-center">
                    {locationStatus === 'loading' && <div className="flex items-center justify-center text-gray-300"><Spinner small /> <span className="mr-3">{"در حال دریافت موقعیت دقیق شما..."}</span></div>}
                    {locationStatus === 'error' && <p className="text-red-400 font-semibold mb-4">{locationError}</p>}
                    {locationStatus === 'success' && displayTimes.sunrise && (
                        <div className="w-full flex flex-col items-center gap-2 animate-fade-in">
                            {locationError && (
                                <p className="text-xs text-amber-400 mb-2 -mt-2 animate-fade-in">
                                    {locationError}
                                </p>
                            )}
                            <div className="flex justify-around items-center w-full">
                                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 18a5 5 0 0 0-10 0"></path> <line x1="12" y1="2" x2="12" y2="9"></line> <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line> <line x1="1" y1="18" x2="3" y2="18"></line> <line x1="21" y1="18" x2="23" y2="18"></line> <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line> <line x1="23" y1="22" x2="1" y2="22"></line> <polyline points="8 6 12 2 16 6"></polyline>
                                    </svg>
                                    <div className="text-center md:text-right">
                                        <span className="text-gray-300 font-semibold text-sm md:text-lg block">{"طلوع خورشید"}</span>
                                        <p className="font-medium text-amber-300 text-xl md:text-3xl font-roboto-mono tracking-wide">{displayTimes.sunrise}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block w-px bg-slate-600 h-16"></div>
                                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 18a5 5 0 0 0-10 0"></path> <line x1="12" y1="9" x2="12" y2="2"></line> <line x1="4.22" y1="10.22" x2="5.64" y2="11.64"></line> <line x1="1" y1="18" x2="3" y2="18"></line> <line x1="21" y1="18" x2="23" y2="18"></line> <line x1="18.36" y1="11.64" x2="19.78" y2="10.22"></line> <line x1="23" y1="22" x2="1" y2="22"></line> <polyline points="16 5 12 9 8 5"></polyline>
                                    </svg>
                                    <div className="text-center md:text-right">
                                        <span className="text-gray-300 font-semibold text-sm md:text-lg block">{"غروب خورشید"}</span>
                                        <p className="font-medium text-orange-400 text-xl md:text-3xl font-roboto-mono tracking-wide">{displayTimes.sunset}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {timedHours && todayCelestialData ? (
                    <div className="animate-fade-in mt-12">
                        <PlanetaryClock
                            timedHours={timedHours}
                            sunrise={todayCelestialData.sunrise}
                            sunset={todayCelestialData.sunset}
                            nextSunrise={todayCelestialData.nextSunrise}
                            now={now}
                        />
                    </div>
                ) : locationStatus === 'success' ? (
                    <div className="text-center p-8"><Spinner /></div>
                ) : null}
                
                <div className="mt-8 pt-6 border-t border-slate-700/50 text-center text-gray-400">
                    <p className="font-tanha text-sm md:text-base">
                       {"توجه: ساعات سیارات بر اساس طلوع و غروب واقعی خورشید در مکان شما و با استفاده از فرمول‌های نجومی محاسبه می‌شوند و طول آن‌ها در طول سال متغیر است."}
                    </p>
                </div>
            </Card>
        </section>
    );
};

export default PlanetaryHours;