
import React, { useState, useEffect, useMemo} from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrentPlanetaryHour } from '../hooks/useCurrentPlanetaryHour';
import { qamarDarAghrabData } from '../data/qamarDarAghrabData';
import Card from './common/Card';
import BlurPreview from './common/BlurPreview';
import Spinner from './common/Spinner';
import { motion } from 'framer-motion';
import FormulaExplanation from './common/FormulaExplanation';

type SignalType = 'SURE' | 'CAUTION' | 'AVOID';

// Moon Phase logic, simplified from MoonPhase component
const LUNAR_CYCLE_DAYS = 29.53;
const NEW_MOON_REFERENCE_UTC = new Date('2024-01-11T11:57:00Z').getTime();
const getMoonPhase = (date: Date): number => {
    const msSinceNewMoon = date.getTime() - NEW_MOON_REFERENCE_UTC;
    const daysSinceNewMoon = msSinceNewMoon / (1000 * 60 * 60 * 24);
    const phase = (daysSinceNewMoon % LUNAR_CYCLE_DAYS) / LUNAR_CYCLE_DAYS;
    return phase < 0 ? 1 + phase : phase;
};

const formatCountdown = (ms: number) => {
    if (ms < 0) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const planetColors: { [key: string]: { main: string; glow: string } } = {
    Jupiter: { main: '#818cf8', glow: '#6366f1' },
    Venus: { main: '#f472b6', glow: '#ec4899' },
    Sun: { main: '#f59e0b', glow: '#d97706' },
    Moon: { main: '#cbd5e1', glow: '#94a3b8' },
    Mercury: { main: '#a1a1aa', glow: '#71717a' },
    Mars: { main: '#ef4444', glow: '#dc2626' },
    Saturn: { main: '#fcd34d', glow: '#fbbf24' },
    Default: { main: '#475569', glow: '#334155' },
};

const StaticTraderView = () => (
    <Card className="!bg-purple-900/20 !backdrop-blur-xl !border !border-purple-500/30">
        <h3 className="text-3xl font-lalezar text-center text-indigo-300 mb-4">{"مانیتورینگ بازار کیهانی"}</h3>
        <p className="font-tanha text-gray-400 text-center mb-6">{"سیگنال‌های لحظه‌ای برای تریدرهای حرفه‌ای"}</p>
        <div className="relative w-full max-w-xs mx-auto aspect-square flex items-center justify-center my-4">
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
                <circle cx="100" cy="100" r="90" stroke="#374151" strokeWidth="8" fill="none" />
                <circle cx="100" cy="100" r="90" stroke="#ef4444" strokeWidth="8" fill="none" strokeDasharray="565.48" strokeDashoffset="452.38" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="60" fill="#dc2626" />
            </svg>
            <div className="absolute font-roboto-mono text-3xl font-bold text-white">20%</div>
        </div>
        <div className="text-center p-6 rounded-lg bg-red-900/30"><h4 className="text-4xl font-lalezar text-red-400">AVOID</h4></div>
    </Card>
);

const TraderVIPSignals: React.FC = () => {
    const { isPremium } = useAuth();
    const currentHour = useCurrentPlanetaryHour();
    const [countdown, setCountdown] = useState('00:00');

    useEffect(() => {
        if (!currentHour) return;
        const timer = setInterval(() => {
            const remaining = currentHour.end.getTime() - new Date().getTime();
            setCountdown(formatCountdown(remaining));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentHour]);

    const { signal, analysis, vibrationPower } = useMemo(() => {
        if (!currentHour?.planet) {
            return { signal: 'CAUTION' as SignalType, analysis: 'در حال دریافت اطلاعات سیاره‌ای...', vibrationPower: 50 };
        }

        const now = new Date();
        const nowTime = now.getTime();
        const isQamar = qamarDarAghrabData.constellation.some(event => nowTime >= new Date(event.start).getTime() && nowTime <= new Date(event.end).getTime());

        if (isQamar) {
            return { signal: 'AVOID' as SignalType, analysis: 'قمر در عقرب است. ریسک معاملات به شدت بالاست. توصیه به خروج از بازار.', vibrationPower: 10 };
        }
        
        const planet = currentHour.planet;
        const moonPhase = getMoonPhase(now);
        let power = 50;
        let sig: SignalType;
        let text: string;

        switch (planet.name) {
            case 'Jupiter': power += 40; break;
            case 'Venus': power += 30; break;
            case 'Sun':
            case 'Moon': power += 15; break;
            case 'Mercury': power += 0; break;
            case 'Mars': power -= 35; break;
            case 'Saturn': power -= 40; break;
        }
        
        if (moonPhase >= 0.45 && moonPhase < 0.55) power += 20;
        else if (moonPhase > 0.05 && moonPhase < 0.45) power += 10;
        else if (moonPhase > 0.55 && moonPhase < 0.95) power -= 10;

        power = Math.max(5, Math.min(95, power));

        switch (planet.name) {
            case 'Jupiter':
                sig = 'SURE';
                text = `ساعت سعد اکبر (${planet.persian}). انرژی توسعه و خوش‌بینی در بازار حاکم است. زمان طلایی برای باز کردن پوزیشن‌های Long و سرمایه‌گذاری‌های جدید.`;
                break;
            case 'Venus':
                sig = 'SURE';
                text = `ساعت سعد اصغر (${planet.persian}). انرژی هماهنگی و ثبات در بازار وجود دارد. مناسب برای معاملات کم‌ریسک و سودهای منطقی.`;
                break;
            case 'Sun':
            case 'Moon':
                sig = 'CAUTION';
                text = `ساعت نیرین (${planet.persian}). بازار دارای انرژی است اما احساسات عمومی بر منطق غلبه دارد. با احتیاط و با مدیریت ریسک معامله کنید.`;
                break;
            case 'Mercury':
                sig = 'CAUTION';
                text = `ساعت عطارد. بازار تحت تاثیر اخبار و ارتباطات است. مناسب برای اسکالپ و معاملات سریع. مراقب نوسانات ناگهانی باشید.`;
                break;
            case 'Mars':
                sig = 'AVOID';
                text = `ساعت نحس اصغر (${planet.persian}). انرژی تهاجمی و نوسانات شدید حاکم است. ریسک لیکویید شدن بالاست. از ورود به پوزیشن‌های جدید خودداری کنید.`;
                break;
            case 'Saturn':
                sig = 'AVOID';
                text = `ساعت نحس اکبر (${planet.persian}). انرژی انقباض، ترس و محدودیت در بازار حاکم است. احتمال ریزش قیمت‌ها بالاست. توصیه به خروج از معاملات.`;
                break;
            default:
                sig = 'CAUTION';
                text = `وضعیت کیهانی نامشخص است. با احتیاط کامل عمل کنید.`;
        }

        return { signal: sig, analysis: text, vibrationPower: power };
    }, [currentHour]);
    
    if (!isPremium) {
        return <BlurPreview isLocked={true}><StaticTraderView/></BlurPreview>;
    }

    if (!currentHour?.planet) {
        return <Card><div className="flex items-center justify-center h-64"><Spinner/><p className="mr-4">در حال دریافت موقعیت برای محاسبه ساعات...</p></div></Card>;
    }
    
    const signalStyles: Record<SignalType, { color: string; bg: string; shadow: string; glow: string; border: string; }> = {
        SURE: { color: 'text-green-300', bg: 'bg-green-900/40', shadow: 'shadow-green-500/40', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]', border: 'border-green-500/50' },
        CAUTION: { color: 'text-yellow-300', bg: 'bg-yellow-900/40', shadow: 'shadow-yellow-500/40', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]', border: 'border-yellow-500/50' },
        AVOID: { color: 'text-red-300', bg: 'bg-red-900/40', shadow: 'shadow-red-500/40', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]', border: 'border-red-500/50' },
    };
    const currentSignalStyle = signalStyles[signal];
    const powerBarColor = vibrationPower < 40 ? '#ef4444' : vibrationPower < 70 ? '#f59e0b' : '#22c55e';
    const activePlanetColor = planetColors[currentHour.planet.name as keyof typeof planetColors] || planetColors.Default;
    
    const size = 200, center = 100, radius = 90, strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (vibrationPower / 100) * circumference;

    return (
        <Card className={`!bg-purple-900/20 !backdrop-blur-xl !border transition-colors duration-500 ${currentSignalStyle.border}`}>
            <h3 className="text-3xl font-lalezar text-center text-indigo-300 mb-2">{"مانیتورینگ بازار کیهانی"}</h3>
            <p className="font-tanha text-gray-400 text-center mb-8">{"سیگنال‌های لحظه‌ای برای تریدرهای حرفه‌ای"}</p>
            
            <div className="relative w-full max-w-xs mx-auto aspect-square flex items-center justify-center my-4">
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                    <defs>
                        <radialGradient id="planetCoreGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={activePlanetColor.glow} stopOpacity="0.8" />
                            <stop offset="100%" stopColor="transparent" />
                        </radialGradient>
                    </defs>
                    {/* Gauge Track */}
                    <circle cx={center} cy={center} r={radius} stroke="#374151" strokeWidth={strokeWidth} fill="none" />
                    {/* Gauge Progress */}
                    <motion.circle 
                        cx={center} cy={center} r={radius} 
                        stroke={powerBarColor} strokeWidth={strokeWidth} fill="none"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        transform={`rotate(-90 ${center} ${center})`}
                    />
                    {/* Central Planet */}
                    <circle cx={center} cy={center} r={radius - 20} fill="url(#planetCoreGlow)" />
                    <motion.circle 
                        cx={center} cy={center} r={radius - 30} 
                        fill={activePlanetColor.main}
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                     <motion.circle 
                        cx={center} cy={center} r={radius - 28} 
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                        opacity="0.3"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </svg>
                <div className="absolute font-roboto-mono text-3xl font-bold text-white drop-shadow-lg">{`${Math.round(vibrationPower)}%`}</div>
            </div>

            <div className={`text-center p-6 rounded-lg ${currentSignalStyle.bg} border border-slate-700 shadow-xl ${currentSignalStyle.shadow}`}>
                <h4 className={`text-5xl font-lalezar tracking-wider ${currentSignalStyle.color}`} style={{ textShadow: `0 0 15px ${currentSignalStyle.color.replace('text-','').replace('-300','')}`}}>{signal}</h4>
            </div>

            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg text-center">
                <p className="font-tanha text-lg text-cyan-300">{analysis}</p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-purple-500/20 flex justify-between items-center">
                <div className="text-right">
                    <p className="font-tanha text-gray-400">{"ساعت فعلی"}</p>
                    <p className="font-lalezar text-2xl text-white">{currentHour.planet.persian}</p>
                </div>
                <div className="text-left">
                    <p className="font-tanha text-gray-400">{"زمان باقیمانده"}</p>
                    <p className="font-roboto-mono text-3xl font-bold text-amber-300">{countdown}</p>
                </div>
            </div>
             <FormulaExplanation title={"راهنمای خوانش سیگنال"}>
                <p>{"این ابزار با ترکیب دو عامل نجومی، یک سیگنال کلی برای وضعیت بازار ارائه می‌دهد:"}</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li><strong>{"ساعت سیاره‌ای:"}</strong> {"هر ساعت از روز تحت حاکمیت یک سیاره است. سیارات سعد (مشتری، زهره) انرژی مثبت و توسعه‌دهنده و سیارات نحس (زحل، مریخ) انرژی انقباضی و چالش‌برانگیز به بازار می‌دهند."}</li>
                    <li><strong>{"فاز ماه:"}</strong> {"ماه کامل (Full Moon) تمایل به ایجاد هیجان و بازگشت روند دارد، در حالی که ماه نو (New Moon) زمان تثبیت است. ماه افزایشی (Waxing) به رشد کمک می‌کند و ماه کاهنده (Waning) به رکود."}</li>
                </ul>
                <p>{"«قدرت ارتعاش» ترکیبی از این دو عامل است و نشان‌دهنده میزان قدرت انرژی مثبت یا منفی در لحظه است. سیگنال نهایی (SURE, CAUTION, AVOID) بر اساس این قدرت و نوع سیاره حاکم صادر می‌شود."}</p>
            </FormulaExplanation>
        </Card>
    );
};

export default TraderVIPSignals;
