import React, { useState, useEffect, useRef } from 'react';

const ONBOARDING_SEEN_KEY = 'celestial_explorer_onboarding_seen';

const OnboardingModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const hasSeen = localStorage.getItem(ONBOARDING_SEEN_KEY);
            if (!hasSeen) {
                setTimeout(() => setIsOpen(true), 1500);
            }
        } catch (error) {
            console.error("Could not access localStorage for onboarding.", error);
        }
    }, []);

    // Focus trapping and aria-hidden management
    useEffect(() => {
        if (!isOpen) return;

        const mainContent = document.querySelector('#root > div');
        if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
        
        const modalNode = modalRef.current;
        if (!modalNode) return;
        
        const focusableElements = modalNode.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (firstElement) firstElement.focus();
        
        const trapFocus = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };
        modalNode.addEventListener('keydown', trapFocus);
        
        return () => {
            if (mainContent) mainContent.removeAttribute('aria-hidden');
            modalNode.removeEventListener('keydown', trapFocus);
        };

    }, [isOpen]);

    const handleClose = () => {
        try {
            localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
        } catch (error) {
            console.error("Could not save to localStorage.", error);
        }
        setIsOpen(false);
    };

    const handleStart = () => {
        handleClose();
        const element = document.getElementById('profile-manager-anchor');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const cardElement = element.firstElementChild;
            if (cardElement) {
                cardElement.classList.add('highlight-card-pulse');
                setTimeout(() => {
                    cardElement.classList.remove('highlight-card-pulse');
                }, 1500);
            }
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="onboarding-title"
        >
            <div ref={modalRef} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in-down text-center">
                <span className="text-5xl">🌌</span>
                <h3 id="onboarding-title" className="text-3xl font-lalezar text-amber-300 mt-4 mb-2">{"به کاوشگر کیهان خوش آمدید"}</h3>
                <p className="text-lg text-gray-300 font-tanha mb-8">{"برای شروع، پروفایل خود را بسازید تا محاسبات شخصی‌سازی شده دریافت کنید."}</p>

                <div className="space-y-4">
                    <button 
                        onClick={handleStart}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
                    >
                        {"بزن بریم!"}
                    </button>
                    <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {"فعلاً نه"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
