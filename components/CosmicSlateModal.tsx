
import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanetaryPositionsMap } from '../services/astrologyEngine';
import ZodiacChart from './ZodiacChart';
import TradingStrategy from './TradingStrategy';
import TazhibBorder from './common/TazhibBorder';
import Spinner from './common/Spinner';
import { Download, X } from 'lucide-react';

interface CosmicSlateModalProps {
    isOpen: boolean;
    onClose: () => void;
    zodiacData: PlanetaryPositionsMap | null;
    score: number | null;
    reading: string | null;
    profileName: string;
}

const CosmicSlateModal: React.FC<CosmicSlateModalProps> = ({ isOpen, onClose, zodiacData, score, reading, profileName }) => {
    const slateRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    const handleDownload = async () => {
        if (!slateRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(slateRef.current, {
                backgroundColor: '#020617', // Navy blue background for the image
                useCORS: true,
                scale: 2, // Higher resolution
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `cosmic_slate_${profileName.replace(/\s+/g, '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to capture slate:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 50 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                        className="bg-slate-900/80 border border-amber-400/30 rounded-2xl shadow-2xl p-6 max-w-3xl w-full relative max-h-[90vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex-shrink-0 flex justify-between items-center mb-4">
                            <h3 className="font-lalezar text-3xl text-amber-300">{"لوح کیهانی"}</h3>
                            <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-slate-700 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto pr-2">
                            <div ref={slateRef} className="p-8 bg-[#020617]">
                                <TazhibBorder>
                                    <div className="p-8 space-y-8">
                                        <h4 className="font-lalezar text-4xl text-center text-amber-300">{`لوح تقدیر ${profileName}`}</h4>
                                        {zodiacData && <ZodiacChart zodiacData={zodiacData} score={score} />}
                                        {score !== null && <TradingStrategy score={score} />}
                                        {reading && (
                                            <div className="mt-8 pt-6 border-t border-amber-500/20">
                                                <h5 className="font-lalezar text-2xl text-center text-amber-300 mb-4">{"چکیده تحلیل"}</h5>
                                                <p className="font-amiri text-lg text-gray-300 text-center leading-loose">{reading.split('\n')[0]}</p>
                                            </div>
                                        )}
                                         <p className="font-lalezar text-2xl text-center text-indigo-400 tracking-wider pt-6 mt-6 border-t border-amber-500/20">کاوشگر کیهان</p>
                                    </div>
                                </TazhibBorder>
                            </div>
                        </div>

                        <div className="flex-shrink-0 pt-6 mt-4 border-t border-slate-700/50">
                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg disabled:bg-gray-600"
                            >
                                {isDownloading ? <Spinner small /> : <Download size={20} />}
                                {isDownloading ? "در حال آماده‌سازی..." : "ذخیره لوح (PNG)"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CosmicSlateModal;
