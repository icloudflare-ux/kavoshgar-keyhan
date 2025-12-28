
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PlanetPosition, PlanetName, Aspect, ZodiacSignName } from '../types';
import { PlanetaryPositionsMap } from '../services/astrologyEngine';
import { calculateAspects, ASPECT_INFO } from '../utils/astrology';
import { useZodiacData } from '../data/zodiacData';
import { useDignitiesData } from '../data/dignitiesData';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// --- Type Definitions ---
type PointerInteractionEvent = MouseEvent | TouchEvent | PointerEvent;

// --- Data & Helpers ---
const PLANET_INFO: { [key in PlanetName]?: { symbol: string; color: string; nameKey: string } } = {
    Sun: { symbol: '☉', color: '#f59e0b', nameKey: 'planets.sun' },
    Moon: { symbol: '☽', color: '#cbd5e1', nameKey: 'planets.moon' },
    Mercury: { symbol: '☿', color: '#a1a1aa', nameKey: 'planets.mercury' },
    Venus: { symbol: '♀', color: '#f472b6', nameKey: 'planets.venus' },
    Mars: { symbol: '♂', color: '#ef4444', nameKey: 'planets.mars' },
    Jupiter: { symbol: '♃', color: '#818cf8', nameKey: 'planets.jupiter' },
    Saturn: { symbol: '♄', color: '#fcd34d', nameKey: 'planets.saturn' },
    Ascendant: { symbol: 'AC', color: '#6ee7b7', nameKey: 'planets.ascendant' },
    Midheaven: { symbol: 'MC', color: '#93c5fd', nameKey: 'planets.midheaven' },
};

const polarToCartesian = (cx: number, cy: number, radius: number, angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180.0);
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
};

const describeArcSegment = (x: number, y: number, startRadius: number, endRadius: number, startAngle: number, endAngle: number) => {
    const startOuter = polarToCartesian(x, y, endRadius, endAngle);
    const endOuter = polarToCartesian(x, y, endRadius, startAngle);
    const startInner = polarToCartesian(x, y, startRadius, endAngle);
    const endInner = polarToCartesian(x, y, startRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
        "M", startOuter.x, startOuter.y,
        "A", endRadius, endRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
        "L", endInner.x, endInner.y,
        "A", startRadius, startRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
        "Z"
    ].join(" ");

    return d;
};

const describeGaugeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
    return d;
};

const formatDegree = (degree: number) => `${Math.floor(degree)}° ${Math.round((degree % 1) * 60)}'`;

// --- Tooltip Component ---

interface TooltipInfo {
    planet: PlanetPosition;
    x: number;
    y: number;
}

const Tooltip: React.FC<{ info: TooltipInfo | null }> = ({ info }) => {
    const { t } = useTranslation();
    if (!info) return null;
    const planetInfo = PLANET_INFO[info.planet.planet];
    if (!planetInfo) return null;
    
    return (
        <div 
            className="absolute p-2 bg-slate-900/80 backdrop-blur-sm border border-slate-600 rounded-lg text-sm text-white pointer-events-none transition-opacity duration-200 shadow-lg z-20"
            style={{ left: info.x, top: info.y, transform: 'translate(-50%, -120%)' }}
        >
            <div className="font-bold flex items-center gap-2">
                <span style={{ color: planetInfo.color }}>{planetInfo.symbol}</span>
                <span>{t(planetInfo.nameKey)}</span>
            </div>
            <div className="font-roboto-mono text-xs mt-1 text-gray-300">
                {formatDegree(info.planet.degree)} {info.planet.sign}
            </div>
        </div>
    );
};

// --- InfoPanel Component ---
const InfoPanel: React.FC<{ score: number | null; planetInfo: TooltipInfo | null }> = ({ score, planetInfo }) => {
    const { t } = useTranslation();
    const planetData = planetInfo?.planet;
    const planetStaticInfo = planetData ? PLANET_INFO[planetData.planet] : null;

    const scoreColor = score === null ? 'text-gray-400' : score > 0 ? 'text-green-400' : 'text-red-400';

    return (
        <div className="absolute top-2 right-2 w-48 bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 text-sm z-10 pointer-events-none">
            {score !== null && (
                 <div className="flex justify-between items-center">
                    <h4 className="font-lalezar text-base text-indigo-300">{"امتیاز بازار"}</h4>
                    <p className={`font-roboto-mono text-lg font-bold ${scoreColor}`}>{score > 0 ? '+' : ''}{score}</p>
                </div>
            )}
            <div className="border-t border-slate-600 my-2"></div>
            <h4 className="font-lalezar text-base text-indigo-300">{"سیاره منتخب"}</h4>
            <div className="min-h-[40px] flex flex-col justify-center">
                 <AnimatePresence mode="wait">
                    {planetData && planetStaticInfo ? (
                        <motion.div
                            key={planetData.planet}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center gap-2 font-bold mt-1">
                                <span style={{ color: planetStaticInfo.color }} className="text-xl">{planetStaticInfo.symbol}</span>
                                <span>{t(planetStaticInfo.nameKey)}</span>
                            </div>
                            <div className="font-roboto-mono text-xs mt-1 text-gray-300">
                                {formatDegree(planetData.degree)} {planetData.sign}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-slate-400 text-xs text-center py-2"
                        >
                           {"روی سیارات نگه دارید"}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


// --- Main Chart Component ---

interface ZodiacChartProps {
    zodiacData: PlanetaryPositionsMap | null;
    score: number | null;
}

const ZodiacChart: React.FC<ZodiacChartProps> = ({ zodiacData, score }) => {
    const [hoverInfo, setHoverInfo] = useState<TooltipInfo | null>(null);
    const [pinnedInfo, setPinnedInfo] = useState<TooltipInfo | null>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const zodiacSignsInfo = useZodiacData();
    const { dignities } = useDignitiesData();
    const size = 600;
    const center = size / 2;
    const PLANET_BASE_RADIUS = center - 120;

    const elementColors: { [key: string]: string } = {
        'آتش': 'rgba(239, 68, 68, 0.2)',
        'خاک': 'rgba(16, 185, 129, 0.2)',
        'هوا': 'rgba(234, 179, 8, 0.2)',
        'آب': 'rgba(59, 130, 246, 0.2)',
    };

    const tooltipInfo = pinnedInfo || hoverInfo;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
                setPinnedInfo(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { planetsWithDisplayData, aspects, fortunaAngle } = useMemo(() => {
        if (!zodiacData) return { planetsWithDisplayData: [], aspects: [], fortunaAngle: 0 };
        
        const planetsArray = Object.entries(zodiacData)
            .map(([planet, data]) => {
                if (!data) return null;
                const typedData = data as { sign: ZodiacSignName; signDegree: number; degree: number };
                return {
                    planet: planet as PlanetName,
                    sign: typedData.sign,
                    degree: typedData.signDegree,
                    absoluteDegree: typedData.degree
                };
            })
            .filter((p): p is PlanetPosition & { absoluteDegree: number } => p !== null)
            .sort((a, b) => a.absoluteDegree - b.absoluteDegree);
        
        const calculatedAspects: Aspect[] = calculateAspects(planetsArray);

        const processedPlanets = planetsArray.map(p => ({ ...p, displayRadius: PLANET_BASE_RADIUS }));
        const COLLISION_THRESHOLD = 12;

        for (let i = 0; i < processedPlanets.length; i++) {
            const currentPlanet = processedPlanets[i];
            const prevPlanet = processedPlanets[(i - 1 + processedPlanets.length) % processedPlanets.length];
            let diff = Math.abs(currentPlanet.absoluteDegree - prevPlanet.absoluteDegree);
            if (diff > 180) diff = 360 - diff;
            if (diff < COLLISION_THRESHOLD) {
                if (prevPlanet.displayRadius === PLANET_BASE_RADIUS) currentPlanet.displayRadius = PLANET_BASE_RADIUS + 25;
            }
        }
        
        const normalizedScore = score !== null ? (score + 100) / 200 : 0.5; // from [-100, 100] to [0, 1]
        const angleRange = 240; // The gauge arc is from -120 to +120 degrees
        const finalAngle = (normalizedScore * angleRange) - (angleRange / 2);

        return { planetsWithDisplayData: processedPlanets, aspects: calculatedAspects, fortunaAngle: finalAngle };

    }, [zodiacData, PLANET_BASE_RADIUS, score]);

    const calculateTooltipPosition = (target: SVGElement, planet: PlanetPosition): TooltipInfo => {
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (!svgRect) {
            console.warn("ZodiacChart: Could not find SVG container to calculate tooltip position.");
            return { planet, x: 0, y: 0 };
        }
        const elementRect = target.getBoundingClientRect();
        return {
            planet,
            x: elementRect.left + elementRect.width / 2 - svgRect.left,
            y: elementRect.top - svgRect.top,
        };
    };

    const handlePlanetHoverStart = (event: MouseEvent, planet: PlanetPosition) => {
        if (!event.currentTarget) return;
        if (!pinnedInfo) {
            setHoverInfo(calculateTooltipPosition(event.currentTarget as SVGElement, planet));
        }
    };
    
    const handlePlanetHoverEnd = () => {
        setHoverInfo(null);
    };

    const handlePlanetTap = (event: PointerInteractionEvent, planet: PlanetPosition) => {
        setHoverInfo(null);
        if (!event.currentTarget) return; // Prevent error on unmount
        if (pinnedInfo?.planet.planet === planet.planet) {
            setPinnedInfo(null);
        } else {
            setPinnedInfo(calculateTooltipPosition(event.currentTarget as SVGElement, planet));
        }
    };

    const getDignityFilter = (planetName: PlanetName, sign: ZodiacSignName) => {
        if (planetName === 'Ascendant' || planetName === 'Midheaven') return 'url(#glow-neutral)';
        
        const dignityData = dignities[planetName.toLowerCase() as keyof typeof dignities];
        const dignityInfo = dignityData ? dignityData[sign.toLowerCase()] : null;

        if (!dignityInfo) return 'url(#glow-neutral)';

        switch (dignityInfo.type) {
            case 'در خانه (حاکمیت)':
            case 'در شرف':
                return 'url(#glow-strong)';
            case 'در وبال':
            case 'در هبوط':
                return 'url(#glow-weak)';
            default:
                return 'url(#glow-neutral)';
        }
    };
    
    return (
        <div ref={chartRef} className="relative w-full max-w-lg mx-auto">
            <InfoPanel score={score} planetInfo={tooltipInfo} />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <svg 
                    ref={svgRef}
                    viewBox={`0 0 ${size} ${size}`} 
                    className="w-full font-sans drop-shadow-[0_0_20px_var(--color-shadow-hover)] overflow-visible"
                >
                    <defs>
                        <filter id="glow-neutral" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
                            <feFlood result="flood" floodColor="#fcd34d" floodOpacity="1"></feFlood>
                            <feComposite in="flood" in2="SourceGraphic" operator="in" result="color-out"></feComposite>
                            <feGaussianBlur in="color-out" stdDeviation="6" result="blur-out"></feGaussianBlur>
                            <feMerge><feMergeNode in="blur-out" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="glow-weak" x="-50%" y="-50%" width="200%" height="200%">
                            <feFlood result="flood" floodColor="#94a3b8" floodOpacity="0.8"></feFlood>
                            <feComposite in="flood" in2="SourceGraphic" operator="in" result="color-out"></feComposite>
                            <feGaussianBlur in="color-out" stdDeviation="2" result="blur-out"></feGaussianBlur>
                            <feMerge><feMergeNode in="blur-out" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="needle-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <circle cx={center} cy={center} r={center - 10} fill="rgba(15, 23, 42, 0.3)" stroke="rgba(129, 140, 248, 0.2)" strokeWidth="1" className="backdrop-blur-lg" />
                    
                    {zodiacSignsInfo.map((sign, i) => {
                        const startAngle = i * 30;
                        const endAngle = startAngle + 30;
                        const namePos = polarToCartesian(center, center, center - 25, startAngle + 15);
                        const symbolPos = polarToCartesian(center, center, center - 50, startAngle + 15);
                        return (
                            <g key={sign.modern}>
                                <path
                                    d={describeArcSegment(center, center, center - 70, center - 10, startAngle, endAngle)}
                                    fill={elementColors[sign.element]}
                                    stroke="rgba(71, 85, 105, 0.3)"
                                    strokeWidth="0.5"
                                />
                                <text x={namePos.x} y={namePos.y} textAnchor="middle" dominantBaseline="central" fontSize="16" fill="#a5b4fc" className="font-lalezar">{sign.traditional}</text>
                                <text x={symbolPos.x} y={symbolPos.y} textAnchor="middle" dominantBaseline="central" fontSize="24" fill={sign.iconColor} opacity="0.8">{sign.symbol}</text>
                            </g>
                        );
                    })}

                    <circle cx={center} cy={center} r={center - 70} fill="rgba(2, 6, 23, 0.5)" stroke="rgba(129, 140, 248, 0.2)" strokeWidth="0.5" />
                    
                    <g opacity="0.5">
                        <path d={describeGaugeArc(center, center, center - 85, -120, -40)} stroke="#ef4444" strokeWidth="10" fill="none" />
                        <path d={describeGaugeArc(center, center, center - 85, -40, 40)} stroke="#facc15" strokeWidth="10" fill="none" />
                        <path d={describeGaugeArc(center, center, center - 85, 40, 120)} stroke="#22c55e" strokeWidth="10" fill="none" />
                    </g>

                    <g opacity="0.7">
                        {aspects.map((aspect, i) => {
                            const aspectInfo = ASPECT_INFO[aspect.type];
                            if (aspectInfo.angle === 0) return null;
                            const planet1 = planetsWithDisplayData.find(p => p.planet === aspect.planet1.planet);
                            const planet2 = planetsWithDisplayData.find(p => p.planet === aspect.planet2.planet);
                            if (!planet1 || !planet2) return null;
                            
                            const pos1 = polarToCartesian(center, center, center - 190, planet1.absoluteDegree);
                            const pos2 = polarToCartesian(center, center, center - 190, planet2.absoluteDegree);
                            
                            return (
                                <motion.line
                                    key={`aspect-${i}`}
                                    x1={pos1.x} y1={pos1.y}
                                    x2={pos2.x} y2={pos2.y}
                                    stroke={aspectInfo.color}
                                    strokeWidth={Math.max(0.5, 2.5 - aspect.orb / 3)}
                                    strokeDasharray={aspectInfo.type === 'challenging' ? '4 2' : 'none'}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                                    style={{ filter: 'url(#glow-neutral)' }}
                                />
                            );
                        })}
                    </g>
                    
                    {planetsWithDisplayData.map((planet, i) => {
                        const planetInfo = PLANET_INFO[planet.planet];
                        if (!planetInfo) return null;
                        const pos = polarToCartesian(center, center, (planet as any).displayRadius, planet.absoluteDegree);
                        
                        return (
                            <motion.g 
                                key={`planet-${planet.planet}`} 
                                transform={`translate(${pos.x}, ${pos.y})`}
                                onHoverStart={(event) => handlePlanetHoverStart(event as unknown as MouseEvent, planet)}
                                onHoverEnd={handlePlanetHoverEnd}
                                onTap={(event) => handlePlanetTap(event as unknown as PointerInteractionEvent, planet)}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
                            >
                                <circle r="20" fill="rgba(15, 23, 42, 0.5)" />
                                <text 
                                    textAnchor="middle" 
                                    dominantBaseline="central" 
                                    fontSize="22" 
                                    fill={planetInfo.color} 
                                    className="font-bold cursor-pointer"
                                    style={{ filter: getDignityFilter(planet.planet, planet.sign) }}
                                >
                                    {planetInfo.symbol}
                                </text>
                            </motion.g>
                        );
                    })}

                    <motion.g
                        animate={{ rotate: fortunaAngle }}
                        transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 1.2 }}
                        style={{ transformOrigin: `${center}px ${center}px` }}
                    >
                        <path 
                            d={`M ${center} ${center + 15} L ${center - 5} ${center} L ${center} ${center - 95} L ${center + 5} ${center} Z`}
                            fill="var(--color-accent, #f59e0b)"
                            filter="url(#needle-glow)"
                        />
                        <circle cx={center} cy={center} r="8" fill="#1e293b" stroke="var(--color-accent, #f59e0b)" strokeWidth="2" />
                    </motion.g>

                </svg>
            </motion.div>
            <Tooltip info={tooltipInfo} />
        </div>
    );
};

export default ZodiacChart;
