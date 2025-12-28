import React, { useState, useEffect } from 'react';

interface CaptchaProps {
  onVerify: (isVerified: boolean) => void;
  resetKey: string; // A key to reset the captcha from parent
}

type CaptchaState = 'unchecked' | 'verifying' | 'verified';

const Captcha: React.FC<CaptchaProps> = ({ onVerify, resetKey }) => {
    const [state, setState] = useState<CaptchaState>('unchecked');

    useEffect(() => {
        // Reset state when the mode changes in the parent component
        setState('unchecked');
        onVerify(false);
    }, [resetKey, onVerify]);

    const handleClick = () => {
        if (state === 'unchecked') {
            setState('verifying');
            setTimeout(() => {
                setState('verified');
                onVerify(true);
            }, 1500); // Simulate network latency
        }
    };

    const renderIcon = () => {
        switch (state) {
            case 'unchecked':
                return <div className="w-6 h-6 border-2 border-slate-500 rounded-sm"></div>;
            case 'verifying':
                return (
                    <div className="w-6 h-6">
                        <svg className="animate-spin h-full w-full text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                );
            case 'verified':
                return (
                    <div className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
        }
    };

    const getLabelText = () => {
        switch (state) {
            case 'verifying':
                return 'در حال تأیید...';
            case 'verified':
                return 'تأیید شد';
            default:
                return 'من ربات نیستم';
        }
    }

    return (
        <div 
            onClick={handleClick} 
            className={`flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg border transition-colors cursor-pointer ${state === 'verified' ? 'border-green-500/50 bg-green-900/20' : 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50'}`}
        >
            {renderIcon()}
            <span className={`font-semibold ${state === 'verified' ? 'text-green-400' : 'text-gray-300'}`}>
                {getLabelText()}
            </span>
        </div>
    );
};

export default Captcha;
