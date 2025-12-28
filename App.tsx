import React, { lazy, Suspense, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthModal from './components/auth/AuthModal';
import SupportCenter from './components/support/SupportCenter';
import Spinner from './components/common/Spinner';
import OnboardingModal from './components/OnboardingModal';

// --- Core & Hub Components ---
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import CosmicHubs from './components/CosmicHubs';
import CentralDashboard from './components/CentralDashboard';

// --- Lazy-loaded Components ---
const CosmicReceipt = lazy(() => import('./components/payment/PaymentConfirmation'));
const ToastContainer = lazy(() => import('./components/common/ToastContainer'));
const NotificationManager = lazy(() => import('./components/NotificationManager'));
const MiniPlayer = lazy(() => import('./components/MiniPlayer'));

// --- Hub 1 Components ---
const CosmicEventsTimer = lazy(() => import('./components/CosmicEventsTimer'));
const AdminSignalManagement = lazy(() => import('./components/AdminSignalManagement'));
const TraderVIPSignals = lazy(() => import('./components/TraderVIPSignals'));
const TradingAstrologyCalendar = lazy(() => import('./components/TradingAstrologyCalendar'));
const PlanetaryHours = lazy(() => import('./components/PlanetaryHours'));
const MoonPhase = lazy(() => import('./components/MoonPhase'));
const QamarDarAghrabSection = lazy(() => import('./components/QamarDarAghrabSection'));
const CelestialEphemeris = lazy(() => import('./components/CelestialEphemeris'));

// --- Hub 2 Components ---
const CalculatorSection = lazy(() => import('./components/CalculatorSection'));

// --- Hub 3 Components ---
const SolarSystemOrrery = lazy(() => import('./components/SolarSystemOrrery'));
const WhyUsSection = lazy(() => import('./components/WhyUsSection'));
const HistorySection = lazy(() => import('./components/HistorySection'));
const ZodiacSignsTable = lazy(() => import('./components/ZodiacSignsTable'));
const RabAlTalehWeekly = lazy(() => import('./components/RabAlTalehWeekly'));
const MonthlyCalendar = lazy(() => import('./components/MonthlyCalendar'));
const WeeklyAuspices = lazy(() => import('./components/WeeklyAuspices'));
const TraditionalSources = lazy(() => import('./components/TraditionalSources'));
const AstrolabeSection = lazy(() => import('./components/AstrolabeSection'));
const TalehSaadNahsSection = lazy(() => import('./components/TalehSaadNahsSection'));
const AstronomicalTerms = lazy(() => import('./components/AstronomicalTerms'));
const AstrologyInDepth = lazy(() => import('./components/AstrologyInDepth'));
const CosmicLibrarySection = lazy(() => import('./components/CosmicLibrarySection'));
const ExperiencesForum = lazy(() => import('./components/ExperiencesForum'));
const AyatAlKursi = lazy(() => import('./components/AyatAlKursi'));
const ZodiacArticle = lazy(() => import('./components/seo/ZodiacArticle'));

export type Hub = 'hubs' | 'control_room' | 'laboratory' | 'wisdom_treasury';

const MainApp: React.FC = () => {
  const { user, isAuthenticated, isAuthModalOpen, isConfirmationVisible } = useAuth();
  const [activeHub, setActiveHub] = useState<Hub>('hubs');

  // تابع رندر محتوای داخلی هاب‌ها (بدون تکرار CosmicHubs)
  const renderActiveHubContent = () => {
    switch (activeHub) {
      case 'control_room':
        return (
          <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
            <div className="space-y-24">
                <CelestialEphemeris />
                <TraderVIPSignals />
                <TradingAstrologyCalendar />
                <PlanetaryHours />
                <MoonPhase />
                <QamarDarAghrabSection />
                <AdminSignalManagement />
            </div>
          </Suspense>
        );
      case 'laboratory':
        return (
            <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
                <CalculatorSection />
            </Suspense>
        );
      case 'wisdom_treasury':
        return (
            <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
                <div className="space-y-24">
                    <CosmicLibrarySection />
                    <WhyUsSection />
                    <HistorySection />
                    <SolarSystemOrrery />
                    <ZodiacSignsTable calculatedSign={null} />
                    <RabAlTalehWeekly calculatedSign={null} />
                    <MonthlyCalendar calculatedSign={null} />
                    <WeeklyAuspices />
                    <TraditionalSources />
                    <AstrolabeSection />
                    <TalehSaadNahsSection />
                    <AstronomicalTerms />
                    <AstrologyInDepth />
                    <ExperiencesForum />
                    <AyatAlKursi />
                    <ZodiacArticle />
                </div>
            </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative z-10">
      <Header activeHub={activeHub} onBackToHubs={() => setActiveHub('hubs')} />
      
      <Suspense fallback={null}>
        {activeHub === 'control_room' && <CosmicEventsTimer />}
      </Suspense>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {activeHub === 'hubs' ? (
          <div className="space-y-20">
            {/* نمایش هیرو برای کاربران مهمان و داشبورد برای اعضا */}
            {isAuthenticated ? <CentralDashboard /> : <Hero />}
            
            {/* نمایش کارت‌های انتخاب هاب فقط در اینجا */}
            <CosmicHubs onHubSelect={setActiveHub} />
          </div>
        ) : (
          /* رندر محتوای اختصاصی هاب انتخاب شده */
          <div className="mt-10">
            {renderActiveHubContent()}
          </div>
        )}
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