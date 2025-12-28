
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BirthChartData } from '../types';

// Data for rendering the chart
const zodiacSigns = [
    { name: 'Aries', symbol: '♈︎', key: 'zodiacs.Aries' },
    { name: 'Taurus', symbol: '♉︎', key: 'zodiacs.Taurus' },
    { name: 'Gemini', symbol: '♊︎', key: 'zodiacs.Gemini' },
    { name: 'Cancer', symbol: '♋︎', key: 'zodiacs.Cancer' },
    { name: 'Leo', symbol: '♌︎', key: 'zodiacs.Leo' },
    { name: 'Virgo', symbol: '♍︎', key: 'zodiacs.Virgo' },
    { name: 'Libra', symbol: '♎︎', key: 'zodiacs.Libra' },
    { name: 'Scorpio', symbol: '♏︎', key: 'zodiacs.Scorpio' },
    { name: 'Sagittarius', symbol: '♐︎', key: 'zodiacs.Sagittarius' },
    { name: 'Capricorn', symbol: '♑︎', key: 'zodiacs.Capricorn' },
    { name: 'Aquarius', symbol: '♒︎', key: 'zodiacs.Aquarius' },
    { name: 'Pisces', symbol: '♓︎', key: 'zodiacs.Pisces' },
];

const planets = [
    { key: 'sun', symbol: '☉', nameKey: 'planets.sun' },
    { key: 'moon', symbol: '☽', nameKey: 'planets.moon' },
    { key: 'ascendant', symbol: 'AC', nameKey: 'planets.ascendant' },
    { key: 'mercury', symbol: '☿', nameKey: 'planets.mercury' },
    { key: 'venus', symbol: '♀', nameKey: 'planets.venus' },
    { key: 'mars', symbol: '♂', nameKey: 'planets.mars' },
    { key: 'jupiter', symbol: '♃', nameKey: 'planets.jupiter' },
    { key: 'saturn', symbol: '♄', nameKey: 'planets.saturn' },
];

interface BirthChartProps {
    chartData: BirthChartData;
}

const BirthChart: React.FC<BirthChartProps> = ({ chartData }) => {
    const { t } = useTranslation();
    const size = 500;
    const center = size / 2;
    const zodiacRadius = center - 30;
    const planetRadii = [zodiacRadius - 30, zodiacRadius - 60, zodiacRadius - 90];

    const getPosition = (angle: number, radius: number) => {
        const rad = (angle - 90) * (Math.PI / 180);
        return {
            x: center + radius * Math.cos(rad),
            y: center + radius * Math.sin(rad),
        };
    };

    const planetsInSigns: { [key: string]: string[] } = zodiacSigns.reduce((acc, sign) => ({ ...acc, [sign.name]: [] }), {});
    
    (Object.keys(chartData) as Array<keyof BirthChartData>).forEach(planetKey => {
        const signName = chartData[planetKey];
        if (planetsInSigns[signName]) {
            planetsInSigns[signName].push(planetKey);
        }
    });

    return (
        <div className="bg-slate-900/50 rounded-lg p-4 md:p-6 border border-slate-700">
            <h3 className="text-3xl font-lalezar text-center mb-6 text-indigo-300">{t('birthChart.title')}</h3>
            <div className="grid md:grid-cols-3 gap-6 items-center">
                {/* SVG Chart */}
                <div className="md:col-span-2">
                    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-lg mx-auto">
                        <defs>
                             <radialGradient id="chartBg" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#1e293b" />
                                <stop offset="100%" stopColor="#0f172a" />
                            </radialGradient>
                        </defs>
                        <circle cx={center} cy={center} r={zodiacRadius + 15} fill="url(#chartBg)" />
                        <circle cx={center} cy={center} r={zodiacRadius + 15} stroke="#4f46e5" strokeWidth="1" />
                        
                        {/* Zodiac Segments and Signs */}
                        {zodiacSigns.map((sign, i) => {
                            const angle = i * 30;
                            const startPos = getPosition(angle, zodiacRadius + 15);
                            const signPos = getPosition(angle + 15, zodiacRadius);
                            return (
                                <g key={sign.name}>
                                    <line x1={center} y1={center} x2={startPos.x} y2={startPos.y} stroke="#374151" strokeWidth="1" />
                                    <text x={signPos.x} y={signPos.y} textAnchor="middle" dominantBaseline="central" fontSize="24" fill="#a5b4fc" className="font-bold">
                                        {sign.symbol}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Planets */}
                        {zodiacSigns.map((sign, i) => {
                             const planetsInSign = planetsInSigns[sign.name];
                             if (!planetsInSign || planetsInSign.length === 0) return null;

                             return planetsInSign.map((planetKey, planetIndex) => {
                                const angle = i * 30 + 15; // Center of the sign segment
                                const radius = planetRadii[planetIndex % planetRadii.length];
                                const pos = getPosition(angle, radius);
                                const planetInfo = planets.find(p => p.key === planetKey);
                                if (!planetInfo) return null;
                                
                                return (
                                     <text key={planetKey} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize="22" fill="#e0e7ff" className="font-bold drop-shadow-[0_0_3px_rgba(165,180,252,0.7)]">
                                        {planetInfo.symbol}
                                    </text>
                                );
                             });
                        })}

                        {/* Center cross */}
                        <line x1={center - 20} y1={center} x2={center + 20} y2={center} stroke="#4f46e5" strokeWidth="1" />
                        <line x1={center} y1={center - 20} x2={center} y2={center + 20} stroke="#4f46e5" strokeWidth="1" />
                    </svg>
                </div>
                {/* Data Table */}
                <div className="font-tanha">
                     <table className="w-full text-right">
                        <tbody>
                            {planets.map(p => {
                                const signName = chartData[p.key as keyof BirthChartData];
                                const signPersianKey = `zodiacs.${signName}`;
                                return (
                                    <tr key={p.key} className="border-b border-slate-700/50">
                                        <td className="py-2.5 pr-2 font-bold text-lg text-indigo-300">{p.symbol} {t(p.nameKey)}</td>
                                        <td className="py-2.5 text-lg text-gray-200">{t(signPersianKey)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                     </table>
                </div>
            </div>
        </div>
    );
};

export default BirthChart;
