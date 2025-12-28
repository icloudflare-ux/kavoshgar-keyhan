
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ListChecks, CheckCircle2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.15, ease: "easeOut" } },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.05
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0 }
};

const features = [
    { text: "تحلیل جامع پروفایل (ابجد و طبع)", anchorId: "text-analysis" },
    { text: "چارت تعاملی (سیارات و زوایا)", anchorId: "zodiac-chart" },
    { text: "هوش تریدینگ (امتیاز بازار)", anchorId: "trading-oracle" },
    { text: "خروجی لوح کیهانی (PNG)", anchorId: "export-slate" },
    { text: "مدیریت پروفایل‌ها (ذخیره Real-time)", anchorId: "profile-manager-anchor" },
];

const FeatureChecklist: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { addToast } = useToast();

    const scrollToSection = (anchorId: string) => {
        const element = document.getElementById(anchorId);
        if (element) {
            const headerOffset = 120; // Offset for the fixed header + user stats bar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            // Close the menu after jumping
            setIsOpen(false);
        } else {
            addToast('لطفاً ابتدا تحلیل را دریافت کنید تا این بخش نمایش داده شود.', 'warning', '⚠️');
        }
    };

    return (
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button 
                className="p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-hover-bg)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/80 focus:ring-offset-slate-900" 
                aria-label="چک‌لیست قابلیت‌ها"
            >
                <ListChecks size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={dropdownVariants}
                        className="absolute ltr:right-0 rtl:left-0 mt-2 p-4 w-80 bg-slate-900/70 backdrop-blur-md border border-purple-500/30 rounded-2xl shadow-lg shadow-purple-500/10 z-50"
                    >
                        <motion.h4 
                            variants={itemVariants} 
                            className="font-lalezar text-xl text-indigo-300 border-b border-slate-700/50 pb-2 mb-3"
                        >
                            چک‌لیست قابلیت‌های کلیدی
                        </motion.h4>
                        <ul className="space-y-2 font-tanha">
                            {features.map((feature, index) => (
                                <motion.li key={index} variants={itemVariants}>
                                    <button
                                        onClick={() => feature.anchorId && scrollToSection(feature.anchorId)}
                                        className={`w-full flex items-start text-left p-2 rounded-md transition-colors ${
                                            feature.anchorId 
                                                ? 'cursor-pointer hover:bg-indigo-500/20' 
                                                : 'cursor-default'
                                        }`}
                                        disabled={!feature.anchorId}
                                    >
                                        <CheckCircle2 size={20} className="text-green-400 flex-shrink-0 mt-0.5 mr-3" />
                                        <span className="text-gray-200">{feature.text}</span>
                                    </button>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FeatureChecklist;
