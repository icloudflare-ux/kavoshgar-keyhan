
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

// Component for the animated background particles
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {Array.from({ length: 150 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-white"
        initial={{
          x: `${Math.random() * 100}vw`,
          y: `${Math.random() * 100}vh`,
          scale: Math.random() * 0.5 + 0.1,
          opacity: 0,
        }}
        animate={{
          x: `calc(${Math.random() * 100}vw - 50%)`,
          y: -20,
          opacity: [0, Math.random() * 0.5 + 0.2, 0],
        }}
        transition={{
          duration: Math.random() * 20 + 15,
          repeat: Infinity,
          ease: 'linear',
          delay: Math.random() * 5,
        }}
      />
    ))}
  </div>
);

// Animated SVG for the cosmic checkmark
const CosmicCheckmark = () => (
    <motion.svg width="150" height="150" viewBox="0 0 150 150"
        initial="hidden"
        animate="visible"
        className="drop-shadow-[0_0_15px_rgba(56,189,149,0.7)]"
    >
        <defs>
            <radialGradient id="checkmarkGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#38bda9" stopOpacity="0.3"/>
            </radialGradient>
        </defs>
        <motion.circle cx="75" cy="75" r="70" stroke="#38bda9" strokeWidth="1" fill="none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.9, 1.05, 1], opacity: [0, 0.5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle cx="75" cy="75" r="70" stroke="#38bda9" strokeWidth="1.5" fill="none"
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
        />
        <motion.path
            d="M 45 75 L 68 98 L 105 55"
            fill="none"
            stroke="url(#checkmarkGlow)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
        />
    </motion.svg>
);


const CosmicReceipt: React.FC = () => {
    const { user, closeConfirmation } = useAuth();
    const [showButtons, setShowButtons] = useState(false);
    const receiptRef = useRef<HTMLDivElement>(null);
    const shareCardRef = useRef<HTMLDivElement>(null);

    const transaction = {
        id: `TXN-${Date.now()}`,
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowButtons(true), 2500);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    const handleShare = async () => {
        if (!shareCardRef.current) return;
        try {
            const canvas = await html2canvas(shareCardRef.current, { backgroundColor: '#0f172a', useCORS: true, scale: 2 });
            const dataUrl = canvas.toDataURL('image/png');
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], `celestial-explorer-premium-${user?.username}.png`, { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'عضو پرمیوم کاوشگر کیهان',
                    text: `من به عضویت پرمیوم کاوشگر کیهان درآمدم!`,
                    files: [file],
                });
            } else {
                alert('مرورگر شما از اشتراک‌گذاری مستقیم فایل پشتیبانی نمی‌کند. لطفاً از گزینه دانلود استفاده کنید.');
            }
        } catch (error: any) {
            console.error('Failed to share:', error.message);
        }
    };

    const handleDownloadReceipt = async () => {
        if (!receiptRef.current) return;
        try {
            const canvas = await html2canvas(receiptRef.current, { backgroundColor: null, useCORS: true, scale: 2 });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `cosmic-receipt-${user?.username || 'user'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error: any) {
            console.error('Failed to download receipt:', error.message);
        }
    };
    
    const handleRedirect = () => {
        closeConfirmation();
        const calculatorSection = document.getElementById('calculator');
        if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const horoscopeButton = document.querySelector('button[aria-label="زایچه (هوروسکوپ)"]');
                if (horoscopeButton) (horoscopeButton as HTMLElement).click();
            }, 800);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center p-4 overflow-hidden">
            <motion.div
                className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-purple-500/50 z-0"
                style={{ transform: 'translate(-50%, -50%)' }}
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ scale: 4000, opacity: 0 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <Particles />
            <motion.div 
                ref={receiptRef}
                className="relative z-10 w-full max-w-2xl text-center p-1 rounded-2xl bg-gradient-to-br from-amber-400 via-purple-500 to-amber-400"
                style={{ backgroundSize: '400% 400%', animation: 'gradient-animation 10s ease infinite' }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8">
                    <div className="mb-6">
                        <CosmicCheckmark />
                    </div>
                    <h1 className="font-lalezar text-4xl text-amber-300 drop-shadow-lg">
                        {`دروازه‌های کیهان به روی شما گشوده شد، ${user?.username || 'کاوشگر'}!`}
                    </h1>
                    <p className="font-tanha text-xl text-gray-300 mt-4 max-w-lg mx-auto leading-relaxed">
                        {"اشتراک پرمیوم شما با موفقیت فعال گردید."}
                    </p>
                    <div className="my-8 bg-black/20 p-4 rounded-lg inline-block">
                        <span className="text-gray-400">{"کد پیگیری"}: </span>
                        <span className="font-roboto-mono text-white">{transaction.id}</span>
                    </div>

                    <AnimatePresence>
                    {showButtons && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <button onClick={handleRedirect} className="w-full sm:w-auto btn-animated-gradient text-white font-bold py-3 px-6 rounded-lg shadow-lg overflow-hidden flex items-center justify-center gap-2">
                                {"مشاهده تحلیل چارت"}
                            </button>
                            <button onClick={handleDownloadReceipt} className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                {"دانلود لوح"}
                            </button>
                            <button onClick={handleShare} className="w-full sm:w-auto bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                                {"اشتراک‌گذاری"}
                            </button>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </motion.div>
            
            <div ref={shareCardRef} className="fixed -left-[9999px] -top-[9999px] w-[500px] h-[250px] p-8 flex flex-col justify-between" style={{ background: 'radial-gradient(ellipse at top, #1e293b, #0f172a)' }}>
                <div>
                    <h3 className="font-lalezar text-3xl text-indigo-300">{"کاوشگر کیهان"}</h3>
                    <p className="font-tanha text-white text-4xl mt-3">{user?.username}</p>
                </div>
                <div className="flex items-center gap-3 bg-amber-500/20 px-4 py-2 rounded-full self-start">
                    <span className="text-amber-300 text-3xl">✨</span>
                    <span className="font-bold text-amber-300 text-xl">{"عضو برتر کیهان"}</span>
                </div>
            </div>
        </div>
    );
};

export default CosmicReceipt;
