
import React, { useState, useCallback, useContext } from 'react';
import { generateNatalChartData, getCurrentPlanetPositions, interpretTransit } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { Profile, Transit, PlanetName } from '../types';
import { findSignificantTransits } from '../utils/astrology';
import { useAuth } from '../contexts/AuthContext';
import BlurPreview from './common/BlurPreview';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';

const PLANET_INFO: { [key in PlanetName]?: { symbol: string, name: string } } = {
    Sun: { symbol: '☉', name: 'خورشید' },
    Moon: { symbol: '☽', name: 'ماه' },
    Mercury: { symbol: '☿', name: 'عطارد' },
    Venus: { symbol: '♀', name: 'زهره' },
    Mars: { symbol: '♂', name: 'مریخ' },
    Jupiter: { symbol: '♃', name: 'مشتری' },
    Saturn: { symbol: '♄', name: 'زحل' },
    Ascendant: { symbol: 'AC', name: 'طالع' },
    Midheaven: { symbol: 'MC', name: 'وسط آسمان' },
};

interface TransitTrackerProps {
    activeProfile: Profile | null;
}

interface ProcessedTransit {
    transit: Transit;
    interpretation: string;
}

const TransitTracker: React.FC<TransitTrackerProps> = ({ activeProfile }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<ProcessedTransit[] | null>(null);
    const { isPremium } = useAuth();
    const libraryContext = useContext(CosmicLibraryContext);


    const handleCheckTransits = useCallback(async () => {
        if (!activeProfile) {
            setError('لطفاً ابتدا یک پروفایل را از بخش «مدیریت پروفایل» انتخاب یا ایجاد کنید.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const [natalChart, transitPlanets] = await Promise.all([
                generateNatalChartData(activeProfile.birthDate, activeProfile.birthTime, activeProfile.birthCity),
                getCurrentPlanetPositions(),
            ]);

            if (!natalChart || !transitPlanets) {
                throw new Error('خطا در دریافت اطلاعات نجومی. لطفاً دوباره تلاش کنید.');
            }

            const significantTransits = findSignificantTransits(natalChart, transitPlanets);
            
            if (significantTransits.length === 0) {
                setResults([]); // Set to empty array to indicate no transits found
            } else {
                const interpretations = await Promise.all(
                    significantTransits.map(transit => interpretTransit(transit))
                );

                const processedResults = significantTransits.map((transit, index) => ({
                    transit,
                    interpretation: interpretations[index]
                }));
                setResults(processedResults);
            }
            libraryContext?.unlockChapter('copernican_revolution');
        } catch (e: any) {
            setError(e.message || 'خطای ناشناخته در بررسی ترانزیت‌ها رخ داد.');
        } finally {
            setIsLoading(false);
        }
    }, [activeProfile, libraryContext]);
    
    const handleNew = () => {
        setResults(null);
        setError(null);
    };

    return (
        <Card>
            <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide text-center">{"رهگیری سیارات (ترانزیت)"}</h4>
            <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4 text-center">
                {"بررسی کنید که سیارات در حال حرکت امروز چگونه با نمودار تولد شما تعامل دارند. این تحلیل به شما کمک می‌کند تا از انرژی‌های کیهانی روزانه آگاه شده و بهترین استفاده را از آن‌ها ببرید."}
            </p>

            {results === null && !isLoading ? (
                 <div className="mt-8 max-w-md mx-auto space-y-4 animate-fade-in">
                    {!activeProfile ? (
                        <p className="text-amber-400 text-center font-tanha">{"لطفاً ابتدا یک پروفایل را از بخش «مدیریت پروفایل» انتخاب کنید."}</p>
                    ) : (
                        <div className="text-center font-tanha text-lg text-gray-300">
                            <p>{"تحلیل برای پروفایل"}: <strong className="text-white">{activeProfile.name}</strong></p>
                        </div>
                    )}
                    {error && <p className="text-red-400 text-center font-tanha">{error}</p>}
                    <button onClick={handleCheckTransits} disabled={isLoading || !activeProfile} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1">
                        {isLoading ? <Spinner small /> : "بررسی ترانزیت‌های امروز"}
                    </button>
                 </div>
            ) : null}

            {isLoading && (
                 <div className="flex flex-col items-center justify-center h-full mt-12">
                    <Spinner />
                    <p className="mt-4 text-gray-300 font-tanha">{"در حال مقایسه آسمان امروز با لحظه تولد شما..."}</p>
                </div>
            )}
            
            {results !== null && (
                 <div className="mt-10 animate-fade-in">
                    <BlurPreview isLocked={!isPremium}>
                        {results.length === 0 ? (
                            <div className="text-center p-8 bg-slate-800/40 rounded-lg">
                                <p className="text-green-300 font-tanha text-xl">{"امروز هیچ ترانزیت مهمی (عبور سیاره) برای شما وجود ندارد. آسمان آرام است."}</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {results.map(({ transit, interpretation }, index) => {
                                    const transitingInfo = PLANET_INFO[transit.transitingPlanet.planet];
                                    const natalInfo = PLANET_INFO[transit.natalPoint.planet];
                                    if (!transitingInfo || !natalInfo) return null;

                                    return (
                                        <div key={index} className="bg-slate-800/50 p-6 rounded-lg border-l-4 border-indigo-500">
                                            <div className="flex items-center justify-center md:justify-start gap-4 mb-3 font-lalezar text-2xl text-white">
                                                <span>{transitingInfo.symbol}</span>
                                                <span className="text-indigo-400">{"⬅️"}</span>
                                                <span>{natalInfo.symbol}</span>
                                                <h5 className="mr-3">{`عبور ${transitingInfo.name} از ${natalInfo.name} تولد`}</h5>
                                            </div>
                                            <p className="font-tanha text-lg text-cyan-300">
                                                <strong className="text-cyan-100">{"توصیه"}: </strong>{interpretation}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </BlurPreview>
                     <div className="text-center mt-10">
                        <button onClick={handleNew} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg">{"بررسی مجدد"}</button>
                    </div>
                 </div>
            )}
        </Card>
    );
};

export default TransitTracker;
