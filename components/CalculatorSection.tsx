import React, { useState, useMemo, lazy, Suspense } from 'react';
import { CalculatorMode} from '../types';
import ProfileManager, { useProfiles } from './common/ProfileManager';
import PersonalDashboard from './PersonalDashboard';
import Spinner from './common/Spinner';
import useStore from '../hooks/useStore';
// FIX: Import CosmicState to explicitly type the selector's state.
import { useCosmicStore, type CosmicState } from '../store/useCosmicStore';

// Lazy load all calculator components
const AstrologicalCalculator = lazy(() => import('./AstrologicalCalculator'));
const OccultMatrix = lazy(() => import('./OccultMatrix'));
const ScientificCalculator = lazy(() => import('./ScientificCalculator'));
const QarinCalculator = lazy(() => import('./QarinCalculator'));
const QarinNadiGuide = lazy(() => import('./QarinNadiGuide'));
const TalehCalculator = lazy(() => import('./TalehCalculator'));
const HoroscopeCalculator = lazy(() => import('./HoroscopeCalculator'));
const ElectionalCalculator = lazy(() => import('./ElectionalCalculator'));
const HoraryCalculator = lazy(() => import('./HoraryCalculator'));
const DignitiesCalculator = lazy(() => import('./DignitiesCalculator'));
const PersonalDignitiesCalculator = lazy(() => import('./PersonalDignitiesCalculator'));
const DreamInterpreter = lazy(() => import('./DreamInterpreter'));
const RelationshipCalculator = lazy(() => import('./RelationshipCalculator'));
const ZodiacCompatibility = lazy(() => import('./ZodiacCompatibility'));
const JafarCalculator = lazy(() => import('./JafarCalculator'));
const RabAlTalehAnalysis = lazy(() => import('./JafriNameAnalysis'));
const AbjadCalculator = lazy(() => import('./AbjadCalculator'));
const RamalCalculator = lazy(() => import('./RamalCalculator'));
const FamousMatchSection = lazy(() => import('./FamousMatchSection'));
const TransitTracker = lazy(() => import('./TransitTracker'));
const CelestialEphemeris = lazy(() => import('./CelestialEphemeris'));
const DashboardSection = lazy(() => import('./DashboardSection'));
const TraderVIPSignals = lazy(() => import('./TraderVIPSignals'));


type Category = 'self' | 'timing' | 'esoteric' | 'ai';

const CalculatorSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('self');
  const [mode, setMode] = useState<CalculatorMode>(CalculatorMode.Astrological);
  
  const { profiles, saveProfile, deleteProfile, isLoading, isSaving } = useProfiles();

  // FIX: Explicitly type the 'state' parameter to prevent it from being inferred as 'unknown'.
  const activeProfile = useStore(useCosmicStore, (state: CosmicState) => state.activeProfile);
  const setActiveProfile = useCosmicStore((state) => state.setActiveProfile);
  // FIX: Explicitly type the 'state' parameter to prevent it from being inferred as 'unknown'.
  const calculatedZodiacSign = useStore(useCosmicStore, (state: CosmicState) => state.calculatedZodiacSign);
  // FIX: Explicitly type the 'state' parameter to prevent it from being inferred as 'unknown'.
  const calculatedAbjad = useStore(useCosmicStore, (state: CosmicState) => state.calculatedAbjad);
  // FIX: Use 'setCalculatedZodiacSign' to match the updated store action.
  const setCalculatedZodiacSign = useCosmicStore((state) => state.setCalculatedZodiacSign);
  const setCalculatedAbjad = useCosmicStore((state) => state.setCalculatedAbjad);

  const handleSetMode = (newMode: CalculatorMode) => {
    // FIX: Use 'setCalculatedZodiacSign' to match the updated store action.
    setCalculatedZodiacSign(null);
    setCalculatedAbjad(null);
    setMode(newMode);
  };

  // Define tools structure
  const tools = useMemo(() => ({
    self: [
      { id: CalculatorMode.Astrological, label: 'رب‌الطالع', icon: '✨' },
      { id: CalculatorMode.OccultMatrix, label: 'ماتریس باطنی', icon: '💠' },
      { id: CalculatorMode.Qarin, label: 'محاسبه قرین', icon: '👻' },
      { id: CalculatorMode.TalehSaadNahs, label: 'سعد و نحس طالع', icon: '⚖️' },
      { id: CalculatorMode.PersonalDignities, label: 'شرف و وبال شخصی', icon: '🪐' },
      { id: CalculatorMode.Nadi, label: 'راهنمای نادی', icon: '🧘' },
    ],
    timing: [
      { id: CalculatorMode.Electional, label: 'علم اختیارات', icon: '📅' },
      { id: CalculatorMode.Dignities, label: 'شرف و وبال کواکب', icon: '📊' },
    ],
    esoteric: [
      { id: CalculatorMode.Ramal, label: 'رمل', icon: '🎲' },
      { id: CalculatorMode.Abjad, label: 'محاسبه‌گر ابجد', icon: '🔤' },
    ],
    ai: [
      { id: CalculatorMode.VipSignals, label: 'سیگنال VIP تریدرها', icon: '💹' },
      { id: CalculatorMode.Horoscope, label: 'زایچه (هوروسکوپ)', icon: '🔭' },
      { id: CalculatorMode.Transit, label: 'رهگیری سیارات', icon: '🛰️' },
      { id: CalculatorMode.Ephemeris, label: 'جدول نجومی لحظه‌ای', icon: '📈' },
      { id: CalculatorMode.Dream, label: 'تعبیر خواب', icon: '😴' },
      { id: CalculatorMode.Relationship, label: 'تحلیل رابطه', icon: '❤️' },
      { id: CalculatorMode.Compatibility, label: 'سنجش سازگاری', icon: '💞' },
      { id: CalculatorMode.Horary, label: 'سؤالات ساعتی', icon: '❓' },
      { id: CalculatorMode.Jafar, label: 'جفر', icon: '🔢' },
      { id: CalculatorMode.RabAlTalehAnalysis, label: 'تحلیل طالع ابجدی', icon: '🌀' },
      { id: CalculatorMode.Scientific, label: 'گزارش علمی', icon: '🔬' },
    ]
  }), []);

  // Categories metadata
  const categories: { id: Category; labelKey: string; icon: string }[] = [
    { id: 'self', labelKey: 'شناخت خود', icon: '👤' },
    { id: 'timing', labelKey: 'زمان‌بندی', icon: '⏳' },
    { id: 'esoteric', labelKey: 'علوم غریبه', icon: '📜' },
    { id: 'ai', labelKey: 'تحلیل با هوش مصنوعی', icon: '🤖' },
  ];

  const renderActiveCalculator = () => {
    switch (mode) {
        // FIX: Provide a null fallback for activeProfile to match prop types, as useStore can be undefined initially.
        case CalculatorMode.Astrological: return <AstrologicalCalculator onZodiacSignCalculate={setCalculatedZodiacSign} onAbjadCalculate={setCalculatedAbjad} activeProfile={activeProfile ?? null} />;
        // FIX: Provide a null fallback for activeProfile to match prop types.
        case CalculatorMode.OccultMatrix: return <OccultMatrix activeProfile={activeProfile ?? null} />;
        // Free tools
        case CalculatorMode.Ramal: return <RamalCalculator />;
        case CalculatorMode.Abjad: return <AbjadCalculator />;
        // FIX: Provide a null fallback for activeProfile to match prop types.
        case CalculatorMode.TalehSaadNahs: return <TalehCalculator activeProfile={activeProfile ?? null} />;
        // FIX: Provide a null fallback for activeProfile to match prop types.
        case CalculatorMode.Qarin: return <QarinCalculator activeProfile={activeProfile ?? null} />;
        case CalculatorMode.Nadi: return <QarinNadiGuide />;
        case CalculatorMode.Dignities: return <DignitiesCalculator />;
        
        // Premium tools (now directly rendered, logic is inside them)
        case CalculatorMode.VipSignals: return <TraderVIPSignals />;
        case CalculatorMode.Compatibility: return <ZodiacCompatibility />;
        case CalculatorMode.Relationship: return <RelationshipCalculator profiles={profiles} />;
        case CalculatorMode.Jafar: return <JafarCalculator />;
        // FIX: Provide a null fallback for activeProfile to match prop types.
        case CalculatorMode.RabAlTalehAnalysis: return <RabAlTalehAnalysis activeProfile={activeProfile ?? null} />;
        // FIX: Provide a null fallback for activeProfile to match prop types.
        case CalculatorMode.PersonalDignities: return <PersonalDignitiesCalculator activeProfile={activeProfile ?? null} />;
        // FIX: Provide a null fallback for activeProfile and use correct setter 'setCalculatedZodiacSign'.
        case CalculatorMode.Horoscope: return <HoroscopeCalculator activeProfile={activeProfile ?? null} onHoroscopeCalculated={setCalculatedZodiacSign} />;
        case CalculatorMode.Electional: return <ElectionalCalculator />;
        case CalculatorMode.Horary: return <HoraryCalculator />;
        case CalculatorMode.Dream: return <DreamInterpreter />;
        case CalculatorMode.Scientific: return <ScientificCalculator />;
        // FIX: Provide a null fallback for activeProfile to match prop types.
        case CalculatorMode.Transit: return <TransitTracker activeProfile={activeProfile ?? null} />;
        case CalculatorMode.Ephemeris: return <CelestialEphemeris />;

        default: return null;
    }
  };

  return (
    <section id="calculator" className="py-16 min-h-screen" role="region" aria-labelledby="calculator-title">
      <h3 id="calculator-title" className="text-4xl md:text-5xl font-bold text-center mb-4 text-indigo-400 font-lalezar tracking-wider">
        {'بخش محاسبات'}
      </h3>
      <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto font-tanha text-lg leading-relaxed">
        {'ابزارهای محاسباتی برای کاوش در جنبه‌های مختلف کیهان و سرنوشت، از علوم باستانی تا تحلیل‌های مدرن.'}
      </p>

      {/* Profile Manager */}
      <div id="profile-manager-anchor" className="mb-10 max-w-3xl mx-auto">
        <ProfileManager 
            onProfileChange={setActiveProfile}
            profiles={profiles}
            saveProfile={saveProfile}
            deleteProfile={deleteProfile}
            isLoading={isLoading}
            isSaving={isSaving}
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <Suspense fallback={<div className="flex justify-center items-center py-8"><Spinner /></div>}>
            <DashboardSection />
        </Suspense>
      </div>


      {/* FIX: Check for activeProfile existence before rendering the component, preventing errors when activeProfile is null/undefined. */}
      {activeProfile && (
        <div className="my-12">
            <PersonalDashboard activeProfile={activeProfile} />
        </div>
      )}

      {/* Categories Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); handleSetMode(tools[cat.id][0].id); }}
            className={`flex items-center px-6 py-3 rounded-full text-lg font-lalezar transition-all duration-300 transform hover:scale-105 ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-300 ring-offset-2 ring-offset-slate-900'
                : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            <span className="ml-2 text-2xl">{cat.icon}</span>
            {cat.labelKey}
          </button>
        ))}
      </div>

      {/* Sub-tools Navigation (Pills) */}
      <div className="flex flex-wrap justify-center gap-3 mb-10 px-4">
        {tools[activeCategory].map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleSetMode(tool.id)}
            aria-label={tool.label}
            className={`flex items-center px-4 py-2 rounded-lg text-sm md:text-base font-tanha transition-all duration-200 ${
              mode === tool.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-md'
                : 'bg-slate-800/30 text-gray-400 hover:bg-slate-800 hover:text-gray-200 border border-transparent'
            }`}
          >
            <span className="ml-2">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="transition-all duration-500 ease-in-out min-h-[400px]">
        <Suspense fallback={
          <div className="flex justify-center items-center h-full min-h-[400px]">
            <Spinner />
          </div>
        }>
          {renderActiveCalculator()}
        </Suspense>
      </div>

      <div id="famous-match-section-anchor">
        {(calculatedZodiacSign || calculatedAbjad) && (
          <Suspense fallback={<div className="flex justify-center items-center py-20"><Spinner /></div>}>
              <FamousMatchSection 
                  // FIX: Provide a null fallback for calculatedZodiacSign to match prop types.
                  userZodiac={calculatedZodiacSign ?? null}
                  // FIX: Provide a null fallback for calculatedAbjad to match prop types.
                  userAbjad={calculatedAbjad ?? null}
                  // FIX: Safely access activeProfile.name, which could be undefined initially from useStore.
                  userName={activeProfile?.name || 'شما'}
              />
          </Suspense>
        )}
      </div>
    </section>
  );
};

export default CalculatorSection;
