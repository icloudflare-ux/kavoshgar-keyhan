
import React, { useState, useCallback, useContext } from 'react';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { getZodiacSign } from '../utils/zodiac';
import { useZodiacData } from '../data/zodiacData';
import { generateZodiacCompatibilityAnalysis } from '../services/geminiService';
import ProgressCircle from './common/ProgressCircle';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import BlurPreview from './common/BlurPreview';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';

const ZodiacCompatibility: React.FC = () => {
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [result, setResult] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const zodiacData = useZodiacData();
    const { isPremium } = useAuth();
    const libraryContext = useContext(CosmicLibraryContext);

    const handleAnalyze = useCallback(async () => {
        if (!date1 || !date2) {
            setError('لطفاً هر دو تاریخ تولد را وارد کنید.');
            return;
        }

        const sign1Name = getZodiacSign(date1);
        const sign2Name = getZodiacSign(date2);

        if (!sign1Name || !sign2Name) {
            setError('فرمت تاریخ تولد نامعتبر است. مثال: ۱۳۷۰/۰۵/۲۴');
            return;
        }
        
        const sign1Data = zodiacData.find(s => s.modern === sign1Name);
        const sign2Data = zodiacData.find(s => s.modern === sign2Name);
        
        if (!sign1Data || !sign2Data) {
            setError('اطلاعات برج فلکی یافت نشد.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const analysisResult = await generateZodiacCompatibilityAnalysis(
                { sign: sign1Data.traditional, element: sign1Data.element },
                { sign: sign2Data.traditional, element: sign2Data.element }
            );
            if (!analysisResult) throw new Error("پاسخی از سرویس هوش مصنوعی دریافت نشد.");
            setResult({ ...analysisResult, sign1: sign1Data, sign2: sign2Data });
            libraryContext?.unlockChapter('horoscopy');
        } catch (e: any) {
            setError(e.message || "خطا در تولید تحلیل.");
        } finally {
            setIsLoading(false);
        }

    }, [date1, date2, zodiacData, libraryContext]);
    
    const handleReset = () => {
        setDate1('');
        setDate2('');
        setResult(null);
        setError(null);
    };

    return (
        <Card>
            <div className="text-center">
                <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide">{"سنجش سازگاری"}</h4>
                <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4">{"سازگاری دو فرد را بر اساس برج فلکی و عنصر وجودی آن‌ها بسنجید و توصیه‌هایی برای بهبود رابطه دریافت کنید."}</p>
            </div>
            
            {!result && !isLoading && (
                 <div className="mt-8 max-w-2xl mx-auto space-y-4 animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input type="text" value={date1} onChange={(e) => setDate1(e.target.value)} placeholder={"تاریخ تولد شخص اول"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 text-center"/>
                        <input type="text" value={date2} onChange={(e) => setDate2(e.target.value)} placeholder={"تاریخ تولد شخص دوم"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 text-center"/>
                    </div>
                    {error && <p className="text-red-400 text-center font-tanha">{error}</p>}
                    <button onClick={handleAnalyze} disabled={isLoading || !date1 || !date2} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold py-3 px-4 rounded-lg">
                        {"تحلیل سازگاری"}
                    </button>
                </div>
            )}
            
            {isLoading && (
                 <div className="flex flex-col items-center justify-center h-full mt-12">
                    <Spinner />
                    <p className="mt-4 text-gray-300 font-tanha">{"در حال سنجش انرژی‌ها..."}</p>
                </div>
            )}

            {result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12">
                    <BlurPreview isLocked={!isPremium}>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                            <div className="text-center">
                                <h5 className="font-lalezar text-2xl" style={{color: result.sign1.iconColor}}>{result.sign1.traditional}</h5>
                                <p className="font-tanha text-gray-400">{`(${result.sign1.element})`}</p>
                            </div>
                            <ProgressCircle percentage={result.compatibilityScore} />
                            <div className="text-center">
                                <h5 className="font-lalezar text-2xl" style={{color: result.sign2.iconColor}}>{result.sign2.traditional}</h5>
                                <p className="font-tanha text-gray-400">{`(${result.sign2.element})`}</p>
                            </div>
                        </div>
                        
                        <div className="mt-10 max-w-4xl mx-auto space-y-8 prose prose-lg prose-invert font-tanha">
                            <div className="bg-slate-800/50 p-6 rounded-lg">
                                <h5 className="font-lalezar text-xl text-indigo-300 mb-2">{"خلاصه رابطه"}</h5>
                                <p>{result.summary}</p>
                            </div>
                            <div className="bg-slate-800/50 p-6 rounded-lg">
                                <h5 className="font-lalezar text-xl text-indigo-300 mb-2">{"تحلیل عنصری"}</h5>
                                <p>{result.elementalAnalysis}</p>
                            </div>
                            <div className="bg-slate-800/50 p-6 rounded-lg">
                                <h5 className="font-lalezar text-xl text-indigo-300 mb-2">{"توصیه‌ها"}</h5>
                                <ul className="list-disc list-inside space-y-2">
                                    {result.recommendations.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
                                </ul>
                            </div>
                        </div>
                    </BlurPreview>

                     <div className="text-center mt-10">
                        <button onClick={handleReset} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg">{"تحلیل جدید"}</button>
                    </div>
                </motion.div>
            )}
        </Card>
    );
};

export default ZodiacCompatibility;
