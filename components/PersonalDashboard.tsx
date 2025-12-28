
import React, { useMemo, useState, useEffect } from 'react';
import { Profile } from '../types';
import { calculateAbjad } from '../utils/abjad';
import { useZodiacRulers, useWeeklyRulers } from '../data/rabAlTalehData';
import { qamarDarAghrabData } from '../data/qamarDarAghrabData';
import { generateDailyAdvice } from '../services/geminiService';
import Spinner from './common/Spinner';
import { useQuery } from '@tanstack/react-query';
import { getJalaliInfo, getIslamicInfo, getGregorianInfo } from '../utils/dateConverter';

const DashboardCard: React.FC<{ title: string, icon: string, children: React.ReactNode, className?: string }> = ({ title, icon, children, className }) => (
    <div className={`bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 flex flex-col ${className}`}>
        <div className="flex items-center mb-3">
            <span className="text-2xl ml-3">{icon}</span>
            <h4 className="font-lalezar text-lg text-indigo-300">{title}</h4>
        </div>
        <div className="flex-grow flex items-center justify-center text-center">
            {children}
        </div>
    </div>
);

const PersonalDashboard: React.FC<{ activeProfile: Profile }> = ({ activeProfile }) => {
    const [now, setNow] = useState(new Date());
    const zodiacRulers = useZodiacRulers();
    const weeklyRulers = useWeeklyRulers();
    
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute for live data
        return () => clearInterval(timer);
    }, []);

    const { ascendantSign, rulerPlanet } = useMemo(() => {
        const totalAbjad = calculateAbjad(activeProfile.name) + calculateAbjad(activeProfile.motherName);
        const remainder = totalAbjad % 12;
        const rabTale = remainder === 0 ? 12 : remainder;
        const signInfo = zodiacRulers.find(z => z.id === rabTale);
        return { ascendantSign: signInfo?.sign || null, rulerPlanet: signInfo?.ruler || null };
    }, [activeProfile, zodiacRulers]);

    const todayRulerInfo = useMemo(() => {
        const todayIndex = (now.getDay() + 1) % 7; // 0 for Saturday
        return weeklyRulers[todayIndex];
    }, [now, weeklyRulers]);
    
    const jalaliDate = useMemo(() => getJalaliInfo(now), [now]);
    const islamicDate = useMemo(() => getIslamicInfo(now), [now]);
    const gregorianDate = useMemo(() => getGregorianInfo(now, 'fa'), [now]);

    const isRulerDay = rulerPlanet === todayRulerInfo.ruler;

    const isQamar = useMemo(() => {
        const nowTime = now.getTime();
        const allEvents = [...qamarDarAghrabData.constellation, ...qamarDarAghrabData.sign];
        return allEvents.some(event => {
            const startTime = new Date(event.start).getTime();
            const endTime = new Date(event.end).getTime();
            return nowTime >= startTime && nowTime <= endTime;
        });
    }, [now]);

    // Fetch daily advice using TanStack Query
    const today = new Date().toISOString().split('T')[0];
    const { data: dailyAdvice, isLoading: isAdviceLoading, isError: isAdviceError } = useQuery({
        queryKey: ['dailyAdvice', today, ascendantSign],
        queryFn: () => generateDailyAdvice(ascendantSign!),
        enabled: !!ascendantSign, // Only run the query if ascendantSign is available
        staleTime: 1000 * 60 * 60 * 12, // Cache data for 12 hours
        gcTime: 1000 * 60 * 60 * 24, // Keep unused data for 24 hours
        retry: 1, // Retry failed requests once
    });

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="bg-black/40 backdrop-blur-lg border border-slate-800/50 rounded-2xl shadow-2xl shadow-indigo-900/40 p-6">
                <h3 className="text-3xl font-lalezar text-center mb-6">{`آینه تقدیر: ${activeProfile.name}`}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DashboardCard title={"روز حاکم طالع"} icon="👑">
                        <div className="font-tanha text-lg">
                            {isRulerDay ? (
                                <p className="text-green-400 font-bold">{"امروز روز ویژه شماست!"}</p>
                            ) : (
                                <p className="text-gray-300">{`امروز تحت حاکمیت ${todayRulerInfo.ruler} است.`}</p>
                            )}
                        </div>
                    </DashboardCard>
                    <DashboardCard title={"وضعیت قمر"} icon="🦂">
                         <div className="font-tanha text-lg">
                             {isQamar ? (
                                 <p className="text-red-400 font-bold">{"قمر در عقرب"}</p>
                             ) : (
                                <p className="text-green-400 font-bold">{"قمر در عقرب نیست"}</p>
                             )}
                        </div>
                    </DashboardCard>
                    <DashboardCard title={"تقویم"} icon="📅">
                        <div className="font-tanha text-lg space-y-2 text-gray-300 w-full text-right">
                            <p className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                                <span>☀️ {"شمسی"}:</span> 
                                <strong className="font-roboto-mono text-white">{`${jalaliDate.day} ${jalaliDate.monthYear}`}</strong>
                            </p>
                            <p className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                                <span>🌙 {"قمری"}:</span> 
                                <strong className="font-roboto-mono text-white">{`${islamicDate.day} ${islamicDate.monthYear}`}</strong>
                            </p>
                            <p className="flex justify-between items-center">
                                <span>🌍 {"میلادی"}:</span> 
                                <strong className="font-roboto-mono text-white">{`${gregorianDate.day} ${gregorianDate.monthYear}`}</strong>
                            </p>
                        </div>
                    </DashboardCard>
                    <DashboardCard title={"توصیه روزانه"} icon="🔮" className="md:col-span-2 lg:col-span-3">
                        <div className="font-tanha text-lg text-cyan-300 min-h-[50px] flex items-center justify-center">
                            {isAdviceLoading && <Spinner small />}
                            {isAdviceError && <p className="text-red-400 text-sm">{"خطا در دریافت توصیه روزانه"}</p>}
                            {dailyAdvice && <p>"{dailyAdvice}"</p>}
                        </div>
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
};

export default PersonalDashboard;
