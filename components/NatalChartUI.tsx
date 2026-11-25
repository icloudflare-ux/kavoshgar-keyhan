
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
const InfoPanel: React.FC<{ planetInfo: TooltipInfo | null }> = ({ planetInfo }) => {
    const { t } = useTranslation();
    const planetData = planetInfo?.planet;
    const planetStaticInfo = planetData ? PLANET_INFO[planetData.planet] : null;

    return (
        <div className="absolute top-2 right-2 w-48 bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 text-sm z-10 pointer-events-none">
            <h4 className="font-lalezar text-base text-indigo-300 border-b border-slate-600 pb-1 mb-2">{"سیاره منتخب"}</h4>
            <AnimatePresence mode="wait">
                {planetData && planetStaticInfo ? (
                    <motion.div
                        key={planetData.planet}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center gap-2 font-bold">
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
    );
};

// --- Main Chart Component ---

interface NatalChartUIProps {
    zodiacData: PlanetaryPositionsMap | null;
}

const NatalChartUI: React.FC<NatalChartUIProps> = ({ zodiacData }) => {
    const [hoverInfo, setHoverInfo] = useState<TooltipInfo | null>(null);
    const [pinnedInfo, setPinnedInfo] = useState<TooltipInfo | null>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const zodiacSignsInfo = useZodiacData();
    const { dignities } = useDignitiesData();
    const size = 600;
    const center = size / 2;

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

    const { planets, aspects } = useMemo(() => {
        if (!zodiacData) return { planets: [], aspects: [] };
        
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
            .filter((p): p is PlanetPosition & { absoluteDegree: number } => p !== null);
        
        const calculatedAspects: Aspect[] = calculateAspects(planetsArray);
        
        return { planets: planetsArray, aspects: calculatedAspects };
    }, [zodiacData]);
    
    const calculateTooltipPosition = (target: SVGElement, planet: PlanetPosition): TooltipInfo => {
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (!svgRect) {
            console.warn("NatalChartUI: Could not find SVG container to calculate tooltip position.");
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
        setHoverInfo(null); // Hide hover tooltip on tap
        if (!event.currentTarget) return; // Prevent error on unmount
        if (pinnedInfo?.planet.planet === planet.planet) {
            setPinnedInfo(null); // Unpin if tapping the same planet
        } else {
            setPinnedInfo(calculateTooltipPosition(event.currentTarget as SVGElement, planet));
        }
    };

    const getDignityFilter = (planetName: PlanetName, sign: ZodiacSignName) => {
        // Ascendant and Midheaven don't have dignities
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
        <div ref={chartRef} className="relative w-full max-w-xl mx-auto">
            <InfoPanel planetInfo={tooltipInfo} />
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <svg 
                    ref={svgRef}
                    viewBox={`0 0 ${size} ${size}`} 
                    className="w-full font-sans drop-shadow-2xl overflow-visible"
                >
                    <defs>
                        {/* Neutral Glow */}
                        <filter id="glow-neutral" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        {/* Strong Glow (Rulership/Exaltation) */}
                        <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
                            <feFlood result="flood" floodColor="#fcd34d" floodOpacity="1"></feFlood>
                            <feComposite in="flood" in2="SourceGraphic" operator="in" result="color-out"></feComposite>
                            <feGaussianBlur in="color-out" stdDeviation="6" result="blur-out"></feGaussianBlur>
                            <feMerge><feMergeNode in="blur-out" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        {/* Weak Glow (Fall/Detriment) */}
                        <filter id="glow-weak" x="-50%" y="-50%" width="200%" height="200%">
                            <feFlood result="flood" floodColor="#94a3b8" floodOpacity="0.8"></feFlood>
                            <feComposite in="flood" in2="SourceGraphic" operator="in" result="color-out"></feComposite>
                            <feGaussianBlur in="color-out" stdDeviation="2" result="blur-out"></feGaussianBlur>
                            <feMerge><feMergeNode in="blur-out" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>

                    {/* Glassmorphism Wheel Body */}
                    <circle cx={center} cy={center} r={center - 10} fill="rgba(15, 23, 42, 0.3)" stroke="rgba(129, 140, 248, 0.2)" strokeWidth="1" className="backdrop-blur-lg" />
                    <circle cx={center} cy={center} r={center - 70} fill="rgba(2, 6, 23, 0.5)" stroke="rgba(129, 140, 248, 0.2)" strokeWidth="0.5" />
                    
                    {/* Zodiac Ring */}
                    {zodiacSignsInfo.map((sign, i) => {
                        const angle = i * 30;
                        const lineEnd = polarToCartesian(center, center, center - 10, angle);
                        const namePos = polarToCartesian(center, center, center - 25, angle + 15);
                        const symbolPos = polarToCartesian(center, center, center - 50, angle + 15);
                        return (
                            <g key={sign.modern}>
                                <line x1={center} y1={center} x2={lineEnd.x} y2={lineEnd.y} stroke="rgba(71, 85, 105, 0.5)" strokeWidth="1" />
                                <text x={namePos.x} y={namePos.y} textAnchor="middle" dominantBaseline="central" fontSize="16" fill="#a5b4fc" className="font-lalezar">{sign.traditional}</text>
                                <text x={symbolPos.x} y={symbolPos.y} textAnchor="middle" dominantBaseline="central" fontSize="24" fill={sign.iconColor} opacity="0.8">{sign.symbol}</text>
                            </g>
                        );
                    })}
                    
                    {/* Aspect Lines */}
                    <g opacity="0.7">
                        {aspects.map((aspect, i) => {
                            const aspectInfo = ASPECT_INFO[aspect.type];
                            if (aspectInfo.angle === 0) return null;

                            const planet1 = planets.find(p => p.planet === aspect.planet1.planet);
                            const planet2 = planets.find(p => p.planet === aspect.planet2.planet);
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
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                                    style={{ filter: 'url(#glow-neutral)' }}
                                />
                            );
                        })}
                    </g>
                    
                    {/* Planets Ring */}
                    {planets.map((planet, i) => {
                        const planetInfo = PLANET_INFO[planet.planet];
                        if (!planetInfo) return null;
                        const pos = polarToCartesian(center, center, center - 120, planet.absoluteDegree);
                        
                        return (
                            <motion.g 
                                key={`planet-${planet.planet}`} 
                                transform={`translate(${pos.x}, ${pos.y})`}
                                onHoverStart={(event) => handlePlanetHoverStart(event as unknown as MouseEvent, planet)}
                                onHoverEnd={handlePlanetHoverEnd}
                                onTap={(event) => handlePlanetTap(event as unknown as PointerInteractionEvent, planet)}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
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

                </svg>
            </motion.div>
            <Tooltip info={tooltipInfo} />
        </div>
    );
};

export default NatalChartUI;
