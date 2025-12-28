
import React, { lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthModal from './components/auth/AuthModal';
import SupportCenter from './components/support/SupportCenter';
import Spinner from './components/common/Spinner';
import OnboardingModal from './components/OnboardingModal';
import useStore from './hooks/useStore';
// FIX: Import CosmicState to explicitly type the selector's state.
import { useCosmicStore, type CosmicState } from './store/useCosmicStore';

// Main application components
import Header from './components/Header';
import Hero from './components/Hero';
import SolarSystemOrrery from './components/SolarSystemOrrery';
import WhyUsSection from './components/WhyUsSection';
import HistorySection from './components/HistorySection';
import CalculatorSection from './components/CalculatorSection';
import ZodiacSignsTable from './components/ZodiacSignsTable';
import RabAlTalehWeekly from './components/RabAlTalehWeekly';
import QamarDarAghrabSection from './components/QamarDarAghrabSection';
import MoonPhase from './components/MoonPhase';
import MonthlyCalendar from './components/MonthlyCalendar';
import WeeklyAuspices from './components/WeeklyAuspices';
import PlanetaryHours from './components/PlanetaryHours';
import TradingAstrologyCalendar from './components/TradingAstrologyCalendar';
import TraditionalSources from './components/TraditionalSources';
import AstrolabeSection from './components/AstrolabeSection';
import TalehSaadNahsSection from './components/TalehSaadNahsSection';
import AstronomicalTerms from './components/AstronomicalTerms';
import AstrologyInDepth from './components/AstrologyInDepth';
import ExperiencesForum from './components/ExperiencesForum'; // New Forum component
import AyatAlKursi from './components/AyatAlKursi';
import ZodiacArticle from './components/seo/ZodiacArticle';
import Footer from './components/Footer';

// Lazy load modals and global components
const CosmicReceipt = lazy(() => import('./components/payment/PaymentConfirmation'));
const ToastContainer = lazy(() => import('./components/common/ToastContainer'));
const NotificationManager = lazy(() => import('./components/NotificationManager'));
const MiniPlayer = lazy(() => import('./components/MiniPlayer'));
const CosmicEventsTimer = lazy(() => import('./components/CosmicEventsTimer'));
const CosmicLibrarySection = lazy(() => import('./components/CosmicLibrarySection'));

const MainApp: React.FC = () => {
  const { isAuthModalOpen, isConfirmationVisible } = useAuth();
  // FIX: Explicitly type the 'state' parameter to prevent it from being inferred as 'unknown'. This resolves the type error when passing calculatedZodiacSign to child components.
  const calculatedZodiacSign = useStore(useCosmicStore, (state: CosmicState) => state.calculatedZodiacSign);

  return (
    <div className="relative z-10">
      <Header />
      <Suspense fallback={null}>
        <CosmicEventsTimer />
      </Suspense>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-24">
        <Hero />
        <SolarSystemOrrery />
        <div className="space-y-24">
            <WhyUsSection />
            <HistorySection />
            <CalculatorSection />
            {/* FIX: Provide a null fallback for calculatedSign to match prop types, as useStore can be undefined initially. */}
            <ZodiacSignsTable calculatedSign={calculatedZodiacSign ?? null} />
            <RabAlTalehWeekly calculatedSign={calculatedZodiacSign ?? null} />
            <QamarDarAghrabSection />
            <MoonPhase />
            <MonthlyCalendar calculatedSign={calculatedZodiacSign ?? null} />
            <WeeklyAuspices />
            <PlanetaryHours />
            <TradingAstrologyCalendar />
            <TraditionalSources />
            <AstrolabeSection />
            <TalehSaadNahsSection />
            <AstronomicalTerms />
            <AstrologyInDepth />
            <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
              <CosmicLibrarySection />
            </Suspense>
            <ExperiencesForum />
            <AyatAlKursi />
            <ZodiacArticle />
        </div>
      </main>
      <Footer />
      
      {isAuthModalOpen && <AuthModal />}
      <Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900"><Spinner/></div>}>
        {isConfirmationVisible && <CosmicReceipt />}
        <ToastContainer />
        <NotificationManager />
      </Suspense>
      <SupportCenter />
      <OnboardingModal />
      <Suspense fallback={null}>
        <MiniPlayer />
      </Suspense>
    </div>
  );
};

const App: React.FC = () => {
  const { sessionLoading } = useAuth();

  if (sessionLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <MainApp />
    </div>
  );
};

export default App;
