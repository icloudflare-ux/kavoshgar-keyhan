import React from 'react';
import { motion, Transition } from 'framer-motion';

// A small component for a single star/dust particle to keep the main component clean
const Particle: React.FC<{ delay: number; duration: number; size: number; top: number; left: number; isDust?: boolean; }> = ({ delay, duration, size, top, left, isDust = false }) => {
    const animation = isDust
        ? {
            x: [0, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * 40 - 20, 0],
            opacity: [0, 0.4, 0],
          }
        : {
            opacity: [0.3, 1, 0.3],
          };
    const transition: Transition = {
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
    };

    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: 'white',
                filter: isDust ? 'blur(2px)' : 'none',
            }}
            animate={animation}
            transition={transition}
        />
    );
};

const ZodiacBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* 1. Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1e1b4b_0%,_#0f172a_70%)]" />

            {/* 2. Twinkling Stars & Floating Dust */}
            <div className="absolute inset-0">
                {[...Array(150)].map((_, i) => (
                    <Particle
                        key={`star-${i}`}
                        delay={Math.random() * 5}
                        duration={Math.random() * 3 + 2}
                        size={Math.random() * 1.5 + 0.5}
                        top={Math.random() * 100}
                        left={Math.random() * 100}
                    />
                ))}
                 {[...Array(10)].map((_, i) => (
                     <Particle
                        key={`dust-${i}`}
                        delay={Math.random() * 10}
                        duration={Math.random() * 15 + 10}
                        size={Math.random() * 3 + 1}
                        top={Math.random() * 100}
                        left={Math.random() * 100}
                        isDust={true}
                    />
                ))}
            </div>

            {/* 3. Central Pulsing Glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(139,92,246,0.2)_0%,transparent_70%)]"
                style={{transform: 'translate(-50%, -50%)'}}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* 4. Nebula Overlays */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-sky-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
        </div>
    );
};

export default ZodiacBackground;
