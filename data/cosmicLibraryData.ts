
export type ChapterId = 'intro' | 'babylonians' | 'greeks' | 'islamic_golden_age' | 'copernican_revolution' | 'ancient_civilizations' | 'horoscopy' | 'animal_instincts' | 'modern_astronomy' | 'financial_astrology' | 'medical_astrology' | 'agricultural_astrology' | 'mundane_astrology' | 'esoteric_planets' | 'jinn_classification' | 'angelic_beings' | 'warding_methods';

export type LibraryCategoryId = 'trade' | 'self' | 'energy' | 'history' | 'beings';

export interface LibraryCategory {
    id: LibraryCategoryId;
    title: string;
    icon: string;
    color: string; // Tailwind color name
}

export const libraryCategories: LibraryCategory[] = [
    { id: 'trade', title: 'ترید و ثروت', icon: '💰', color: 'amber' },
    { id: 'self', title: 'خودشناسی و طالع', icon: '👤', color: 'purple' },
    { id: 'energy', title: 'انرژی و متافیزیک', icon: '✨', color: 'teal' },
    { id: 'history', title: 'تاریخ و آموزش', icon: '📜', color: 'sky' },
    { id: 'beings', title: 'موجودات ماورایی', icon: '👻', color: 'rose' },
];

export interface LibraryChapter {
    id: ChapterId;
    categoryId: LibraryCategoryId;
    titleKey: string;
    icon: string; // Emoji
    contentKey: string;
    unlockHintKey?: string;
    bgStyle: string; // For gradient backgrounds
    isNew?: boolean;
}

export const cosmicLibraryData: LibraryChapter[] = [
    // Trade & Wealth
    {
        id: 'financial_astrology',
        categoryId: 'trade',
        titleKey: 'library_financial_astrology_title',
        icon: '📈',
        contentKey: 'library_financial_astrology_content',
        unlockHintKey: 'library_financial_astrology_hint',
        bgStyle: 'from-green-800 to-gray-900',
        isNew: true,
    },
    {
        id: 'mundane_astrology',
        categoryId: 'trade',
        titleKey: 'library_mundane_astrology_title',
        icon: '🕰️',
        contentKey: 'library_mundane_astrology_content',
        unlockHintKey: 'library_mundane_astrology_hint',
        bgStyle: 'from-sky-800 to-indigo-900',
        isNew: true,
    },
    // Self-Discovery
    {
        id: 'horoscopy',
        categoryId: 'self',
        titleKey: 'library_horoscopy_title',
        icon: '🔮',
        contentKey: 'library_horoscopy_content',
        unlockHintKey: 'library_horoscopy_hint',
        bgStyle: 'from-purple-900 to-fuchsia-900',
    },
    {
        id: 'esoteric_planets',
        categoryId: 'self',
        titleKey: 'library_esoteric_planets_title',
        icon: '🔢',
        contentKey: 'library_esoteric_planets_content',
        unlockHintKey: 'library_esoteric_planets_hint',
        bgStyle: 'from-purple-800 to-violet-900',
        isNew: true,
    },
    // Energy & Metaphysics
    {
        id: 'animal_instincts',
        categoryId: 'energy',
        titleKey: 'library_animal_instincts_title',
        icon: '🕊️',
        contentKey: 'library_animal_instincts_content',
        unlockHintKey: 'library_animal_instincts_hint',
        bgStyle: 'from-teal-900 to-green-900',
    },
    {
        id: 'medical_astrology',
        categoryId: 'energy',
        titleKey: 'library_medical_astrology_title',
        icon: '💎',
        contentKey: 'library_medical_astrology_content',
        unlockHintKey: 'library_medical_astrology_hint',
        bgStyle: 'from-pink-800 to-rose-900',
        isNew: true,
    },
    // History & Education
    {
        id: 'intro',
        categoryId: 'history',
        titleKey: 'library_intro_title',
        icon: '📜',
        contentKey: 'library_intro_content',
        bgStyle: 'from-slate-800 to-indigo-900',
    },
    {
        id: 'babylonians',
        categoryId: 'history',
        titleKey: 'library_babylonians_title',
        icon: '🏛️',
        contentKey: 'library_babylonians_content',
        bgStyle: 'from-amber-800 to-yellow-900',
    },
    {
        id: 'ancient_civilizations',
        categoryId: 'history',
        titleKey: 'library_ancient_civilizations_title',
        icon: '🌾',
        contentKey: 'library_ancient_civilizations_content',
        unlockHintKey: 'library_ancient_civilizations_hint',
        bgStyle: 'from-green-900 to-emerald-900',
    },
    {
        id: 'greeks',
        categoryId: 'history',
        titleKey: 'library_greeks_title',
        icon: '🏺',
        contentKey: 'library_greeks_content',
        unlockHintKey: 'library_greeks_hint',
        bgStyle: 'from-sky-900 to-blue-900',
    },
    {
        id: 'islamic_golden_age',
        categoryId: 'history',
        titleKey: 'library_islamic_golden_age_title',
        icon: '🔭',
        contentKey: 'library_islamic_golden_age_content',
        unlockHintKey: 'library_islamic_golden_age_hint',
        bgStyle: 'from-blue-900 to-cyan-900',
    },
    {
        id: 'agricultural_astrology',
        categoryId: 'history',
        titleKey: 'library_agricultural_astrology_title',
        icon: '🏛️',
        contentKey: 'library_agricultural_astrology_content',
        unlockHintKey: 'library_agricultural_astrology_hint',
        bgStyle: 'from-amber-800 to-stone-900',
        isNew: true,
    },
    {
        id: 'copernican_revolution',
        categoryId: 'history',
        titleKey: 'library_copernican_revolution_title',
        icon: '🌍',
        contentKey: 'library_copernican_revolution_content',
        unlockHintKey: 'library_copernican_revolution_hint',
        bgStyle: 'from-rose-900 to-red-900',
    },
    {
        id: 'modern_astronomy',
        categoryId: 'history',
        titleKey: 'library_modern_astronomy_title',
        icon: '🛰️',
        contentKey: 'library_modern_astronomy_content',
        unlockHintKey: 'library_modern_astronomy_hint',
        bgStyle: 'from-indigo-900 to-violet-900',
    },
    // Metaphysical Beings
    {
        id: 'jinn_classification',
        categoryId: 'beings',
        titleKey: 'library_jinn_classification_title',
        icon: '💨',
        contentKey: 'library_jinn_classification_content',
        unlockHintKey: 'library_jinn_classification_hint',
        bgStyle: 'from-red-900 to-gray-900',
        isNew: true,
    },
    {
        id: 'angelic_beings',
        categoryId: 'beings',
        titleKey: 'library_angelic_beings_title',
        icon: '🕊️',
        contentKey: 'library_angelic_beings_content',
        unlockHintKey: 'library_angelic_beings_hint',
        bgStyle: 'from-amber-800 to-indigo-900',
        isNew: true,
    },
    {
        id: 'warding_methods',
        categoryId: 'beings',
        titleKey: 'library_warding_methods_title',
        icon: '🛡️',
        contentKey: 'library_warding_methods_content',
        unlockHintKey: 'library_warding_methods_hint',
        bgStyle: 'from-cyan-900 to-slate-900',
        isNew: true,
    },
];
