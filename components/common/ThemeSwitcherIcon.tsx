import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeSwitcherIconProps {
  theme: 'dark' | 'light';
}

const iconVariants = {
  hidden: { rotateY: -90, opacity: 0, scale: 0.5 },
  visible: { rotateY: 0, opacity: 1, scale: 1 },
  exit: { rotateY: 90, opacity: 0, scale: 0.5 },
};

const SunIcon = () => (
    <motion.svg variants={iconVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }} key="sun" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></motion.svg>
);

const MoonIcon = () => (
     <motion.svg variants={iconVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3, ease: 'easeInOut' }} key="moon" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></motion.svg>
);

const ThemeSwitcherIcon: React.FC<ThemeSwitcherIconProps> = ({ theme }) => {
    return (
        <div style={{ perspective: '500px' }}>
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
            </AnimatePresence>
        </div>
    );
};

export default ThemeSwitcherIcon;
