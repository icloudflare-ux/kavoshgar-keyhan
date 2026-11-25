
import React from 'react';
import { motion, useMotionValue, useTransform} from 'framer-motion';
import { EphemerisData, PlanetName } from '../types';

const PLANET_SYMBOLS: { [key in PlanetName]?: string } = {
    Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄'
};

const Particle: React.FC<{ size: number; initialX: number; initialY: number; duration: number; delay: number; }> = ({ size, initialX, initialY, duration, delay }) => (
    <motion.div
        className="absolute rounded-full bg-white"
        style={{ width: size, height: size, left: `${initialX}%`, top: `${initialY}%` }}
        animate={{ opacity: [0.1, 0.8, 0.1] }}
        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
);

interface EphemerisVisualProps {
    planets: EphemerisData[];
}

const EphemerisVisual: React.FC<EphemerisVisualProps> = ({ planets }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };
    
    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    }
    
    return (
        <div 
            className="absolute inset-0 z-0 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1e1b4b_0%,_#0f172a_40%,_#020617_100%)]"></div>

            {/* Parallax Star Layers */}
            <motion.div className="absolute inset-0" style={{ x: useTransform(mouseX, v => v * 30), y: useTransform(mouseY, v => v * 30) }}>
                {[...Array(50)].map(i => <Particle key={i} size={0.5} initialX={Math.random()*100} initialY={Math.random()*100} duration={Math.random()*5+5} delay={Math.random()*5} />)}
            </motion.div>
            <motion.div className="absolute inset-0" style={{ x: useTransform(mouseX, v => v * 60), y: useTransform(mouseY, v => v * 60) }}>
                {[...Array(30)].map(i => <Particle key={i} size={1} initialX={Math.random()*100} initialY={Math.random()*100} duration={Math.random()*8+8} delay={Math.random()*8} />)}
            </motion.div>

            {/* Central Grid and Floating Planets */}
            <div className="absolute inset-0 flex items-center justify-center">
                 <motion.div 
                    className="relative w-[500px] h-[500px]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
                 >
                    <svg viewBox="0 0 500 500" className="opacity-20">
                        <defs><radialGradient id="gridGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="transparent"/></radialGradient></defs>
                        <circle cx="250" cy="250" r="240" stroke="url(#gridGlow)" strokeWidth="1" fill="none" />
                        <circle cx="250" cy="250" r="180" stroke="#818cf8" strokeWidth="0.5" fill="none" />
                        <circle cx="250" cy="250" r="120" stroke="#818cf8" strokeWidth="0.5" fill="none" />
                        {[...Array(12)].map((_, i) => <line key={i} x1="250" y1="10" x2="250" y2="490" stroke="#818cf8" strokeWidth="0.5" transform={`rotate(${i * 15} 250 250)`} />)}
                    </svg>

                    {planets.map((p, i) => {
                        const symbol = PLANET_SYMBOLS[p.planet];
                        if (!symbol) return null;
                        
                        const angle = (i / planets.length) * 360;
                        const radius = 150 + Math.sin(i) * 50;
                        const startX = radius * Math.cos(angle * Math.PI / 180);
                        const startY = radius * Math.sin(angle * Math.PI / 180);

                        return (
                             <motion.div
                                key={p.planet}
                                className="absolute top-1/2 left-1/2 text-3xl text-white drop-shadow-lg"
                                style={{ x: startX, y: startY }}
                                animate={{
                                    x: [startX, startX + (Math.random() - 0.5) * 40],
                                    y: [startY, startY + (Math.random() - 0.5) * 40],
                                }}
                                transition={{
                                    duration: Math.random() * 10 + 15,
                                    repeat: Infinity,
                                    repeatType: 'mirror',
                                    ease: 'easeInOut'
                                }}
                            >
                                {symbol}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
            
            {/* Nebula Overlays */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-sky-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
        </div>
    );
};

export default EphemerisVisual;
