
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateAbjad, calculateAbjadSaghir } from '../utils/abjad';
import { useZodiacRulers } from '../data/rabAlTalehData';
import { useZodiacData } from '../data/zodiacData';
import { getEsotericRulers, getCleansingRitual } from '../services/geminiService';
import { useCurrentPlanetaryHour } from '../hooks/useCurrentPlanetaryHour';
import { EsotericRulers, CleansingRitual, Profile } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { Sparkles, FlaskConical, Zap, Heart, Wallet, MicOff } from 'lucide-react';

type Element = 'آتش' | 'خاک' | 'هوا' | 'آب';

interface MatrixResult {
    abjadKabir: number;
    abjadSaghir: number;
    element: Element;
    rulingPlanet: string;
    esotericRulers: EsotericRulers | null;
}

interface OccultMatrixProps {
  activeProfile: Profile | null;
}

const MatrixCard: React.FC<{ title: string; icon: React.ReactNode; children?: React.ReactNode; delay: number; isLoading?: boolean }> = ({ title, icon, children, delay, isLoading }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 h-full flex flex-col"
    >
        <div className="flex items-center mb-3">
            <div className="text-indigo-400 mr-3">{icon}</div>
            <h4 className="font-lalezar text-xl text-gray-200">{title}</h4>
        </div>
        <div className="flex-grow flex items-center justify-center text-center font-tanha text-lg">
            {isLoading ? <Spinner small /> : children}
        </div>
    </motion.div>
);

const PlanetaryHourCard: React.FC = () => {
    const currentHour = useCurrentPlanetaryHour();

    if (!currentHour) {
        return <MatrixCard title="سعد و نحس لحظه‌ای" icon={<Zap size={20} />} delay={0.8} isLoading />;
    }

    const { planet } = currentHour;
    const intentions = [
        { key: 'mohabbat', label: 'محبت', icon: <Heart size={16} /> },
        { key: 'rizq', label: 'رزق', icon: <Wallet size={16} /> },
        { key: 'zabanband', label: 'زبان‌بند', icon: <MicOff size={16} /> },
    ];

    const getQualityColor = (quality: string) => {
        switch (quality) {
            case 'عالی': return 'text-green-400';
            case 'خوب': return 'text-cyan-400';
            case 'ضعیف': return 'text-yellow-400';
            case 'بد': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <MatrixCard title="سعد و نحس لحظه‌ای" icon={<Zap size={20} />} delay={0.8}>
            <div className="w-full">
                <p className="text-gray-300">ساعت فعلی: <strong className="font-lalezar text-2xl text-white">{planet.persian}</strong></p>
                <div className="mt-3 space-y-2">
                    {intentions.map(intent => (
                        <div key={intent.key} className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2 text-gray-300">{intent.icon} {intent.label}</span>
                            <strong className={getQualityColor(planet.intentions[intent.key])}>{planet.intentions[intent.key]}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </MatrixCard>
    );
};

const OccultMatrix: React.FC<OccultMatrixProps> = ({ activeProfile }) => {
    const [result, setResult] = useState<MatrixResult | null>(null);
    const [cleansingRitual, setCleansingRitual] = useState<CleansingRitual | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const zodiacRulers = useZodiacRulers();
    const zodiacData = useZodiacData();

    const handleCalculate = useCallback(async (profile: Profile) => {
        const { name, motherName } = profile;

        if (!name || !motherName) {
            setError('پروفایل انتخاب شده ناقص است.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        setCleansingRitual(null);

        try {
            // Local calculations
            const abjadKabir = calculateAbjad(name) + calculateAbjad(motherName);
            const abjadSaghir = calculateAbjadSaghir(name) + calculateAbjadSaghir(motherName);
            const remainder = abjadKabir % 12;
            const rabTale = remainder === 0 ? 12 : remainder;

            const signInfo = zodiacRulers.find(zr => zr.id === rabTale);
            const elementInfo = zodiacData.find(zd => zd.traditional === signInfo?.sign);
            
            if (!signInfo || !elementInfo) throw new Error("خطا در محاسبه طالع");

            const localResults = {
                abjadKabir,
                abjadSaghir,
                element: elementInfo.element as Element,
                rulingPlanet: signInfo.ruler,
            };

            // AI-based calculations in parallel
            const [rulers, ritual] = await Promise.all([
                getEsotericRulers(name, abjadKabir),
                getCleansingRitual(localResults.element),
            ]);
            
            setResult({ ...localResults, esotericRulers: rulers });
            setCleansingRitual(ritual);

        } catch (e: any) {
            setError(e.message || 'خطای ناشناخته رخ داد.');
        } finally {
            setIsLoading(false);
        }
    }, [zodiacRulers, zodiacData]);

    useEffect(() => {
        if (activeProfile) {
            handleCalculate(activeProfile);
        } else {
            setResult(null);
            setCleansingRitual(null);
            setError(null);
            setIsLoading(false);
        }
    }, [activeProfile, handleCalculate]);

    
    if (!activeProfile && !result) {
        return (
            <section id="occult-matrix">
                <h3 className="text-4xl md:text-5xl font-bold text-center mb-4 font-lalezar tracking-wider bg-gradient-to-r from-purple-400 to-fuchsia-500 text-transparent bg-clip-text">
                    {"ماتریس محاسبات باطنی"}
                </h3>
                <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto font-tanha text-lg leading-relaxed">
                    {"با انتخاب یک پروفایل، یک داشبورد جامع از تحلیل‌های باطنی خود را مشاهده کنید."}
                </p>
                <Card>
                    <div className="text-center p-8 h-64 flex items-center justify-center">
                        <p className="text-xl text-gray-400">لطفاً ابتدا یک پروفایل از بخش «مدیریت پروفایل» انتخاب کنید.</p>
                    </div>
                </Card>
            </section>
        )
    }

    return (
        <section id="occult-matrix">
            <h3 className="text-4xl md:text-5xl font-bold text-center mb-4 font-lalezar tracking-wider bg-gradient-to-r from-purple-400 to-fuchsia-500 text-transparent bg-clip-text">
                {"ماتریس محاسبات باطنی"}
            </h3>
             <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto font-tanha text-lg leading-relaxed">
                {`داشبورد جامع تحلیل‌های باطنی برای ${activeProfile?.name || ''}`}
            </p>
             <Card>
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Spinner />
                        <p className="mr-4 text-lg">در حال آماده‌سازی ماتریس...</p>
                    </div>
                )}
                {error && <div className="text-center p-8 text-red-400">{error}</div>}
                <AnimatePresence>
                    {result && !isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <MatrixCard title="ابجد کبیر" icon="∑" delay={0}>
                                    <p className="font-roboto-mono text-5xl font-bold text-white">{result.abjadKabir}</p>
                                </MatrixCard>
                                <MatrixCard title="ابجد صغیر" icon="∑" delay={0.1}>
                                    <p className="font-roboto-mono text-5xl font-bold text-white">{result.abjadSaghir}</p>
                                </MatrixCard>
                                <MatrixCard title="عنصر وجودی" icon={<FlaskConical size={20} />} delay={0.2}>
                                    <p className="text-3xl font-bold text-white">{result.element}</p>
                                </MatrixCard>
                                <MatrixCard title="کوکب حاکم" icon="🪐" delay={0.3}>
                                    <p className="text-3xl font-bold text-white">{result.rulingPlanet}</p>
                                </MatrixCard>
                                <MatrixCard title="موکلین" icon={<Sparkles size={20} />} delay={0.4} isLoading={!result.esotericRulers}>
                                    {result.esotericRulers ? (
                                        <div className="text-xl">
                                            <p>ملک: <strong className="text-amber-300">{result.esotericRulers.malakName}</strong></p>
                                            <p>جن: <strong className="text-red-300">{result.esotericRulers.jinnName}</strong></p>
                                        </div>
                                    ) : <p className="text-gray-400 text-sm">خطا در دریافت</p>}
                                </MatrixCard>
                                <PlanetaryHourCard />
                            </div>

                            {cleansingRitual && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-8">
                                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                                        <h4 className="font-lalezar text-2xl text-center text-cyan-300 mb-4">{cleansingRitual.title}</h4>
                                        <div className="grid md:grid-cols-2 gap-6 font-tanha text-lg">
                                            <div>
                                                <h5 className="font-bold text-gray-300 mb-2">مواد لازم:</h5>
                                                <ul className="list-disc list-inside text-gray-200 space-y-1">
                                                    {cleansingRitual.ingredients.map((item, i) => <li key={i}>{item}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-300 mb-2">مراحل:</h5>
                                                <ol className="list-decimal list-inside text-gray-200 space-y-1">
                                                    {cleansingRitual.steps.map((item, i) => <li key={i}>{item}</li>)}
                                                </ol>
                                            </div>
                                        </div>
                                        <p className="mt-6 text-center text-amber-300 bg-black/20 p-3 rounded-lg">{cleansingRitual.advice}</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </section>
    );
};
export default OccultMatrix;
