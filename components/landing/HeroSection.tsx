
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
    const handleCTAClick = () => {
        const calculatorSection = document.getElementById('pricing');
        if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center text-center px-4 relative">
            {/* The div containing the clock has been removed from here. */}
            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white font-lalezar tracking-wide drop-shadow-[0_0_25px_rgba(167,139,250,0.5)]">
                    {"آینده ترید شما در "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                        {"ستاره‌ها"}
                    </span>
                    {" نوشته شده است"}
                </h1>
                <motion.p
                    className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-tanha leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    {'اولین پلتفرم هوشمند ترکیب نجوم باستانی و تحلیل‌های مدرن مالی برای شناسایی زمان‌های طلایی بازار.'}
                </motion.p>
                <motion.div
                    className="mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                >
                    <motion.button
                        onClick={handleCTAClick}
                        className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold py-4 px-10 rounded-full transition-all duration-300 font-lalezar text-2xl tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-400/50"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {"همین حالا چارت خود را تحلیل کنید"}
                    </motion.button>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
