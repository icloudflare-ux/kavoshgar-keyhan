
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { solarSystemPlanets, SolarSystemPlanet } from '../data/planetData';
import { X } from 'lucide-react';

// Helper function to create a lighter shade for the gradient highlight
const lightenColor = (hex: string, percent: number): string => {
    const h = hex.startsWith('#') ? hex.slice(1) : hex;
    if (h.length !== 6) return hex;
    const p = percent / 100;
    
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);

    const newR = Math.min(255, Math.floor(r + (255 - r) * p)).toString(16).padStart(2, '0');
    const newG = Math.min(255, Math.floor(g + (255 - g) * p)).toString(16).padStart(2, '0');
    const newB = Math.min(255, Math.floor(b + (255 - b) * p)).toString(16).padStart(2, '0');

    return `#${newR}${newG}${newB}`;
};


const OrreryInfoPanel: React.FC<{ planet: SolarSystemPlanet, onClose: () => void }> = ({ planet, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-4 left-4 right-4 md:left-auto md:max-w-sm bg-slate-900/60 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 z-30 shadow-2xl"
        >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-full bg-slate-800/50 hover:bg-slate-700/70 transition-colors">
                <X size={20} />
            </button>
            <div className="flex items-center mb-4">
                <motion.span 
                    className="text-5xl" 
                    style={{ color: planet.color, textShadow: `0 0 15px ${planet.color}` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                >
                    {planet.symbol}
                </motion.span>
                <h3 className="text-4xl font-lalezar text-white mr-4">{planet.name}</h3>
            </div>
            <p className="font-tanha text-gray-300 leading-relaxed text-lg">{planet.description}</p>
        </motion.div>
    );
};

const Planet: React.FC<{ planet: SolarSystemPlanet; center: number; onSelect: (p: SolarSystemPlanet) => void; isSelected: boolean }> = ({ planet, center, onSelect, isSelected }) => {
    const rotate = useMotionValue(0);
    
    useEffect(() => {
        const animation = animate(rotate, 360, {
            duration: planet.speed,
            ease: 'linear',
            repeat: Infinity,
        });
        return animation.stop;
    }, [rotate, planet.speed]);
    
    // Depth perception transforms
    const scale = useTransform(rotate, [0, 90, 180, 270, 360], [1.1, 1, 0.9, 1, 1.1]);
    const opacity = useTransform(rotate, [0, 90, 180, 270, 360], [1, 1, 0.75, 1, 1]);

    // Use trigonometry to calculate the exact position on the circle
    const x = useTransform(rotate, v => center + Math.sin(v * Math.PI / 180) * planet.radius);
    const y = useTransform(rotate, v => center - Math.cos(v * Math.PI / 180) * planet.radius);

    return (
        <g>
            {/* The static orbit path */}
            <motion.circle
                cx={center} cy={center} r={planet.radius}
                fill="none" stroke="rgba(129, 140, 248, 0.2)" strokeWidth="1"
                animate={{
                    stroke: isSelected ? planet.color : 'rgba(129, 140, 248, 0.2)',
                    strokeWidth: isSelected ? 2 : 1,
                }}
                transition={{ duration: 0.5 }}
            />
            
            {/* The planet group, positioned directly using calculated x and y */}
            <motion.g 
                onClick={() => onSelect(planet)}
                className="cursor-pointer"
                whileHover={{ scale: 1.4, zIndex: 10 }}
                style={{
                    translateX: x,
                    translateY: y,
                    scale,
                    opacity,
                }}
            >
                {/* The planet visuals are drawn at (0,0) relative to the group's new position */}
                <g>
                    <motion.circle
                        r={planet.size}
                        fill={`url(#planet-gradient-${planet.id})`}
                        style={{ filter: `drop-shadow(0 0 8px ${planet.color})` }}
                    />
                    {planet.ring && (
                        <ellipse
                            cx="0"
                            cy="0"
                            rx={planet.size * 1.8}
                            ry={planet.size * 0.6}
                            fill="none"
                            stroke={planet.color}
                            strokeWidth="1.5"
                            transform="rotate(-20)"
                            opacity="0.8"
                            style={{ filter: `drop-shadow(0 0 5px ${planet.color})` }}
                        />
                    )}
                </g>
            </motion.g>
        </g>
    );
};


const SolarSystemOrrery: React.FC = () => {
    const [selectedPlanet, setSelectedPlanet] = useState<SolarSystemPlanet | null>(null);
    const size = 800;
    const center = size / 2;

    return (
        <section id="orrery" className="relative h-[90vh] min-h-[700px] flex flex-col items-center justify-center overflow-hidden py-8">
             <h3 className="text-4xl md:text-5xl font-bold text-center mb-4 font-lalezar tracking-wider bg-gradient-to-r from-purple-400 to-fuchsia-500 text-transparent bg-clip-text">
                {"منظومه شمسی"}
            </h3>
            
            <div className="flex-grow w-full flex items-center justify-center my-4 min-h-0">
                <div className="relative w-full h-full max-w-[800px] max-h-[800px]">
                    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
                        <defs>
                             <filter id="sun-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                             <radialGradient id="sun-gradient" cx="30%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#fffbeb" />
                                <stop offset="60%" stopColor="#fef3c7" />
                                <stop offset="100%" stopColor="#fde68a" />
                            </radialGradient>
                            {solarSystemPlanets.map(p => {
                                if (p.id === 'sun') return null;
                                const lighterColor = lightenColor(p.color, 40);
                                return (
                                    <radialGradient key={`grad-${p.id}`} id={`planet-gradient-${p.id}`} cx="30%" cy="30%" r="70%">
                                        <stop offset="0%" stopColor={lighterColor} />
                                        <stop offset="100%" stopColor={p.color} />
                                    </radialGradient>
                                );
                             })}
                        </defs>
                        
                        {/* Sun */}
                        <g filter="url(#sun-glow-filter)">
                           <circle cx={center} cy={center} r={40} fill="url(#sun-gradient)" />
                           <motion.circle 
                                cx={center} cy={center} r={45} 
                                fill="none" stroke="#fef3c7" strokeWidth="2"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: [0, 0.7, 0], scale: [0.9, 1.1, 0.9] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                           />
                        </g>

                        {solarSystemPlanets.map(planet => {
                            if (planet.id === 'sun') return null;
                            return (
                                <Planet 
                                    key={planet.id}
                                    planet={planet}
                                    center={center}
                                    onSelect={setSelectedPlanet}
                                    isSelected={selectedPlanet?.id === planet.id}
                                />
                            );
                        })}
                    </svg>
                </div>
            </div>

             <p className="text-center text-gray-400 max-w-2xl mx-auto font-tanha text-lg leading-relaxed px-4">
                {"روی هر سیاره کلیک کنید تا اطلاعات نجومی و باطنی آن را مشاهده کنید."}
            </p>

             <AnimatePresence>
                {selectedPlanet && <OrreryInfoPanel planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />}
             </AnimatePresence>
        </section>
    );
};

export default SolarSystemOrrery;
