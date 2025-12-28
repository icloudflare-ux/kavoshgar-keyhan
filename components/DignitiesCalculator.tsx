
import React, { useState, useMemo, useRef } from 'react';
import { useDignitiesData } from '../data/dignitiesData';
import Card from './common/Card';
import useUnlockOnScroll from '../hooks/useUnlockOnScroll';

const DignityExplanationCard: React.FC<{ title: string, color: string, icon: string, definition: string, dos: string, donts: string }> = ({ title, color, icon, definition, dos, donts }) => {
    return (
        <div className={`bg-slate-800/40 p-6 rounded-lg border-t-4 ${color}`}>
            <div className="flex items-center mb-4">
                <span className="text-4xl ml-4">{icon}</span>
                <h5 className={`text-3xl font-lalezar ${color.replace('border-', 'text-')}`}>{title}</h5>
            </div>
            <p className="font-tanha text-gray-300 text-lg mb-4">{definition}</p>
            <div className="font-tanha text-base space-y-3">
                <div className="p-3 bg-green-900/20 rounded-md">
                    <strong className="text-green-400">✅ {"انجام دهید"}:</strong>
                    <p className="text-gray-300">{dos}</p>
                </div>
                <div className="p-3 bg-red-900/20 rounded-md">
                    <strong className="text-red-400">❌ {"پرهیز کنید"}:</strong>
                    <p className="text-gray-300">{donts}</p>
                </div>
            </div>
        </div>
    );
};

const DignitiesCalculator: React.FC = () => {
    const { planets, signs, dignities } = useDignitiesData();
    const cardRef = useRef<HTMLDivElement>(null);
    useUnlockOnScroll(cardRef, 'financial_astrology');

    const [selectedPlanet, setSelectedPlanet] = useState(planets[0].id);
    const [selectedSign, setSelectedSign] = useState(signs[0].id);

    const result = useMemo(() => {
        const planetDignities = dignities[selectedPlanet];
        if (planetDignities && planetDignities[selectedSign]) {
            return planetDignities[selectedSign];
        }
        return {
            type: 'عادی',
            explanation: 'کوکب در این برج وضعیت خاصی ندارد و ویژگی‌های عادی خود را بروز می‌دهد.',
            color: 'text-gray-300',
        };
    }, [selectedPlanet, selectedSign, dignities]);

    return (
        <div ref={cardRef}>
            <Card>
                <div className="text-center">
                    <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide">{"محاسبه‌گر شرف و وبال"}</h4>
                    <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4">
                        {"قدرت و ضعف ذاتی هر کوکب در برج‌های مختلف فلکی را بررسی کنید. این ابزار به شما کمک می‌کند تا بفهمید یک کوکب در یک برج خاص در چه وضعیتی قرار دارد و چگونه انرژی خود را بروز می‌دهد."}
                    </p>
                </div>
                
                <div className="mt-8 max-w-xl mx-auto space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="planet-select" className="block text-lg font-tanha text-gray-300 mb-2">{"انتخاب کوکب"}:</label>
                            <select
                                id="planet-select"
                                value={selectedPlanet}
                                onChange={(e) => setSelectedPlanet(e.target.value)}
                                className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500 text-lg"
                            >
                                {planets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="sign-select" className="block text-lg font-tanha text-gray-300 mb-2">{"انتخاب برج"}:</label>
                            <select
                                id="sign-select"
                                value={selectedSign}
                                onChange={(e) => setSelectedSign(e.target.value)}
                                className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500 text-lg"
                            >
                                {signs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {result && (
                        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center animate-fade-in">
                            <p className="font-tanha text-xl text-gray-400">
                                {"وضعیت"} <strong className="text-white">{planets.find(p=>p.id === selectedPlanet)?.name}</strong> {"در برج"} <strong className="text-white">{signs.find(s=>s.id === selectedSign)?.name}</strong>:
                            </p>
                            <h5 className={`text-5xl font-lalezar my-4 ${result.color}`}>
                                {result.type}
                            </h5>
                            <p className="font-tanha text-gray-300 leading-loose text-lg max-w-2xl mx-auto">{result.explanation}</p>
                        </div>
                    )}
                </div>

                <div className="mt-16 pt-10 border-t border-slate-700/50">
                     <h4 className="text-3xl font-lalezar text-center mb-10 text-indigo-300">{"راهنمای وضعیت‌ها"}</h4>
                     <div className="grid lg:grid-cols-2 gap-8">
                        <DignityExplanationCard
                            title={"در خانه (حاکمیت)"}
                            color="border-amber-400"
                            icon="👑"
                            definition={"کوکب در برج تحت حاکمیت خود قرار دارد و مانند پادشاهی در قلمرو خویش عمل می‌کند. انرژی آن به طبیعی‌ترین و قوی‌ترین شکل ممکن بروز می‌کند."}
                            dos={"ابراز مستقیم و با اعتماد به نفس ویژگی‌های کوکب."}
                            donts={"استفاده افراطی و خودخواهانه از قدرت آن."}
                        />
                        <DignityExplanationCard
                            title={"در شرف"}
                            color="border-green-400"
                            icon="✨"
                            definition={"کوکب در این برج به اوج قدرت و افتخار خود می‌رسد. انرژی آن به شکلی متعالی، الهام‌بخش و مورد احترام بروز می‌کند."}
                            dos={"استفاده از انرژی کوکب برای اهداف والا و رشد معنوی."}
                            donts={"مغرور شدن و سوءاستفاده از جایگاه ویژه‌ی آن."}
                        />
                         <DignityExplanationCard
                            title={"در وبال"}
                            color="border-gray-400"
                            icon=" exiled "
                            definition={"کوکب در برج مقابل خانه خود قرار دارد و احساس بیگانگی و ضعف می‌کند. انرژی آن به سختی و به شکلی غیرطبیعی ابراز می‌شود."}
                            dos={"تلاش برای درک دیدگاه‌های مخالف و ایجاد تعادل."}
                            donts={"پافشاری بر روش‌های غریزی کوکب که در این محیط کارایی ندارد."}
                        />
                        <DignityExplanationCard
                            title={"در هبوط"}
                            color="border-red-400"
                            icon="🌪️"
                            definition={"کوکب در ضعیف‌ترین و آسیب‌پذیرترین حالت خود قرار دارد. انرژی آن ممکن است به شکلی مخرب یا سرکوب‌شده بروز کند."}
                            dos={"پذیرش ضعف‌ها و تلاش برای مدیریت سازنده انرژی آن."}
                            donts={"ناامید شدن یا تلاش برای ابراز قدرت به شکل ناسالم."}
                        />
                     </div>
                </div>
            </Card>
        </div>
    );
};

export default DignitiesCalculator;
