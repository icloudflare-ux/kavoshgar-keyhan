import React, { useMemo, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRealTimeEphemeris } from '../services/geminiService';
import { EphemerisData, PlanetName, ZodiacSignName } from '../types';
import Spinner from './common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import BlurPreview from './common/BlurPreview';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';
import FormulaExplanation from './common/FormulaExplanation';
import EphemerisVisual from './EphemerisVisual'; // New visual component

const PLANET_DATA: { [key in PlanetName]?: { symbol: string, name: string, color: string, borderColor: string } } = {
    Sun: { symbol: '☉', name: 'خورشید', color: 'text-amber-400', borderColor: 'border-amber-400' },
    Moon: { symbol: '☽', name: 'ماه', color: 'text-slate-400', borderColor: 'border-slate-400' },
    Mercury: { symbol: '☿', name: 'عطارد', color: 'text-gray-400', borderColor: 'border-gray-400' },
    Venus: { symbol: '♀', name: 'زهره', color: 'text-pink-400', borderColor: 'border-pink-400' },
    Mars: { symbol: '♂', name: 'مریخ', color: 'text-red-400', borderColor: 'border-red-400' },
    Jupiter: { symbol: '♃', name: 'مشتری', color: 'text-indigo-400', borderColor: 'border-indigo-400' },
    Saturn: { symbol: '♄', name: 'زحل', color: 'text-yellow-500', borderColor: 'border-yellow-500' },
};

const ZODIAC_TRANSLATIONS: { [key in ZodiacSignName]: string } = {
    Aries: 'حمل', Taurus: 'ثور', Gemini: 'جوزا', Cancer: 'سرطان', Leo: 'اسد', Virgo: 'سنبله',
    Libra: 'میزان', Scorpio: 'عقرب', Sagittarius: 'قوس', Capricorn: 'جدی', Aquarius: 'دلو', Pisces: 'حوت'
};

const TableHeader: React.FC = () => (
    <thead>
        <tr className="border-b border-white/10">
            <th className="p-4 text-sm font-semibold tracking-wider text-right whitespace-nowrap">{"سیاره"}</th>
            <th className="p-4 text-sm font-semibold tracking-wider text-right whitespace-nowrap">{"برج"}</th>
            <th className="p-4 text-sm font-semibold tracking-wider text-center whitespace-nowrap">{"موقعیت"}</th>
            <th className="p-4 text-sm font-semibold tracking-wider text-center whitespace-nowrap">{"حرکت"}</th>
            <th className="p-4 text-sm font-semibold tracking-wider text-center whitespace-nowrap">{"سرعت (روزانه)"}</th>
        </tr>
    </thead>
);

const TableRow: React.FC<{ planetData: EphemerisData }> = ({ planetData }) => {
    const planetInfo = PLANET_DATA[planetData.planet];
    if (!planetInfo) return null;
    
    const isRetrograde = planetData.motion === 'Retrograde';
    const motionIcon = isRetrograde ? '⬅️' : '➡️';
    const motionText = isRetrograde ? 'رجعی' : 'مستقیم';
    const motionColor = isRetrograde ? 'text-red-400' : 'text-green-400';
    const rowClass = isRetrograde ? 'bg-red-900/20' : '';

    return (
        <tr className={`border-b border-white/5 hover:bg-white/10 transition-colors duration-200 ${rowClass} ${planetInfo.borderColor} border-l-4`}>
            <td className={`p-4 font-bold ${planetInfo.color} whitespace-nowrap`}>
                <div className="flex items-center gap-3">
                    <span className="text-2xl w-6 text-center">{planetInfo.symbol}</span>
                    <span className="text-lg">{planetInfo.name}</span>
                </div>
            </td>
            <td className="p-4 text-gray-300 font-tanha text-lg whitespace-nowrap">{ZODIAC_TRANSLATIONS[planetData.sign]}</td>
            <td className="p-4 text-white text-lg font-roboto-mono text-center whitespace-nowrap">
                {`${String(planetData.degree).padStart(2, '0')}° ${String(planetData.minute).padStart(2, '0')}'`}
            </td>
            <td className={`p-4 font-semibold text-center whitespace-nowrap ${motionColor}`}>
                <div className="flex items-center justify-center gap-2">
                   <span>{motionIcon}</span>
                   <span>{motionText}</span>
                </div>
            </td>
            <td className="p-4 text-white font-roboto-mono text-center whitespace-nowrap">
                {planetData.speed.toFixed(3)}°
            </td>
        </tr>
    );
};

const CelestialEphemeris: React.FC = () => {
    const libraryContext = useContext(CosmicLibraryContext);
    const { data, isLoading, error, isFetching } = useQuery<EphemerisData[] | null>({
        queryKey: ['ephemeris'],
        queryFn: async () => {
            const result = await getRealTimeEphemeris();
            if(result) libraryContext?.unlockChapter('copernican_revolution');
            return result;
        },
        refetchInterval: 900000, // Increased to 15 minutes to avoid rate limiting
        staleTime: 895000, // Keep data fresh for almost the entire interval
    });
    
    const { isPremium } = useAuth();
    const [lastUpdated, setLastUpdated] = React.useState(new Date());

    React.useEffect(() => {
        if (!isFetching) {
            setLastUpdated(new Date());
        }
    }, [isFetching]);

    const orderedData = useMemo(() => {
        if (!data) return [];
        const order: PlanetName[] = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
        return [...data].sort((a, b) => order.indexOf(a.planet) - order.indexOf(b.planet));
    }, [data]);
    
    return (
        <section className="relative py-16 overflow-hidden">
            <EphemerisVisual planets={orderedData} />
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <h4 className="text-4xl md:text-5xl font-bold text-white font-lalezar tracking-wide text-center drop-shadow-lg">{"مرکز فرماندهی کیهانی"}</h4>
                <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4 text-center">
                    {"موقعیت، حرکت و سرعت سیارات در آسمان به صورت لحظه‌ای. این داده‌ها هر 15 دقیقه به طور خودکار به‌روز می‌شوند."}
                </p>

                <div className="mt-12">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Spinner />
                            <p className="mt-4 text-gray-300">{"در حال دریافت اطلاعات آسمان..."}</p>
                        </div>
                    ) : error ? (
                        <div className="text-center p-8 bg-red-900/30 text-red-300 rounded-lg backdrop-blur-sm border border-red-500/50">
                            <p>{"خطا در دریافت اطلاعات. به دلیل محدودیت API، لطفاً دقایقی دیگر دوباره تلاش کنید."}</p>
                        </div>
                    ) : data ? (
                        <BlurPreview isLocked={!isPremium}>
                            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <div className="flex items-center justify-end text-sm text-gray-400 mb-2 px-4 pt-2">
                                        <span>آخرین به‌روزرسانی: {lastUpdated.toLocaleTimeString('fa-IR')}</span>
                                        {isFetching && <Spinner small />}
                                    </div>
                                    <table className="min-w-full">
                                        <TableHeader />
                                        <tbody>
                                            {orderedData.map(planet => <TableRow key={planet.planet} planetData={planet} />)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </BlurPreview>
                    ) : null}
                </div>
                 <div className="mt-8 max-w-4xl mx-auto">
                    <FormulaExplanation title={"راهنمای خوانش و کاربرد"}>
                        <p>{"این جدول، شناسنامه لحظه‌ای آسمان است. در اینجا نحوه استفاده از آن در زندگی روزمره آمده است:"}</p>
                        <ul className="list-disc list-inside space-y-3 mt-3">
                            <li><strong>{"موقعیت (درجه و دقیقه)"}:</strong> {"نشان می‌دهد هر سیاره در کدام قسمت از یک برج فلکی قرار دارد. این موضوع برای تحلیل‌های دقیق و پیشرفته (مانند زوایای دقیق بین سیارات) اهمیت دارد."}</li>
                            <li><strong>{"حرکت (مستقیم / رجعی)"}:</strong> {"مهم‌ترین بخش برای کاربر عمومی! وقتی یک سیاره 'رجعی' (Retrograde) است، انرژی آن به سمت درون برمی‌گردد و در حوزه مربوط به آن سیاره، احتمال تأخیر، بازنگری و مشکلات فنی بیشتر است. معروف‌ترین آن <strong>عطارد رجعی</strong> است که در آن باید مراقب ارتباطات، قراردادها و وسایل الکترونیکی بود."}</li>
                            <li><strong>{"سرعت"}:</strong> {"نشان‌دهنده سرعت پیشروی امور مربوط به آن سیاره است. سرعت بالا یعنی کارها به سرعت پیش می‌روند. سرعت پایین (نزدیک به صفر) نشان‌دهنده 'ایست' (Station) سیاره است که انرژی آن را بسیار متمرکز و قدرتمند می‌کند و زمان مهمی برای تأمل و تصمیم‌گیری در آن حوزه است."}</li>
                        </ul>
                    </FormulaExplanation>
                </div>
            </div>
        </section>
    );
};

// FIX: Add default export for lazy loading.
export default CelestialEphemeris;