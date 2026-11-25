
import React, { useContext, useState, useMemo } from 'react';
import {
  cosmicLibraryData,
  libraryCategories,
  LibraryChapter,
  LibraryCategoryId,
} from '../data/cosmicLibraryData';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';
import CosmicLibraryModal from './CosmicLibraryModal';
import { calculateReadingTime } from '../utils/readingTime';
import { libraryContent } from '../data/libraryContent';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

// Hardcoded translations
const translations: { [key: string]: string } = {
    'nav_cosmic_library': 'کتابخانه کیهانی',
    'cosmic_library_subtitle': 'سفری در تاریخ نجوم، از رصدهای باستانی تا اکتشافات مدرن.',
    'library_intro_title': 'مقدمه',
    'library_babylonians_title': 'بابلیان',
    'library_ancient_civilizations_title': 'تمدن‌های باستان',
    'library_greeks_title': 'یونانیان',
    'library_horoscopy_title': 'طالع‌بینی',
    'library_islamic_golden_age_title': 'عصر طلایی اسلام',
    'library_animal_instincts_title': 'غریزه کیهانی حیوانات',
    'library_copernican_revolution_title': 'انقلاب کوپرنیکی',
    'library_modern_astronomy_title': 'نجوم مدرن',
    'library_ancient_civilizations_hint': 'برای باز کردن این فصل، در سایت کاوش کنید.',
    'library_greeks_hint': 'برای باز کردن این فصل، بخش برج‌های فلکی را مشاهده کنید.',
    'library_horoscopy_hint': 'برای باز کردن این فصل، «رب‌الطالع» خود را محاسبه کنید.',
    'library_islamic_golden_age_hint': 'برای باز کردن این فصل، بخش «اسطرلاب» را مشاهده کنید.',
    'library_animal_instincts_hint': 'برای باز کردن این فصل، وضعیت «قمر در عقرب» را بررسی کنید.',
    'library_copernican_revolution_hint': 'برای باز کردن این فصل، بخش «ساعات سیارات» را مشاهده کنید.',
    'library_modern_astronomy_hint': 'برای باز کردن این فصل، یک گزارش علمی از یک جرم آسمانی دریافت کنید.',
    'library_financial_astrology_title': 'استراتژی ترید با چرخه‌های ماه',
    'library_financial_astrology_hint': 'برای باز کردن این فصل، از یکی از ابزارهای زمان‌بندی استفاده کنید.',
    'library_medical_astrology_title': 'دایره‌المعارف سنگ‌ها و ارتعاشات',
    'library_medical_astrology_hint': 'برای باز کردن این فصل، در مورد طبیعت سیارات بیاموزید.',
    'library_agricultural_astrology_title': 'میراث ستاره‌شناسان باستان',
    'library_agricultural_astrology_hint': 'برای باز کردن این فصل، بخش اسطرلاب را مشاهده کنید.',
    'library_mundane_astrology_title': 'راهنمای ساعات سعد و نحس',
    'library_mundane_astrology_hint': 'برای باز کردن این فصل، ایام سعد و نحس هفته را تحلیل کنید.',
    'library_esoteric_planets_title': 'هندسه مقدس و کدهای ابجد',
    'library_esoteric_planets_hint': 'برای باز کردن این فصل، شرف و وبال شخصی خود را تحلیل کنید.',
};

const categoryStyleMap: Record<LibraryCategoryId, string> = {
    trade: 'border-amber-500/50 shadow-amber-900/40',
    self: 'border-purple-500/50 shadow-purple-900/40',
    energy: 'border-teal-500/50 shadow-teal-900/40',
    history: 'border-sky-500/50 shadow-sky-900/40',
    // FIX: Added missing 'beings' property to satisfy the Record type.
    beings: 'border-rose-500/50 shadow-rose-900/40'
};

const ChapterCard: React.FC<{ chapter: LibraryChapter; isUnlocked: boolean; onRead: () => void; readingTime: string; }> = ({ chapter, isUnlocked, onRead, readingTime }) => {
    const { currentChapter, isPlaying, playChapter } = useAudioPlayer();
    const title = translations[chapter.titleKey] || chapter.titleKey;
    const hint = translations[chapter.unlockHintKey || ''] || '';
    const isActivePlayer = currentChapter?.id === chapter.id;

    const unlockedClasses = `${categoryStyleMap[chapter.categoryId]} shadow-lg cursor-pointer`;
    const lockedClasses = 'border-slate-700/80 grayscale';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className={`relative w-64 h-80 flex-shrink-0 group rounded-2xl overflow-hidden border-2 transform-gpu ${
                isUnlocked ? unlockedClasses : lockedClasses
            }`}
             onClick={isUnlocked ? onRead : undefined}
             title={!isUnlocked && hint ? hint : ''}
        >
            <motion.div
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                className="w-full h-full relative"
            >
                {/* Background Image and Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${chapter.bgStyle} z-0`}></div>
                <div className="absolute inset-0 bg-black/60 z-0"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="text-7xl mb-4 transition-transform duration-300 group-hover:scale-110">
                        {chapter.icon}
                    </div>
                    <h4 className="font-lalezar text-2xl text-white">
                        {title}
                    </h4>
                     <p className="text-sm text-gray-400 font-roboto-mono mt-2">{readingTime}</p>
                     {!isUnlocked && (
                         <div className="mt-4">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                         </div>
                     )}
                </div>

                {/* Play Button Overlay */}
                {isUnlocked && typeof window !== 'undefined' && 'speechSynthesis' in window && (
                    <div 
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={(e) => { e.stopPropagation(); playChapter(chapter); }}
                    >
                        <button 
                            className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-3xl transform hover:scale-110 transition-transform"
                            aria-label={`پخش صوت فصل ${title}`}
                        >
                            {isActivePlayer && isPlaying ? (
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
                            ) : (
                                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                            )}
                        </button>
                    </div>
                )}
                
                {isActivePlayer && isPlaying && (
                    <motion.div 
                        className="absolute inset-0 rounded-lg border-2 border-amber-400 pointer-events-none z-30"
                        animate={{ boxShadow: ["0 0 0px 0px rgba(251, 191, 36, 0.5)", "0 0 20px 5px rgba(251, 191, 36, 0.7)", "0 0 0px 0px rgba(251, 191, 36, 0.5)"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                )}

                {chapter.isNew && isUnlocked && (
                    <div className="absolute top-2 right-2 bg-amber-400 text-black px-2 py-0.5 text-xs font-bold rounded-full shadow-lg animate-pulse z-20">
                        {"جدید"}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

const CosmicLibrarySection: React.FC = () => {
    const libraryContext = useContext(CosmicLibraryContext);
    const [selectedChapter, setSelectedChapter] = useState<LibraryChapter | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<LibraryCategoryId>(libraryCategories[0].id);


    const filteredChapters = useMemo(() => {
        return cosmicLibraryData
            .filter(chapter => chapter.categoryId === activeCategory)
            .filter(chapter =>
                (translations[chapter.titleKey] || chapter.titleKey)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
    }, [activeCategory, searchTerm]);

    const colorMap: { [key in LibraryCategoryId]: string } = {
        trade: 'amber',
        self: 'purple',
        energy: 'teal',
        history: 'sky',
        // FIX: Added missing 'beings' property to match the type.
        beings: 'rose',
    };

    return (
        <section id="cosmic-library" role="region" aria-labelledby="cosmic-library-title">
            <h3 id="cosmic-library-title" className="text-4xl md:text-5xl font-bold text-center mb-4 font-lalezar tracking-wider bg-gradient-to-r from-indigo-400 to-fuchsia-500 text-transparent bg-clip-text">
                {translations['nav_cosmic_library']}
            </h3>
            <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto font-tanha text-lg leading-relaxed">
                {translations['cosmic_library_subtitle']}
            </p>

            {/* Tab Menu */}
            <div className="flex justify-center mb-8">
                <div className="flex items-center flex-wrap justify-center gap-2 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-2 rounded-xl">
                    {libraryCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`relative px-4 py-2 rounded-lg text-lg font-lalezar transition-colors ${activeCategory === cat.id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            {activeCategory === cat.id && (
                                <motion.div
                                    layoutId="libraryTabIndicator"
                                    className={`absolute inset-0 rounded-lg bg-gradient-to-r from-${colorMap[cat.id]}-500/40 to-${colorMap[cat.id]}-600/60 border border-${colorMap[cat.id]}-500/50`}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center">{cat.icon} <span className="mr-2">{cat.title}</span></span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Input */}
             <div className="max-w-xl mx-auto mb-10">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="جستجو در این دسته..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pr-10 pl-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        aria-label="جستجو در کتابخانه کیهانی"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Chapters Grid */}
            <div className="min-h-[400px]">
                <LayoutGroup>
                    <motion.div 
                        layout
                        className="flex justify-center gap-6 flex-wrap"
                    >
                        <AnimatePresence mode="wait">
                            {filteredChapters.length > 0 ? filteredChapters.map((chapter) => {
                                const readingTime = calculateReadingTime(libraryContent[chapter.contentKey]);
                                return (
                                    <ChapterCard 
                                        key={chapter.id}
                                        chapter={chapter}
                                        isUnlocked={libraryContext?.unlockedChapters.has(chapter.id) ?? false}
                                        onRead={() => setSelectedChapter(chapter)}
                                        readingTime={readingTime}
                                    />
                                );
                            }) : (
                                <motion.div 
                                    key="no-results"
                                    layout 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                >
                                    <p className="text-gray-400 text-center font-tanha text-xl py-16">هیچ موردی با جستجوی شما یافت نشد.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </LayoutGroup>
            </div>

            {selectedChapter && (
                <CosmicLibraryModal chapter={selectedChapter} onClose={() => setSelectedChapter(null)} />
            )}
        </section>
    );
};

export default CosmicLibrarySection;
