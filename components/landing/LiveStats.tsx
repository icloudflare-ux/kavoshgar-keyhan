
import React from 'react';
import { motion, Variants } from 'framer-motion';

const LiveStats: React.FC = () => {
    const stats = [
        "بیش از ۱۵,۹۴۵ تحلیل موفق",
        "۱۱۴ تریدر آنلاین در حال استفاده",
        "سیگنال‌های VIP تریدرها",
        "تحلیل با هوش مصنوعی Gemini",
        "پادکست‌های آموزشی"
    ];

    
    const marqueeVariants: Variants = {
        animate: {
            x: [0, -1005], // Adjust based on content width
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 25,
                    ease: "linear",
                },
            },
        },
    };

    return (
        <div className="w-full py-4 bg-black/30 backdrop-blur-sm overflow-hidden border-y border-purple-500/20">
            <motion.div
                className="flex whitespace-nowrap"
                variants={marqueeVariants}
                animate="animate"
            >
                {[...stats, ...stats].map((stat, index) => (
                    <div key={index} className="flex items-center mx-8 text-lg font-tanha text-gray-300">
                        <span className="text-2xl ml-3">{['✨', '💹', '💡', '🤖', '🎧'][index % 5]}</span>
                        <span>{stat}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default LiveStats;