
import React, { useMemo, useRef, useState, useEffect } from 'react';
import Card from './common/Card';
import useUnlockOnScroll from '../hooks/useUnlockOnScroll';
import { moonPhases, MoonPhaseDetail } from '../data/moonData';
import { qamarDarAghrabData } from '../data/qamarDarAghrabData';
import { useTypewriter } from '../hooks/useTypewriter';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Briefcase, TrendingUp, Star, Eye, X} from 'lucide-react';

// Calculation constants
const LUNAR_CYCLE_DAYS = 29.530588853;
const NEW_MOON_REFERENCE_UTC = new Date('2024-01-11T11:57:00Z').getTime();

// Qamar dar Aghrab check
const isQamarDarAghrabNow = (date: Date): boolean => {
    const nowTime = date.getTime();
    // Check both constellation and sign for thoroughness
    const allEvents = [...qamarDarAghrabData.constellation, ...qamarDarAghrabData.sign];
    return allEvents.some(event => {
        const startTime = new Date(event.start).getTime();
        const endTime = new Date(event.end).getTime();
        return nowTime >= startTime && nowTime <= endTime;
    });
};

// Function to calculate moon phase value (0 to 1)
const getMoonPhaseValue = (date: Date): number => {
    const msSinceNewMoon = date.getTime() - NEW_MOON_REFERENCE_UTC;
    const daysSinceNewMoon = msSinceNewMoon / (1000 * 60 * 60 * 24);
    const phase = (daysSinceNewMoon % LUNAR_CYCLE_DAYS) / LUNAR_CYCLE_DAYS;
    return phase < 0 ? 1 + phase : phase;
};

// Maps a phase value (0-1) to the correct moon phase key
const getPhaseInfo = (phaseValue: number): MoonPhaseDetail => {
    if (phaseValue > 0.96875 || phaseValue <= 0.03125) return moonPhases.new_moon;
    if (phaseValue <= 0.21875) return moonPhases.waxing_crescent;
    if (phaseValue <= 0.28125) return moonPhases.first_quarter;
    if (phaseValue <= 0.46875) return moonPhases.waxing_gibbous;
    if (phaseValue <= 0.53125) return moonPhases.full_moon;
    if (phaseValue <= 0.71875) return moonPhases.waning_gibbous;
    if (phaseValue <= 0.78125) return moonPhases.last_quarter;
    return moonPhases.waning_crescent; // Waning Crescent
};


const MoonVisual: React.FC<{ phaseValue: number; isQamar: boolean; phaseId: string; size?: number }> = ({ phaseValue, isQamar, phaseId, size = 150 }) => {
    const lightColor = '#f4f4f4';
    const darkColor = '#1e293b'; 

    const glowColor = useMemo(() => {
        if (isQamar) return 'rgba(239, 68, 68, 0.5)'; // Red for Qamar dar Aghrab
        
        switch (phaseId) {
            case '3': return 'rgba(0, 210, 255, 0.5)'; // first_quarter (ID: 3)
            case '5': return 'rgba(255, 255, 255, 0.6)'; // full_moon (ID: 5)
            case '1': return 'rgba(120, 0, 255, 0.3)'; // new_moon (ID: 1)
            default: return 'rgba(255, 255, 255, 0.2)'; // Default soft white
        }
    }, [isQamar, phaseId]);

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        boxShadow: `0 0 40px 15px ${glowColor}`,
        transition: 'box-shadow 1.5s ease-in-out',
        flexShrink: 0,
    };

    const wrapperStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: `0 0 30px rgba(244, 244, 244, 0.3), inset 0 0 10px rgba(0,0,0,0.5)`,
        background: lightColor,
        flexShrink: 0,
    };

    const shadowStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: darkColor,
        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    };
    
    let transformValue = '';
    if (phaseValue <= 0.5) { // Waxing phase
        const percentage = (phaseValue / 0.5) * 100;
        transformValue = `translateX(-${percentage}%)`;
    } else { // Waning phase
        const percentage = ((phaseValue - 0.5) / 0.5) * 100;
        transformValue = `translateX(${100 - percentage}%)`;
    }
    shadowStyle.transform = transformValue;

    return (
        <div style={containerStyle}>
            <div style={wrapperStyle}>
                <div style={shadowStyle}></div>
            </div>
        </div>
    );
};

const InfoCard: React.FC<{ icon: React.ReactNode; titleKey: string; contentKey: string; delay: number }> = ({ icon, titleKey, contentKey, delay }) => {
    const { t } = useTranslation();
    const typedContent = useTypewriter(t(contentKey), 20);
    return (
        <motion.div 
            className="bg-slate-800/40 p-4 rounded-lg border-l-4 border-indigo-500/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <h5 className="flex items-center text-xl font-lalezar text-indigo-300 mb-2">
                <span className="ml-2">{icon}</span>
                {t(titleKey)}
            </h5>
            <p className="font-tanha text-gray-300 leading-relaxed text-base min-h-[50px]">{typedContent}</p>
        </motion.div>
    );
};

const ActionCard: React.FC<{ icon: React.ElementType; titleKey: string; actionLabelKey: string; color: string; delay: number }> = ({ icon: Icon, titleKey, actionLabelKey, color, delay }) => {
    const { t } = useTranslation();
    return (
        <motion.div 
            className={`bg-slate-800/40 p-4 rounded-lg text-center border-t-4 ${color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <div className="flex items-center justify-center gap-2 mb-2">
                <Icon size={20} className="text-gray-300" />
                <h5 className="text-xl font-lalezar text-gray-300">{t(titleKey)}</h5>
            </div>
            <p className="text-2xl font-bold font-tanha text-white">{t(actionLabelKey)}</p>
        </motion.div>
    );
};

const MoonPhaseModal: React.FC<{ phaseInfo: MoonPhaseDetail, onClose: () => void }> = ({ phaseInfo, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const isCurrentlyQamar = useMemo(() => isQamarDarAghrabNow(new Date()), []);

     useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                ref={modalRef}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="w-full max-w-3xl"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="moon-phase-modal-title"
            >
                <Card className="max-h-[90vh] overflow-y-auto relative !border-indigo-500/50">
                    <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors z-10" aria-label={t('moonPhase.close')}>
                        <X size={28} />
                    </button>
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center gap-6 border-b border-slate-700/50 pb-6 mb-6">
                        <MoonVisual phaseValue={phaseInfo.representativePhaseValue} isQamar={isCurrentlyQamar} phaseId={phaseInfo.id} size={120} />
                        <div className="text-center md:text-right">
                            <h3 id="moon-phase-modal-title" className="text-5xl font-lalezar text-white">{t(phaseInfo.nameKey)}</h3>
                            <p className="text-xl text-gray-400 font-roboto-mono">{phaseInfo.nameEnglish}</p>
                        </div>
                    </div>
                    
                    {/* Dashboard Content */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ActionCard icon={phaseInfo.tradingAction.icon} titleKey="moonPhase.trading" actionLabelKey={phaseInfo.tradingAction.labelKey} color="border-cyan-500" delay={0.1} />
                            <ActionCard icon={phaseInfo.metaphysicsAction.icon} titleKey="moonPhase.metaphysics" actionLabelKey={phaseInfo.metaphysicsAction.labelKey} color="border-purple-500" delay={0.2} />
                        </div>
                        <InfoCard icon={<Briefcase size={20} />} titleKey="moonPhase.whatIs" contentKey={phaseInfo.whatIsKey} delay={0.3} />
                        <InfoCard icon={<TrendingUp size={20} />} titleKey="moonPhase.application" contentKey={phaseInfo.applicationKey} delay={0.4} />
                        <InfoCard icon={<Eye size={20} />} titleKey="moonPhase.readingGuide" contentKey={phaseInfo.readingGuideKey} delay={0.5} />
                        
                        <motion.div 
                            className="bg-slate-900/50 p-4 rounded-lg border-2 border-amber-400/50 text-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h5 className="flex items-center justify-center text-xl font-lalezar text-amber-300 mb-2">
                                <Star size={20} className="ml-2" />
                                {t('moonPhase.mantra')}
                            </h5>
                             <p className="font-tanha text-2xl text-amber-200">"{useTypewriter(t(phaseInfo.mantraKey), 50)}"</p>
                        </motion.div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
};

const MoonPhase: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    useUnlockOnScroll(sectionRef, 'agricultural_astrology');
    const { t } = useTranslation();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhaseForModal, setSelectedPhaseForModal] = useState<MoonPhaseDetail | null>(null);

    
    const now = useMemo(() => new Date(), []);
    const phaseValue = useMemo(() => getMoonPhaseValue(now), [now]);
    const currentPhaseInfo = useMemo(() => getPhaseInfo(phaseValue), [phaseValue]);
    const isCurrentlyQamar = useMemo(() => isQamarDarAghrabNow(now), [now]);

    const handleOpenModal = (phase: MoonPhaseDetail) => {
        setSelectedPhaseForModal(phase);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPhaseForModal(null);
    };

    if (!currentPhaseInfo) {
        return <Card><p>در حال محاسبه فاز ماه...</p></Card>;
    }
    
    const allPhases = Object.values(moonPhases);

    return (
        <section id="moon-phase" ref={sectionRef} role="region" aria-labelledby="moon-phase-title">
            <h3 id="moon-phase-title" className="text-4xl md:text-5xl font-bold text-center mb-12 font-lalezar tracking-wider bg-gradient-to-r from-slate-400 to-sky-300 text-transparent bg-clip-text">
                {t('moonPhase.currentTitle')}
            </h3>
            <Card>
                <div className="flex flex-col items-center justify-center">
                     <motion.button 
                        onClick={() => handleOpenModal(currentPhaseInfo)}
                        className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900 focus-visible:ring-indigo-500 rounded-lg"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        aria-label={`${t('moonPhase.modalCta')} ${t(currentPhaseInfo.nameKey)}`}
                    >
                        <div className="flex flex-col items-center justify-center text-center">
                            <MoonVisual phaseValue={phaseValue} isQamar={isCurrentlyQamar} phaseId={currentPhaseInfo.id} />
                            <h4 className="text-4xl font-lalezar text-white mt-6 flex items-center group-hover:text-indigo-300 transition-colors">
                                <span className="text-4xl ml-3">{currentPhaseInfo.icon}</span>
                                {t(currentPhaseInfo.nameKey)}
                            </h4>
                        </div>
                    </motion.button>
                     <p className="mt-6 text-indigo-300 font-tanha animate-pulse">{t('moonPhase.modalCta')}</p>
                </div>
            </Card>

            <div className="mt-20">
                <h3 className="text-4xl md:text-5xl font-bold text-center mb-12 font-lalezar tracking-wider bg-gradient-to-r from-purple-400 to-fuchsia-500 text-transparent bg-clip-text">
                    {t('moonPhase.encyclopediaTitle')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {allPhases.map(phase => (
                        <motion.div
                            key={phase.id}
                            onClick={() => handleOpenModal(phase)}
                            className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 cursor-pointer h-full flex flex-col"
                            whileHover={{ y: -5, borderColor: 'var(--color-accent)' }}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <span className="text-5xl">{phase.icon}</span>
                                <h4 className="font-lalezar text-2xl text-white">{t(phase.nameKey)}</h4>
                            </div>
                            <p className="font-tanha text-gray-300 leading-relaxed flex-grow">{t(phase.encyclopediaDescriptionKey)}</p>
                            <div className="flex items-center justify-around mt-4 pt-3 border-t border-slate-700/50">
                                <div className="flex flex-col items-center text-center text-cyan-400">
                                    <phase.tradingAction.icon size={24} />
                                    <span className="text-xs mt-1 font-semibold">{t(phase.tradingAction.labelKey)}</span>
                                </div>
                                <div className="flex flex-col items-center text-center text-purple-400">
                                    <phase.metaphysicsAction.icon size={24} />
                                    <span className="text-xs mt-1 font-semibold">{t(phase.metaphysicsAction.labelKey)}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && selectedPhaseForModal && (
                    <MoonPhaseModal 
                        phaseInfo={selectedPhaseForModal} 
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default MoonPhase;
