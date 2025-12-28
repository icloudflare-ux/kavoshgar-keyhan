
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { generateTradingAstrologyAnalysisForMonth } from '../services/geminiService';
import { TradingDayAnalysis } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import BlurPreview from './common/BlurPreview';
import { getJalaliInfo, getGregorianInfo } from '../utils/dateConverter';
import { motion, AnimatePresence } from 'framer-motion';

const ratingMap: { [key: string]: { icon: string; color: string; label: string } } = {
    'عالی': { icon: '🚀', color: 'bg-green-500/80 border-green-400', label: 'عالی' },
    'خوب': { icon: '👍', color: 'bg-cyan-500/70 border-cyan-400', label: 'خوب' },
    'متوسط': { icon: '🤔', color: 'bg-yellow-500/70 border-yellow-400', label: 'متوسط' },
    'پرریسک': { icon: '⚠️', color: 'bg-red-500/70 border-red-400', label: 'پرریسک' },
    'بسیار پرریسک': { icon: '🛑', color: 'bg-red-700/80 border-red-500', label: 'بسیار پرریسک' },
};

const DayDetailModal: React.FC<{ dayData: TradingDayAnalysis | null, date: Date, onClose: () => void }> = ({ dayData, date, onClose }) => {
    if (!dayData) return null;

    const jalali = getJalaliInfo(date);
    const gregorian = getGregorianInfo(date, 'fa');
    const ratingInfo = ratingMap[dayData.rating];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`w-full max-w-2xl bg-slate-900 border-2 ${ratingInfo.color.replace('bg-', 'border-')} rounded-2xl shadow-2xl p-6`}
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center border-b border-slate-700 pb-4 mb-4">
                    <h3 className="font-lalezar text-3xl text-white">{`${jalali.day} ${jalali.monthYear}`}</h3>
                    <p className="font-tanha text-gray-400">{gregorian.monthYear}</p>
                    <div className={`mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-full ${ratingInfo.color.replace('border-', 'bg-opacity-30 bg-')}`}>
                        <span className="text-2xl">{ratingInfo.icon}</span>
                        <span className={`font-bold text-xl ${ratingInfo.color.replace('bg-', 'text-').replace('border-', 'text-')}`}>{ratingInfo.label}</span>
                    </div>
                </div>
                <div className="font-tanha text-lg text-gray-300 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    <p><strong className="text-indigo-300">خلاصه:</strong> {dayData.summary}</p>
                    <div>
                        <strong className="text-green-400">تاثیرات مثبت:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            {dayData.positiveAspects.map((aspect, i) => <li key={i}>{aspect}</li>)}
                        </ul>
                    </div>
                    <div>
                        <strong className="text-red-400">تاثیرات منفی:</strong>
                         <ul className="list-disc list-inside mt-1 space-y-1">
                            {dayData.negativeAspects.map((aspect, i) => <li key={i}>{aspect}</li>)}
                        </ul>
                    </div>
                    <p><strong className="text-amber-300">توصیه روز:</strong> {dayData.advice}</p>
                </div>
                <button onClick={onClose} className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg">بستن</button>
            </motion.div>
        </div>
    );
};

const TradingAstrologyCalendar: React.FC = () => {
    const { isPremium } = useAuth();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<{ dayData: TradingDayAnalysis, date: Date } | null>(null);

    const { data: monthlyData, isLoading, error } = useQuery({
        queryKey: ['tradingAnalysis', currentMonth.getFullYear(), currentMonth.getMonth()],
        queryFn: () => generateTradingAstrologyAnalysisForMonth(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
        enabled: isPremium,
        staleTime: Infinity, // Data for a month doesn't change
    });
    
    const calendarGrid = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        
        const grid: { date: Date, isCurrentMonth: boolean, analysis: TradingDayAnalysis | undefined }[] = [];
        const startDayOfWeek = (firstDayOfMonth.getDay() + 1) % 7;

        // Days from previous month
        for (let i = 0; i < startDayOfWeek; i++) {
            const date = new Date(firstDayOfMonth);
            date.setDate(date.getDate() - (startDayOfWeek - i));
            grid.push({ date, isCurrentMonth: false, analysis: undefined });
        }

        // Days of current month
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const date = new Date(year, month, i);
            const analysis = monthlyData?.find(d => d.day === i);
            grid.push({ date, isCurrentMonth: true, analysis });
        }
        
        // Days from next month
        const gridEndOffset = 42 - grid.length;
        for (let i = 1; i <= gridEndOffset; i++) {
            const date = new Date(lastDayOfMonth);
            date.setDate(date.getDate() + i);
            grid.push({ date, isCurrentMonth: false, analysis: undefined });
        }

        return grid;
    }, [currentMonth, monthlyData]);

    const changeMonth = (offset: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    if (!isPremium) {
        return <BlurPreview isLocked={true}><div className="h-96"></div></BlurPreview>;
    }

    return (
        <section id="trading-calendar">
            <h3 className="text-4xl md:text-5xl font-bold text-center mb-4 font-lalezar tracking-wider bg-gradient-to-r from-green-400 to-cyan-500 text-transparent bg-clip-text">
                {"تقویم کیهانی تریدینگ"}
            </h3>
            <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto font-tanha text-lg leading-relaxed">
                {"بهترین روزهای ماه را برای معاملات خود شناسایی کنید. این تحلیل‌ها بر اساس انرژی سیارات و تأثیرات آن‌ها بر روانشناسی بازار تهیه شده است."}
            </p>
            <Card>
                <div className="flex items-center justify-between mb-6 px-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-700">{"<"}</button>
                    <h4 className="text-2xl font-bold font-lalezar text-indigo-300">{getJalaliInfo(currentMonth).monthYear}</h4>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-700">{">"}</button>
                </div>
                {isLoading && <div className="h-96 flex items-center justify-center"><Spinner /> <p className="mr-4">در حال دریافت تحلیل ماهانه...</p></div>}
                {error && <div className="text-red-400 text-center">خطا در دریافت اطلاعات.</div>}
                {monthlyData && (
                    <div className="grid grid-cols-7 gap-1">
                        {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(day => <div key={day} className="text-center font-bold text-gray-500 pb-2">{day}</div>)}
                        {calendarGrid.map(({ date, isCurrentMonth, analysis }, index) => {
                            const day = getJalaliInfo(date).day;
                            const ratingInfo = analysis ? ratingMap[analysis.rating] : null;
                            const isToday = new Date().toDateString() === date.toDateString();
                            return (
                                <div
                                    key={index}
                                    onClick={() => analysis && setSelectedDay({ dayData: analysis, date })}
                                    className={`h-24 rounded-lg flex flex-col items-center justify-center p-1 relative transition-all duration-300 ${!isCurrentMonth ? 'text-gray-700 bg-slate-800/20' : 'cursor-pointer'}`}
                                >
                                    {isCurrentMonth && (
                                        <>
                                            <span className={`absolute top-1 right-2 text-3xl font-roboto-mono ${isToday ? 'text-blue-400' : 'text-white'}`}>{day}</span>
                                            {ratingInfo && <span className={`absolute bottom-2 text-2xl opacity-80 ${isToday ? 'animate-pulse' : ''}`}>{ratingInfo.icon}</span>}
                                            <div className={`absolute inset-0 rounded-lg border-2 ${isToday ? 'border-blue-500' : 'border-transparent'} ${ratingInfo ? ratingInfo.color.replace('bg-','border-') : 'border-transparent'} ${ratingInfo ? 'hover:bg-opacity-40 hover:'+ratingInfo.color.split(' ')[0] : ''}`}></div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
            <AnimatePresence>
                {selectedDay && <DayDetailModal dayData={selectedDay.dayData} date={selectedDay.date} onClose={() => setSelectedDay(null)} />}
            </AnimatePresence>
        </section>
    );
};

export default TradingAstrologyCalendar;
