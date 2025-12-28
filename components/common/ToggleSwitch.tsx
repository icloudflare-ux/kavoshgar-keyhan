
import React from 'react';
import { motion, Transition } from 'framer-motion';

interface ToggleSwitchProps {
    isOn: boolean;
    onToggle: () => void;
    label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle, label }) => {
    
    const spring: Transition = { type: "spring", stiffness: 700, damping: 30 };

    return (
        <div className="flex items-center justify-between">
            <label htmlFor={`toggle-${label}`} className="text-sm text-[var(--color-text-primary)] font-tanha">
                {label}
            </label>
            <div
                className={`flex items-center w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isOn ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'}`}
                onClick={onToggle}
            >
                <motion.div
                    id={`toggle-${label}`}
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                    layout
                    transition={spring}
                />
            </div>
        </div>
    );
};

export default ToggleSwitch;