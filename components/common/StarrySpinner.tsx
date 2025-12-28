
import React from 'react';

interface StarrySpinnerProps {
    small?: boolean;
}

const StarrySpinner: React.FC<StarrySpinnerProps> = ({ small = false }) => {
    const sizeClasses = small ? 'w-6 h-6' : 'w-16 h-16';

    return (
        <div className={`relative ${sizeClasses} animate-spin`} style={{ animationDuration: '3s' }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 opacity-50 blur-md"></div>
            <div className="absolute inset-1 rounded-full bg-slate-900"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full bg-gradient-to-bl from-purple-500/50 to-transparent blur-sm"></div>
        </div>
    );
};

export default StarrySpinner;
