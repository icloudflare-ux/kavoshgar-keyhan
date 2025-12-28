
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, Transition, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// Particle for attraction effect on button hover
const AttractionParticle: React.FC = () => {
    const angle = Math.random() * 360;
    const radius = Math.random() * 100 + 80; // Start further out
    const startX = radius * Math.cos(angle * Math.PI / 180);
    const startY = radius * Math.sin(angle * Math.PI / 180);

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-amber-300 rounded-full pointer-events-none"
            style={{ filter: 'blur(1px)' }}
            initial={{ x: startX, y: startY, opacity: 1, scale: Math.random() * 0.8 + 0.5 }}
            animate={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: Math.random() * 0.8 + 0.4, ease: 'easeOut' }}
        />
    );
};


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

const CosmicHeroVisual: React.FC = () => {
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    useEffect(() => {
        // Simple check for touch capabilities
        const checkTouch = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(checkTouch());
    }, []);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
    };
    
    // Parallax transformations for different layers
    const starsX = useTransform(x, [-500, 500], [15, -15]);
    const starsY = useTransform(y, [-500, 500], [15, -15]);
    const dustX = useTransform(x, [-500, 500], [30, -30]);
    const dustY = useTransform(y, [-500, 500], [30, -30]);

    // Spring-animated values for smooth glow following
    const springConfig = { damping: 20, stiffness: 100, mass: 1 };
    const glowX = useSpring(useTransform(x, [-500, 500], [-40, 40]), springConfig);
    const glowY = useSpring(useTransform(y, [-500, 500], [-40, 40]), springConfig);

    
    // Gentle automatic sway animation for touch devices
    const gentleSway = (duration: number) => {
        const transition: Transition = {
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatType: 'mirror',
        };
        return {
            animate: { x: [0, 5, -5, 0], y: [0, -5, 5, 0] },
            transition,
        };
    };


    const handleCTAClick = () => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section 
            className="relative flex items-center justify-center min-h-screen overflow-hidden text-center text-white px-4"
            onMouseMove={!isTouchDevice ? handleMouseMove : undefined}
            onMouseLeave={!isTouchDevice ? () => { x.set(0); y.set(0); } : undefined}
        >
            {/* 1. Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1e1b4b_0%,_#0f172a_70%)]" />

            {/* 2. Twinkling Stars & Floating Dust with Parallax */}
            <motion.div 
                className="absolute inset-0 z-0"
                style={!isTouchDevice ? { x: starsX, y: starsY } : {}}
                {...(isTouchDevice ? gentleSway(20) : {})}
            >
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
            </motion.div>
            <motion.div 
                className="absolute inset-0 z-0"
                style={!isTouchDevice ? { x: dustX, y: dustY } : {}}
                {...(isTouchDevice ? gentleSway(15) : {})}
            >
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
            </motion.div>

            {/* 3. Central Pulsing Glow with Mouse Follow */}
            <motion.div
                className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(139,92,246,0.2)_0%,transparent_70%)]"
                style={!isTouchDevice ? { x: glowX, y: glowY } : {}}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* 4. Content */}
            <motion.div
                className="relative z-10"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.3 } }
                }}
            >
                <motion.h1
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white font-lalezar tracking-wide drop-shadow-[0_0_25px_rgba(167,139,250,0.5)]"
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
                >
                    {"آینده ترید شما در "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                        {"ستاره‌ها"}
                    </span>
                    {" نوشته شده است"}
                </motion.h1>
                <motion.p
                    className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-tanha leading-relaxed"
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
                >
                    {'اولین پلتفرم هوشمند ترکیب نجوم باستانی و تحلیل‌های مدرن مالی برای شناسایی زمان‌های طلایی بازار.'}
                </motion.p>
                
                <motion.div
                    className="mt-12"
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
                >
                    <div 
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
                        className="inline-block group glowing-button-container rounded-full relative"
                    >
                         <AnimatePresence>
                            {isButtonHovered && [...Array(20)].map((_, i) => (
                                <AttractionParticle key={i} />
                            ))}
                        </AnimatePresence>
                        <button
                            onClick={handleCTAClick}
                            className="relative bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold py-4 px-10 rounded-full transition-all duration-300 font-lalezar text-2xl tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-400/50"
                        >
                           <span className="flex items-center justify-center">
                               {"همین حالا چارت خود را تحلیل کنید"}
                               <ChevronRight className="w-8 h-8 mr-2 group-hover:translate-x-1 transition-transform" />
                           </span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default CosmicHeroVisual;