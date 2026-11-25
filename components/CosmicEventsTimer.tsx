
import React, { useState, useEffect, useMemo} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cosmicEventsData} from '../data/cosmicEventsData';
import { generateEventImpactAnalysis } from '../services/geminiService';
import Spinner from './common/Spinner';

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

const calculateTimeRemaining = (targetDate: Date): TimeRemaining => {
    const total = targetDate.getTime() - new Date().getTime();
    return {
        total,
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((total / 1000 / 60) % 60),
        seconds: Math.floor((total / 1000) % 60),
    };
};

const ImpactModal: React.FC<{ isOpen: boolean; onClose: () => void; eventName: string; descriptionKey: string; }> = ({ isOpen, onClose, eventName, descriptionKey }) => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            generateEventImpactAnalysis(descriptionKey, 'حمل')
                .then(setContent)
                .catch(() => setContent('خطا در دریافت تحلیل.'))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, descriptionKey]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-900/80 border border-purple-500/50 rounded-2xl p-6 max-w-sm w-full text-center"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="font-lalezar text-2xl text-amber-300 mb-4">{`تأثیر انرژی ${eventName}`}</h3>
                <h4 className="font-tanha text-lg text-gray-300 mb-4">{"برای برج حمل"}</h4>
                <div className="min-h-[100px] flex items-center justify-center">
                    {isLoading ? <Spinner /> : <p className="font-tanha text-gray-200 leading-relaxed">{content}</p>}
                </div>
                <button onClick={onClose} className="mt-6 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">{"بستن"}</button>
            </motion.div>
        </div>
    );
};

const CosmicEventsTimer: React.FC = () => {
    const [now, setNow] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const nearestEvent = useMemo(() => {
        const futureEvents = cosmicEventsData.filter(event => new Date(event.date).getTime() > now.getTime());
        if (futureEvents.length === 0) return null;
        return futureEvents.reduce((nearest, current) => 
            new Date(current.date).getTime() < new Date(nearest.date).getTime() ? current : nearest
        );
    }, [now.getSeconds()]); // Re-calculate memo once a second

    if (!nearestEvent) return null;

    const timeRemaining = calculateTimeRemaining(new Date(nearestEvent.date));
    const isAlert = timeRemaining.total > 0 && timeRemaining.total < 24 * 60 * 60 * 1000;

    const glowClass = isAlert 
        ? 'shadow-[0_0_15px_3px_rgba(239,68,68,0.4)] border-red-500/60'
        : 'shadow-[0_0_15px_3px_rgba(216,180,254,0.3)] border-purple-400/50';

    return (
        <>
            <motion.div
                initial={{ y: '-100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                className={`relative z-40 w-full cursor-pointer bg-slate-900/30 backdrop-blur-lg border-b p-2 transition-all duration-500 ${glowClass}`}
                onClick={() => setIsModalOpen(true)}
            >
                <div className="container mx-auto flex items-center justify-center gap-4">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-3xl"
                    >
                        {nearestEvent.icon}
                    </motion.div>
                    <div className="text-center">
                        <p className="font-lalezar text-lg text-white tracking-wider">{`رویداد کیهانی بعدی: ${nearestEvent.name}`}</p>
                        <div className="font-roboto-mono text-xl text-amber-300 flex gap-x-2 justify-center">
                            <span>{`${String(timeRemaining.days).padStart(2, '0')}d`}</span>
                            <span>{`${String(timeRemaining.hours).padStart(2, '0')}h`}</span>
                            <span>{`${String(timeRemaining.minutes).padStart(2, '0')}m`}</span>
                            <span>{`${String(timeRemaining.seconds).padStart(2, '0')}s`}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
            <AnimatePresence>
                <ImpactModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    eventName={nearestEvent.name}
                    descriptionKey={nearestEvent.descriptionKey}
                />
            </AnimatePresence>
        </>
    );
};

export default CosmicEventsTimer;
