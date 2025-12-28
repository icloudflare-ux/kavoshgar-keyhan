
import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useFamousPeopleData, ProcessedFamousPerson } from '../data/famousPeopleData';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { generateDestinyComparison, generateHafezFal } from '../services/geminiService';
import Spinner from './common/Spinner';
import { useZodiacData } from '../data/zodiacData';
import { ZodiacSignName } from '../types';
import { useTypewriter } from '../hooks/useTypewriter';
import TazhibBorder from './common/TazhibBorder';
import html2canvas from 'html2canvas';
import { Download, BookOpen, Volume2, VolumeX } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const EslimiPlaceholder: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`w-full h-full bg-slate-800 flex items-center justify-center rounded-full ${className}`}>
        <svg width="70%" height="70%" viewBox="0 0 100 100" className="text-slate-600">
            <path d="M 50,0 A 50,50 0 0,0 0,50 H 10 A 40,40 0 0,1 50,10 Z M 50,0 A 50,50 0 0,1 100,50 H 90 A 40,40 0 0,0 50,10 Z M 50,100 A 50,50 0 0,1 0,50 H 10 A 40,40 0 0,0 50,90 Z M 50,100 A 50,50 0 0,0 100,50 H 90 A 40,40 0 0,1 50,90 Z" fill="currentColor" />
        </svg>
    </div>
);

const MatchCard: React.FC<{ person: ProcessedFamousPerson; reason: string; onAnalyze: (person: ProcessedFamousPerson, reason: string) => void; }> = ({ person, reason, onAnalyze }) => {
    const [imgError, setImgError] = useState(false);
    return (
        <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 text-center flex flex-col h-full">
            <div className="w-24 h-24 rounded-full mx-auto border-2 border-slate-600 mb-3 overflow-hidden">
                {imgError ? <EslimiPlaceholder /> : <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />}
            </div>
            <h4 className="font-lalezar text-xl text-white">{person.name}</h4>
            <p className="font-tanha text-sm text-gray-400 mb-3 flex-grow">{person.description}</p>
            <div className="bg-indigo-900/30 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">{reason}</div>
            <button onClick={() => onAnalyze(person, reason)} className="w-full text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-lg transition-colors">
                {"تحلیل شباهت تقدیر"}
            </button>
        </motion.div>
    );
};

const TypewriterReading: React.FC<{ text: string; className?: string; strongClassName?: string; onComplete?: () => void; speed?: number }> = ({ text, className = '', strongClassName = 'text-cyan-400', onComplete, speed = 25 }) => {
    const typedText = useTypewriter(text, speed, onComplete);
    
    const renderContent = (line: string) => {
        const parts = line.split('**');
        return parts.map((part, index) => 
            index % 2 === 1 ? <strong key={index} className={`font-semibold ${strongClassName}`}>{part}</strong> : <span key={index}>{part}</span>
        );
    };

    return (
        <div className={`font-tanha text-right leading-loose space-y-4 ${className}`}>
            {typedText.split('\n').filter(p => p.trim() !== '').map((p, i) => (
                <p key={i}>{renderContent(p)}</p>
            ))}
        </div>
    );
};

const modalBackdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};
const modalContentVariants: Variants = {
    hidden: { y: "100vh", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { y: "100vh", opacity: 0, transition: { duration: 0.3 } }
};

const AnalysisModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    person: ProcessedFamousPerson | null;
    analysisResult: string | null;
    isLoading: boolean;
    userName: string;
    userZodiac: ZodiacSignName | null;
}> = ({ isOpen, onClose, person, analysisResult, isLoading, userName, userZodiac }) => {
    const plaqueRef = useRef<HTMLDivElement>(null);
    const [imgError, setImgError] = useState(false);
    const [isMainTextComplete, setIsMainTextComplete] = useState(false);
    const [fal, setFal] = useState<{ ghazal: string; interpretation: string } | null>(null);
    const [isFalLoading, setIsFalLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [interpretationTypewriterKey, setInterpretationTypewriterKey] = useState(0);

    // Effect for handling modal close and cleaning up speech
    useEffect(() => {
        return () => {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        };
    }, [isOpen]);

    useEffect(() => {
        if (person) {
            setIsMainTextComplete(false);
            setImgError(false);
            setFal(null);
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, [person]);

    const [mainText, shadowText] = useMemo(() => {
        if (!analysisResult) return ['', ''];
        const parts = analysisResult.split('@@SHADOW@@');
        return [parts[0]?.trim() || '', parts[1]?.trim() || ''];
    }, [analysisResult]);

    const handleSpeakInterpretation = useCallback(() => {
        if (!fal?.interpretation) return;

        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(fal.interpretation);
        utterance.lang = 'fa-IR';
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        setInterpretationTypewriterKey(prev => prev + 1);
        speechSynthesis.speak(utterance);
    }, [fal]);

    const handleGetFal = async () => {
        if (!userName || !userZodiac) return;
        setIsFalLoading(true);
        setFal(null);
        try {
            const resultText = await generateHafezFal(userName, userZodiac);
            const [ghazal, interpretation] = resultText.split('@@TAFSIR@@');
            setFal({ ghazal: ghazal?.trim() || 'غزلی دریافت نشد.', interpretation: interpretation?.trim() || 'تعبیری دریافت نشد.' });
        } catch (error: any) {
            setFal({ ghazal: 'خطا در ارتباط با حضرت حافظ.', interpretation: 'لطفاً دوباره تلاش کنید.' });
        } finally {
            setIsFalLoading(false);
        }
    };

    const handleShare = useCallback(async () => {
        if (!plaqueRef.current) return;
        try {
            const canvas = await html2canvas(plaqueRef.current, { backgroundColor: 'transparent', useCORS: true, scale: 2 });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `لوح-کیهانی-${person?.name}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error: any) { console.error('Failed to create shareable image:', error.message); }
    }, [person]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={modalBackdropVariants} initial="hidden" animate="visible" exit="hidden"
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        variants={modalContentVariants} initial="hidden" animate="visible" exit="hidden"
                        className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 max-w-3xl w-full relative max-h-[90vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white z-20 p-2 rounded-full bg-slate-900/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="overflow-y-auto pr-2">
                            {isLoading ? (
                                <div className="min-h-[400px] flex flex-col items-center justify-center"> <Spinner /> <p className="mt-4 text-gray-400 font-tanha">{"در حال مکاشفه در الواح تقدیر..."}</p> </div>
                            ) : (
                                person && (
                                    <div ref={plaqueRef} className="bg-slate-900/50 rounded-lg">
                                        <TazhibBorder>
                                            <div className="p-8 text-center">
                                                <motion.div 
                                                    className="w-32 h-32 rounded-full mx-auto border-4 border-amber-300/50 mb-4 overflow-hidden" 
                                                    style={{ boxShadow: '0 0 20px 5px rgba(253, 224, 71, 0.4)' }}
                                                    animate={fal ? { scale: [1, 1.05, 1], boxShadow: '0 0 35px 10px rgba(253, 224, 71, 0.6)' } : {}}
                                                    transition={fal ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                                                >
                                                    {imgError ? <EslimiPlaceholder /> : (
                                                        <motion.img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover" onError={() => setImgError(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
                                                    )}
                                                </motion.div>
                                                <h4 className="text-3xl font-lalezar text-amber-300">{"تحلیل شباهت تقدیر"}</h4>
                                                <p className="font-tanha text-xl text-gray-300 mb-6">{`${userName} و ${person.name}`}</p>
                                                
                                                {!fal && <div className="prose prose-lg prose-invert max-w-none">
                                                    <TypewriterReading text={mainText} onComplete={() => setIsMainTextComplete(true)} />
                                                </div>}
                                                
                                                {shadowText && isMainTextComplete && !fal && (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-10 pt-8 border-t-2 border-dashed border-red-500/30">
                                                        <h5 className="font-lalezar text-3xl text-red-400 mb-4">{"دو روی سکه"}</h5>
                                                        <div className="prose prose-lg prose-invert max-w-none">
                                                            <TypewriterReading text={shadowText} className="text-red-200/90" strongClassName="text-amber-300" />
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {isFalLoading && <div className="min-h-[200px] flex flex-col items-center justify-center"><Spinner /><p className="mt-4 text-gray-400 font-tanha">{"در حال طلب یاری از لسان‌الغیب..."}</p></div>}
                                                
                                                {fal && (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-right bg-amber-50/10 p-6 rounded-lg border border-amber-200/20">
                                                        <h5 className="font-lalezar text-3xl text-amber-200 mb-4 text-center">{"تفأل شما"}</h5>
                                                        <div className="text-xl text-gray-200 leading-loose whitespace-pre-wrap text-center">
                                                            <TypewriterReading text={fal.ghazal} speed={60} />
                                                        </div>
                                                        <hr className="border-amber-200/20 my-6"/>
                                                        <h5 className="font-lalezar text-2xl text-amber-200 mb-2 flex items-center justify-center gap-3">
                                                            {"تعبیر"}
                                                            <button onClick={handleSpeakInterpretation} aria-label={isSpeaking ? "توقف" : "خواندن تعبیر"} className="text-amber-300 hover:text-amber-100 transition-colors">
                                                                {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                                            </button>
                                                        </h5>
                                                        <div className="text-lg text-gray-300 leading-relaxed text-right">
                                                             <TypewriterReading text={fal.interpretation} speed={40} key={interpretationTypewriterKey} />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </TazhibBorder>
                                    </div>
                                )
                            )}
                        </div>
                        
                        {!isLoading && person?.id === 'hafiz' && !fal && !isFalLoading && (
                            <div className="text-center my-6">
                                <button onClick={handleGetFal} className="gold-glow-button bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-3">
                                    <span className="content flex items-center gap-3">
                                        <BookOpen className="w-5 h-5" />
                                        {"طلب تفأل از حضرت حافظ"}
                                    </span>
                                </button>
                            </div>
                        )}

                        {!isLoading && (
                            <div className="text-center mt-auto pt-6 flex-shrink-0">
                                 <button onClick={handleShare} className="gold-glow-button bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2 shadow-lg shadow-amber-500/30">
                                    <span className="content flex items-center gap-2">
                                        <Download className="w-5 h-5" />
                                        {"اشتراک‌گذاری لوح کیهانی"}
                                    </span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

interface FamousMatchSectionProps {
    userZodiac: ZodiacSignName | null;
    userAbjad: number | null;
    userName: string;
}

const FamousMatchSection: React.FC<FamousMatchSectionProps> = ({ userZodiac, userAbjad, userName }) => {
    const famousPeople = useFamousPeopleData();
    const zodiacData = useZodiacData();
    const sectionRef = useRef<HTMLElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{ person: ProcessedFamousPerson | null, reason: string | null }>({ person: null, reason: null });
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);

    const matches = useMemo(() => {
        const zodiacMatches = userZodiac ? famousPeople.filter(p => p.zodiacSign === userZodiac && p.type !== 'negative') : [];
        const abjadMatches = userAbjad ? famousPeople.filter(p => Math.abs(p.abjadValue - userAbjad) <= 10) : [];
        const combined = [...zodiacMatches, ...abjadMatches];
        const uniqueMatches = Array.from(new Map(combined.map(p => [p.id, p])).values());
        return uniqueMatches.map(p => {
            const isZodiacMatch = userZodiac && p.zodiacSign === userZodiac;
            const isAbjadMatch = userAbjad && Math.abs(p.abjadValue - userAbjad) <= 10;
            let reason = isZodiacMatch && isAbjadMatch ? 'هم‌طالع و هم‌عدد' : isZodiacMatch ? 'هم‌طالع' : 'هم‌عدد';
            return { ...p, reason };
        }).slice(0, 8);
    }, [userZodiac, userAbjad, famousPeople]);

    const twoSides = useMemo(() => {
        if (!userZodiac) return { positive: null, negative: null };
        const positive = famousPeople.find(p => p.zodiacSign === userZodiac && p.type === 'positive');
        const negative = famousPeople.find(p => p.zodiacSign === userZodiac && p.type === 'negative');
        return { positive, negative };
    }, [userZodiac, famousPeople]);

    const handleAnalyzeClick = async (person: ProcessedFamousPerson, reason: string) => {
        setModalData({ person, reason });
        setIsModalOpen(true);
        setIsLoadingAnalysis(true);
        setAnalysisResult(null);
        try {
            const result = await generateDestinyComparison(userName, person, reason);
            setAnalysisResult(result.text || "تحلیل دریافت نشد.");
        } catch (error: any) { setAnalysisResult("خطا در دریافت تحلیل. لطفاً دوباره تلاش کنید."); } finally { setIsLoadingAnalysis(false); }
    };
    
    const closeModal = () => { setIsModalOpen(false); };

    const userZodiacInfo = zodiacData.find(z => z.modern === userZodiac);
    if (!matches.length && !twoSides.positive) return null;

    return (
        <section ref={sectionRef} id="famous-match-section" className="mt-16 py-16 border-t border-slate-800">
            <h3 className="text-4xl md:text-5xl font-bold text-center mb-4 font-lalezar tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text"> {"هم‌فرکانس با مشاهیر"} </h3>
            <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto font-tanha text-lg leading-relaxed"> {"شما با این شخصیت‌های تاریخی از نظر طالع یا عدد ابجد، انرژی مشترکی دارید. کشف کنید که این هم‌فرکانسی چه رازهایی را در مورد تقدیر شما آشکار می‌کند."} </p>
            {twoSides.positive && twoSides.negative && userZodiacInfo && (
                <div className="mb-16">
                     <h4 className="text-3xl font-lalezar text-center mb-8 text-indigo-300">{"دو روی سکه طالع"} <span style={{color: userZodiacInfo.iconColor}}>{userZodiacInfo.traditional}</span></h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <MatchCard person={twoSides.positive} reason={`پتانسیل مثبت طالع ${userZodiacInfo.traditional}`} onAnalyze={handleAnalyzeClick} />
                        <MatchCard person={twoSides.negative} reason={`سایه و چالش طالع ${userZodiacInfo.traditional}`} onAnalyze={handleAnalyzeClick} />
                     </div>
                </div>
            )}
            {matches.length > 0 && (
                <>
                    <h4 className="text-3xl font-lalezar text-center mb-8 text-indigo-300">{"سایر افراد هم‌فرکانس"}</h4>
                    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {matches.map(p => ( <MatchCard key={p.id} person={p} reason={p.reason} onAnalyze={handleAnalyzeClick} /> ))}
                    </motion.div>
                </>
            )}
            <AnalysisModal isOpen={isModalOpen} onClose={closeModal} person={modalData.person} analysisResult={analysisResult} isLoading={isLoadingAnalysis} userName={userName} userZodiac={userZodiac} />
        </section>
    );
};

export default FamousMatchSection;
