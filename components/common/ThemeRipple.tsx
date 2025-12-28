import React from 'react';
import { motion } from 'framer-motion';

const ThemeRipple: React.FC = () => {
    return (
        <motion.div
            className="fixed top-1/2 left-1/2 w-1 h-1 rounded-full z-[9999] pointer-events-none"
            style={{
                backgroundColor: 'var(--color-accent)',
                transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 500, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        />
    );
};

export default ThemeRipple;
