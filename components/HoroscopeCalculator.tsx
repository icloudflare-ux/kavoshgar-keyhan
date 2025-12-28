
import React, { useState, useCallback, useEffect } from 'react';
import { generateHoroscopeAnalysis } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';
import FormattedReading from './common/FormattedReading';
import ResultActions from './common/ResultActions';
import { Profile, PlanetPosition, PlanetName, Aspect, ZodiacSignName, ShareData } from '../types';
import FormulaExplanation from './common/FormulaExplanation';
import NatalChartUI from './NatalChartUI';
import { calculateAspects } from '../utils/astrology';
import { useAstrologyEngine } from '../hooks/useAstrologyEngine';
import { useTypewriter } from '../hooks/useTypewriter';
import TazhibBorder from './common/TazhibBorder';
import { useAuth } from '../contexts/AuthContext';
import BlurPreview from './common/BlurPreview';
import { usePreciseLocation } from '../hooks/usePreciseLocation';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface HoroscopeCalculatorProps {
    activeProfile: Profile | null;
    onHoroscopeCalculated: (sign: ZodiacSignName | null) => void;
}

const HoroscopeCalculator: React.FC<HoroscopeCalculatorProps> = ({ activeProfile, onHoroscopeCalculated }) => {
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [birthCity, setBirthCity] = useState('');
    
    const [submittedInputs, setSubmittedInputs] = useState<{ date: string; time: string; city: string; latitude?: number | null; longitude?: number | null; } | null>(null);
    
    const { location, status: locationStatus } = usePreciseLocation();

    const { zodiacData, isLoading: isChartLoading, error: chartError } = useAstrologyEngine({
        jalaliDate: submittedInputs?.date || null,
        jalaliTime: submittedInputs?.time || null,
        city: submittedInputs?.city || null,
        latitude: submittedInputs?.latitude,
        longitude: submittedInputs?.longitude,
    });
    
    const [analysis, setAnalysis] = useState('');
    const [shareData, setShareData] = useState<ShareData | null>(null);
    const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const { isPremium } = useAuth();

    const typedAnalysis = useTypewriter(analysis, 20);

    useEffect(() => {
        if (activeProfile) {
            setBirthDate(activeProfile.birthDate);
            setBirthTime(activeProfile.birthTime);
            setBirthCity(activeProfile.birthCity);
        } else {
            setBirthDate(''); setBirthTime(''); setBirthCity('');
        }
        setAnalysis(''); setSubmittedInputs(null); setShareData(null);
    }, [activeProfile]);

    const handleGenerate = useCallback(() => {
        if (!birthDate || !birthTime || !birthCity) {
            setFormError('لطفاً تمام اطلاعات را وارد کنید.');
            return;
        }
        setFormError(null);
        setAnalysis('');

        let coords: { latitude: number; longitude: number } | null = null;
        if (location) coords = { latitude: location.latitude, longitude: location.longitude }; 
        else if (birthCity.trim() === 'قم') coords = { latitude: 34.64, longitude: 50.87 };
        
        setSubmittedInputs({ 
            date: birthDate, 
            time: birthTime, 
            city: birthCity,
            latitude: coords?.latitude,
            longitude: coords?.longitude
        });

    }, [birthDate, birthTime, birthCity, location]);

    useEffect(() => {
        if (zodiacData?.Sun?.sign) {
            onHoroscopeCalculated(zodiacData.Sun.sign);
        }

        if (zodiacData && submittedInputs && activeProfile) {
            const fetchAnalysis = async () => {
                setIsAnalysisLoading(true);
                setIsSaved(false);
                setShareData(null);
                try {
                    const planetsArray = Object.entries(zodiacData).map(([planet, data]) => {
                        if (!data) return null;
                        
                        const typedData = data as { sign: ZodiacSignName; signDegree: number };
                        return { planet: planet as PlanetName, sign: typedData.sign, degree: typedData.signDegree };
                    }).filter((p): p is PlanetPosition => p !== null);

                    const aspects: Aspect[] = calculateAspects(planetsArray);
                    
                    const analysisResult = await generateHoroscopeAnalysis(activeProfile.name, submittedInputs.date, submittedInputs.time, submittedInputs.city, aspects);
                    setAnalysis(analysisResult);
                    
                    const analysisSummary = analysisResult.split('\n')[0].replace(/\*\*/g, '');
                    setShareData({
                        type: 'horoscope',
                        name: activeProfile.name,
                        zodiacData: zodiacData,
                        analysisSummary: analysisSummary
                    });

                } catch (e: any) {
                    setFormError(e.message || "خطا در تولید تحلیل متنی.");
                } finally {
                    setIsAnalysisLoading(false);
                }
            };
            fetchAnalysis();
        }
    }, [zodiacData, submittedInputs, activeProfile, onHoroscopeCalculated]);
    
    const handleSaveAnalysis = useCallback(() => {
        if (analysis && activeProfile) {
            try {
                localStorage.setItem(`horoscope_analysis_${activeProfile.id}`, analysis);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2500);
            } catch (error) { console.error("Failed to save analysis to localStorage", error); }
        }
    }, [analysis, activeProfile]);

    const displayError = formError || chartError;
    const isOverallLoading = isChartLoading || isAnalysisLoading;
    const hasResult = zodiacData || analysis;

    const handleNew = () => {
        setAnalysis(''); setSubmittedInputs(null); setFormError(null); setShareData(null); onHoroscopeCalculated(null);
    };

    const handleScrollToFamous = () => {
        document.getElementById('famous-match-section-anchor')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Card>
            <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide text-center">{"زایچه (هوروسکوپ)"}</h4>
            <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4 text-center">
                {"تحلیل نمودار تولد بر اساس تاریخ، ساعت و مکان دقیق. این ابزار موقعیت سیارات را در لحظه تولد شما محاسبه کرده و تفسیری از تأثیرات آن‌ها بر شخصیت و سرنوشت شما ارائه می‌دهد."}
            </p>
            
            {!hasResult && !isOverallLoading ? (
                <div className="mt-8 max-w-2xl mx-auto space-y-4 animate-fade-in">
                    <input type="text" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder={"تاریخ تولد (مثال: 1370/05/24)"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500" />
                    <input type="text" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} placeholder={"ساعت تولد (مثال: 18:45)"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500" />
                    <input type="text" value={birthCity} onChange={(e) => setBirthCity(e.target.value)} placeholder={"شهر محل تولد (مثال: تهران)"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500" />
                    {displayError && <p className="text-red-400 text-center font-tanha">{displayError}</p>}
                    <button onClick={handleGenerate} disabled={isOverallLoading || !birthDate || !birthTime || !birthCity} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1">
                        {isOverallLoading ? <Spinner small /> : "دریافت تحلیل زایچه"}
                    </button>
                    <FormulaExplanation title={"روش تحلیل زایچه"}>
                        {locationStatus === 'success' ? (
                            <p className="!text-green-300 font-bold text-center">{"مختصات با دقت بالا دریافت شد. آماده تحلیل کیهانی..."}</p>
                        ) : (
                            <>
                                <p>{"این تحلیل بر اساس اصول استاندارد نجوم غربی انجام می‌شود:"}</p>
                                <ul>
                                    <li dangerouslySetInnerHTML={{ __html: "<strong>تبدیل تاریخ:</strong> تاریخ شمسی به میلادی تبدیل و موقعیت جغرافیایی شهر استخراج می‌شود." }}/>
                                    <li dangerouslySetInnerHTML={{ __html: "<strong>محاسبه موقعیت:</strong> سرویس محاسباتی موقعیت سیارات و زوایای بین آن‌ها (Aspects) را محاسبه می‌کند." }}/>
                                    <li dangerouslySetInnerHTML={{ __html: "<strong>تفسیر روانشناختی:</strong> هوش مصنوعی با دریافت این داده‌ها، تفسیری از تأثیرات آن‌ها بر ارکان اصلی شخصیت ارائه می‌دهد." }}/>
                                </ul>
                            </>
                        )}
                    </FormulaExplanation>
                </div>
            ) : null}
            
            {hasResult && !isOverallLoading && (
                <div className="mt-8 animate-fade-in space-y-8">
                    {zodiacData && (
                        <>
                            <NatalChartUI zodiacData={zodiacData} />
                            <div className="flex justify-center mt-6">
                                <motion.button
                                    onClick={handleScrollToFamous}
                                    className="gold-glow-button bg-slate-900/60 backdrop-blur-md border border-amber-400/50 rounded-xl px-6 py-3 flex items-center gap-3"
                                    animate={{ scale: [1, 1.02, 1] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="content flex items-center gap-3">
                                        <Star className="w-6 h-6 text-amber-300 fill-amber-400/50" />
                                        <span className="font-lalezar text-xl tracking-wider text-amber-200">{"مشاهیر هم‌فرکانس"}</span>
                                    </div>
                                </motion.button>
                            </div>
                        </>
                    )}
                    
                    {analysis && (
                        <BlurPreview isLocked={!isPremium}>
                            <div className="bg-black/40 rounded-lg flex flex-col border border-slate-800">
                                <TazhibBorder>
                                    <div className="p-6 md:p-8 printable-content">
                                        <h3 className="text-3xl font-lalezar text-center mb-6 text-indigo-300">{"تحلیل زایچه"}</h3>
                                        <div className="flex-grow min-h-[300px]">
                                            <FormattedReading text={typedAnalysis} />
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-slate-700/50 print-actions">
                                            <button 
                                                onClick={handleSaveAnalysis}
                                                disabled={isSaved}
                                                className="bg-green-600 hover:bg-green-500 disabled:bg-green-800/70 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 mb-4 sm:mb-0"
                                            >
                                                {isSaved ? (
                                                    <> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> {"ذخیره شد!"} </>
                                                ) : (
                                                    <> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg> {"ذخیره تحلیل در پروفایل"} </>
                                                )}
                                            </button>
                                            <ResultActions textToCopy={analysis} shareData={shareData} />
                                        </div>
                                    </div>
                                </TazhibBorder>
                            </div>
                        </BlurPreview>
                    )}
                    
                    <div className="text-center mt-6">
                         <button onClick={handleNew} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">{"تحلیل جدید"}</button>
                    </div>
                </div>
            )}
             {isOverallLoading && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] mt-8">
                    <Spinner />
                    <p className="mt-4 text-gray-300 font-tanha">{"در حال تحلیل نمودار تولد شما..."}</p>
                </div>
            )}
        </Card>
    );
};

export default HoroscopeCalculator;
