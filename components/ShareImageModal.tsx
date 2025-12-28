
import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { ShareData } from '../types';
import Spinner from './common/Spinner';
import NatalChartUI from './NatalChartUI';

interface ShareImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareData: ShareData;
}

const ShareImageModal: React.FC<ShareImageModalProps> = ({ isOpen, onClose, shareData }) => {
    const modalContentRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [canShareFiles, setCanShareFiles] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Check for file sharing support
            if (navigator.share && navigator.canShare) {
                const dummyFile = new File([""], "dummy.png", { type: "image/png" });
                setCanShareFiles(navigator.canShare({ files: [dummyFile] }));
            }
        
            triggerRef.current = document.activeElement as HTMLElement;
            const mainContent = document.querySelector('#root > div');
            if (mainContent) mainContent.setAttribute('aria-hidden', 'true');

            setIsLoading(true);
            setImageDataUrl(null);
            setTimeout(() => {
                if (cardRef.current) {
                    html2canvas(cardRef.current, { backgroundColor: null, useCORS: true, scale: 2.5 })
                        .then(canvas => {
                            setImageDataUrl(canvas.toDataURL('image/png'));
                            setIsLoading(false);
                        }).catch(err => {
                            console.error("Failed to generate canvas image", err.message);
                            setIsLoading(false);
                        });
                }
            }, 500);

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleKeyDown);

            const modalNode = modalContentRef.current;
            if(modalNode) {
                const focusableElements = modalNode.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (firstElement) firstElement.focus();
                
                const trapFocus = (e: KeyboardEvent) => {
                    if (e.key !== 'Tab') return;
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus(); e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus(); e.preventDefault();
                        }
                    }
                };
                modalNode.addEventListener('keydown', trapFocus);
                
                return () => {
                    if (mainContent) mainContent.removeAttribute('aria-hidden');
                    window.removeEventListener('keydown', handleKeyDown);
                    modalNode.removeEventListener('keydown', trapFocus);
                    triggerRef.current?.focus();
                };
            }
        }
    }, [isOpen, onClose, shareData]);

    const handleDownload = () => {
        if (imageDataUrl) {
            const link = document.createElement('a');
            const fileName = shareData.type === 'qarin' ? `qarin-tablet-${shareData.name}` : `celestial-explorer-${shareData.name}`;
            link.href = imageDataUrl;
            link.download = `${fileName}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleNativeShare = async () => {
        if (!imageDataUrl || !navigator.share) return;
        
        try {
            const response = await fetch(imageDataUrl);
            const blob = await response.blob();
            const fileName = shareData.type === 'qarin' ? `qarin-tablet-${shareData.name}.png` : `celestial-explorer-${shareData.name}.png`;
            const file = new File([blob], fileName, { type: 'image/png' });

            const title = shareData.type === 'qarin' ? 'لوح قرین' : 'تحلیل طالع اختصاصی';
            const shareText = `تحلیل اختصاصی برای ${shareData.name} - ساخته شده با کاوشگر کیهان\n${window.location.href}`;

            await navigator.share({
                files: [file],
                title: title,
                text: shareText,
            });
        } catch (error: any) {
            console.error('Error sharing:', error.message);
            // Fallback to download if sharing fails on some devices
            handleDownload();
        }
    };

    if (!isOpen) return null;

    const renderCardContent = () => {
        switch (shareData.type) {
            case 'rab-al-taleh':
                return (
                    <div className="w-full h-full p-20 flex flex-col justify-between" style={{ background: 'radial-gradient(ellipse at top, #1e293b, #020617, #111827)' }}>
                        <div className="text-center">
                            <h2 className="font-lalezar text-8xl text-amber-300 tracking-wider" style={{ textShadow: '0 0 15px rgba(252, 211, 77, 0.5)' }}>{shareData.name}</h2>
                        </div>
                        <div className="text-center my-12">
                            <p className="text-5xl text-gray-400">برج طالع: <strong className="font-lalezar text-6xl text-cyan-300">{shareData.sign}</strong></p>
                            <p className="text-5xl text-gray-400 mt-6">کوکب حاکم: <strong className="font-lalezar text-6xl text-cyan-300">{shareData.ruler}</strong></p>
                        </div>
                        <div className="text-center my-12">
                            <p className="font-amiri text-5xl text-gray-200 leading-relaxed italic">« {shareData.quote.trim()} »</p>
                        </div>
                        <div className="text-center mt-auto">
                            <p className="font-lalezar text-5xl text-indigo-400 tracking-wider">کاوشگر کیهان</p>
                        </div>
                    </div>
                );
            case 'qarin':
                 return (
                    <div className="w-full h-full relative flex flex-col items-center justify-center p-20" style={{ background: 'radial-gradient(ellipse at center, #1e1b4b, #0f172a)' }}>
                        <svg className="absolute inset-0 w-full h-full" width="100%" height="100%" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="shareGold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FDE047" /><stop offset="50%" stopColor="#F59E0B" /><stop offset="100%" stopColor="#FDE047" /></linearGradient>
                              <linearGradient id="shareBlue" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#4f46e5" /></linearGradient>
                            </defs>
                            <rect width="100%" height="100%" fill="none" stroke="url(#shareGold)" strokeWidth="8" rx="20" ry="20" />
                            <rect x="15" y="15" width="calc(100% - 30px)" height="calc(100% - 30px)" fill="none" stroke="url(#shareBlue)" strokeWidth="4" rx="15" ry="15" />
                            {[30, 90, 150, 210, 270, 330].map(r => <line key={r} x1="540" y1="540" x2="540" y2="20" stroke="url(#shareBlue)" strokeWidth="1" opacity="0.5" transform={`rotate(${r} 540 540)`} /> )}
                        </svg>
                        <div className="relative z-10 text-center">
                            <h2 className="font-lalezar text-6xl text-cyan-300 tracking-wider">{"لوح قرین"}</h2>
                            <p className="text-5xl text-gray-300 mt-4">{shareData.name}</p>
                            <h1 className="font-lalezar text-[180px] font-bold text-amber-300 my-16" style={{textShadow: '0 0 25px rgba(252, 211, 77, 0.5)'}}>{shareData.qarinName}</h1>
                            <div className="inline-block bg-slate-900/60 px-8 py-3 rounded-full border-2 border-slate-600">
                                <span className="text-gray-400 text-3xl ml-6">{"ابجد"}</span>
                                <span className="font-roboto-mono text-amber-400 font-bold text-5xl">{shareData.qarinAbjad}</span>
                            </div>
                        </div>
                        <div className="absolute bottom-20 text-center">
                            <p className="font-lalezar text-5xl text-indigo-400 tracking-wider">کاوشگر کیهان</p>
                        </div>
                    </div>
                );
            case 'horoscope':
                return (
                    <div className="w-full h-full p-14 flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #1e293b, #020617, #111827)' }}>
                       <div className="flex-grow flex items-center">
                           <div className="w-3/5">
                                <div className="p-4 bg-black/20 rounded-full">
                                    <NatalChartUI zodiacData={shareData.zodiacData} />
                                </div>
                           </div>
                           <div className="w-2/5 pl-8 text-right">
                               <h2 className="font-lalezar text-8xl text-amber-300 tracking-wider" style={{ textShadow: '0 0 15px rgba(252, 211, 77, 0.5)' }}>{shareData.name}</h2>
                               <p className="text-4xl text-gray-300 mt-6 leading-relaxed">{shareData.analysisSummary}</p>
                           </div>
                       </div>
                       <div className="text-center mt-auto pt-8">
                            <p className="font-lalezar text-5xl text-indigo-400 tracking-wider">کاوشگر کیهان</p>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="share-image-title">
            <div ref={modalContentRef} className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 max-w-2xl w-full relative animate-fade-in-down" onClick={e => e.stopPropagation()}>
                <h3 id="share-image-title" className="text-2xl font-lalezar text-center text-indigo-300 mb-4">{"لوح اختصاصی"}</h3>
                
                <div className="relative aspect-[1/1] w-full max-w-lg mx-auto flex items-center justify-center">
                    {isLoading && <Spinner />}
                    {imageDataUrl && <img src={imageDataUrl} alt="Shareable card" className="w-full h-full object-contain rounded-lg shadow-2xl" />}
                </div>

                {/* Hidden div for html2canvas rendering */}
                <div className="fixed -top-[9999px] -left-[9999px]">
                    <div ref={cardRef} className="w-[1080px] h-[1080px]">
                        {renderCardContent()}
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={handleDownload} disabled={!imageDataUrl} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 flex items-center justify-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                       {"دانلود تصویر"}
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                         {canShareFiles && (
                            <button onClick={handleNativeShare} disabled={!imageDataUrl} className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 flex items-center justify-center gap-2">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                               {"اشتراک"}
                            </button>
                        )}
                        <button onClick={onClose} className={`w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors ${!canShareFiles ? 'col-span-2' : ''}`}>
                            {"بستن"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareImageModal;
