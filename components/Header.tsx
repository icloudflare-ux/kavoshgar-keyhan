
import React, { useState } from 'react';
import { useTheme, FullTheme } from '../contexts/ThemeContext';
import { useTimeZone, availableTimeZones } from '../contexts/TimeZoneContext';
import { AccordionItem } from './common/Accordion';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import ThemeSwitcherIcon from './common/ThemeSwitcherIcon';
import { useSettings } from '../contexts/SettingsContext';
import ToggleSwitch from './common/ToggleSwitch';
import UserStats from './UserStats';
import { Hub } from '../../App';
import { ArrowRight } from 'lucide-react';
import FeatureChecklist from './FeatureChecklist';


const seasonIcons: Record<string, string> = { spring: '🌸', summer: '☀️', autumn: '🍂', winter: '❄️' };
const eventIcons: Record<string, string> = { nowruz: '🌱', yalda: '🍉', christmas: '🎄' };

// --- Dropdown animation variants ---
const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.15, ease: "easeOut" } },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.04
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
};

const ThemeSelector: React.FC = () => {
    const { baseTheme, activeTheme, themeMode, toggleBaseTheme, setThemeMode, season, event } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const eventNames: Record<string, string> = { nowruz: 'نوروز', yalda: 'یلدا', christmas: 'کریسمس' };
    const seasonNames: Record<string, string> = { spring: 'بهار', summer: 'تابستان', autumn: 'پاییز', winter: 'زمستان' };
    
    const activeModeName = event ? eventNames[event] : seasonNames[season] || '...';
    const activeIcon = event ? eventIcons[event] : seasonIcons[season];
    const baseThemeName = baseTheme === 'dark' ? 'تاریک' : 'روشن';

    const ThemeOptionButton: React.FC<{ theme: FullTheme | 'auto', children: React.ReactNode }> = ({ theme, children }) => (
        <motion.button
            variants={itemVariants}
            onClick={() => setThemeMode(theme)}
            className={`w-full text-right px-4 py-2 text-sm rounded-md flex items-center justify-between transition-colors duration-200 font-tanha ${themeMode === theme ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] font-bold' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)]'}`}
        >
            {children}
            {themeMode === theme && <span className="text-[var(--color-accent)]">✓</span>}
        </motion.button>
    );

    return (
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button onClick={toggleBaseTheme} className="p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-hover-bg)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/80 focus:ring-offset-slate-900" aria-label="تغییر تم">
                <ThemeSwitcherIcon theme={baseTheme} />
            </button>
            <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial="hidden" animate="visible" exit="hidden" variants={dropdownVariants}
                    className="absolute ltr:right-0 rtl:left-0 mt-2 p-2 w-64 bg-slate-900/70 backdrop-blur-md border border-purple-500/30 rounded-2xl shadow-lg shadow-purple-500/10 z-50"
                >
                    <motion.div variants={itemVariants} className="px-4 py-2 border-b mb-2" style={{ borderColor: 'var(--color-border)'}}>
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">حالت: {baseThemeName} ({activeIcon} {activeModeName})</p>
                    </motion.div>
                    <ThemeOptionButton theme={'auto'}><span>خودکار</span></ThemeOptionButton>

                    {event && (
                        <>
                            <motion.div variants={itemVariants} className="my-2 border-t" style={{ borderColor: 'var(--color-border)' }}></motion.div>
                            <motion.p variants={itemVariants} className="px-4 pt-2 pb-1 text-xs font-bold text-[var(--color-accent)]">رویداد ویژه</motion.p>
                            <ThemeOptionButton theme={`${baseTheme}-${event}` as FullTheme}>
                                <span>{eventIcons[event]} {eventNames[event]}</span>
                            </ThemeOptionButton>
                        </>
                    )}
                    
                    <motion.div variants={itemVariants} className="my-2 border-t" style={{ borderColor: 'var(--color-border)' }}></motion.div>
                    <motion.p variants={itemVariants} className="px-4 pt-2 pb-1 text-xs font-bold text-[var(--color-text-secondary)]">تم‌های فصلی</motion.p>
                    {Object.entries(seasonIcons).map(([seasonKey, icon]) => (
                        <ThemeOptionButton key={seasonKey} theme={`${baseTheme}-${seasonKey}` as FullTheme}>
                            <span>{icon} {seasonNames[seasonKey]}</span>
                        </ThemeOptionButton>
                    ))}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

const AuthSection: React.FC = () => {
    const { isAuthenticated, user, openAuthModal, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (isAuthenticated && user) {
        return (
            <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
                <button className="flex items-center space-x-2 rtl:space-x-reverse text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors duration-300 text-lg font-tanha tracking-wide">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span>خوش آمدید, {user.username}</span>
                    <motion.svg animate={{ rotate: isOpen ? 180 : 0 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></motion.svg>
                </button>
                <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial="hidden" animate="visible" exit="hidden" variants={dropdownVariants}
                        className="absolute ltr:right-0 rtl:left-0 mt-2 p-2 w-48 bg-slate-900/70 backdrop-blur-md border border-purple-500/30 rounded-2xl shadow-lg shadow-purple-500/10 z-50"
                    >
                        <motion.a variants={itemVariants} href="#calculator" className="block w-full text-right px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-bg)] rounded-md font-tanha">پروفایل کاربری</motion.a>
                        <motion.button variants={itemVariants} onClick={logout} className="block w-full text-right px-4 py-2 text-sm text-red-400 hover:bg-[var(--color-hover-bg)] rounded-md font-tanha">خروج</motion.button>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <button 
            onClick={openAuthModal}
            className="btn-animated-gradient text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 font-tanha shadow-lg shadow-indigo-500/40 hover:shadow-indigo-400/60 text-lg tracking-wider"
        >
            ورود / ثبت‌نام
        </button>
    );
}

interface HeaderProps {
    activeHub: Hub;
    onBackToHubs: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeHub, onBackToHubs }) => {
  const { timeZone, setTimeZone } = useTimeZone();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const { notifyPlanetaryHour, notifyMoonEvents, notifyDailyAnalysis, soundEnabled, setSetting } = useSettings();
  const isHubView = activeHub !== 'hubs';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsNavOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 120; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/40 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40 transition-colors duration-500">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 container mx-auto">
        <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')} className="flex items-center space-x-3 rtl:space-x-reverse shrink-0">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25v19.5M2.25 12h19.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.06 7.06l9.88 9.88M7.06 16.94L16.94 7.06" opacity="0.5" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
          </svg>
          <h1 className="hidden sm:block text-xl md:text-2xl font-bold text-[var(--color-text-primary)] font-lalezar tracking-wider whitespace-nowrap">
            کاوشگر کیهان
          </h1>
        </a>

        <AnimatePresence mode="wait">
            {isHubView && (
                <motion.button
                    key="back-button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={onBackToHubs}
                    className="hidden md:flex items-center gap-2 bg-slate-800/50 text-gray-300 hover:bg-indigo-500/30 hover:text-white px-4 py-2 rounded-lg transition-colors duration-300 text-lg font-lalezar tracking-wider"
                >
                    <ArrowRight size={20} />
                    {"بازگشت به هاب‌ها"}
                </motion.button>
            )}
        </AnimatePresence>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="hidden md:block">
            <AuthSection />
          </div>
          
          <FeatureChecklist />
          <ThemeSelector />

          <div className="relative" onMouseEnter={() => setSettingsOpen(true)} onMouseLeave={() => setSettingsOpen(false)}>
            <button className="p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-hover-bg)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500/80 focus:ring-offset-slate-900" aria-label="تنظیمات">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <AnimatePresence>
            {isSettingsOpen && (
              <motion.div 
                  initial="hidden" animate="visible" exit="hidden" variants={dropdownVariants}
                  className="absolute ltr:right-0 rtl:left-0 mt-2 p-4 w-80 bg-slate-900/70 backdrop-blur-md border border-purple-500/30 rounded-2xl shadow-lg shadow-purple-500/10 z-50"
              >
                  <div className="space-y-4">
                      <motion.div variants={itemVariants}>
                          <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2 font-tanha">منطقه زمانی</label>
                          <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)} className="w-full rounded-lg p-2 text-sm border bg-slate-800/80" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border)'}}>
                          {availableTimeZones.map(tz => ( <option key={tz.value} value={tz.value}>{tz.label}</option> ))}
                          </select>
                      </motion.div>
                      <motion.div variants={itemVariants} className="border-t border-slate-700/50 my-2"></motion.div>
                      <motion.div variants={itemVariants}>
                           <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-3 font-tanha">تنظیمات اعلان‌ها</label>
                           <div className="space-y-3">
                              <ToggleSwitch label="ساعات سیارات" isOn={notifyPlanetaryHour} onToggle={() => setSetting('notifyPlanetaryHour', !notifyPlanetaryHour)} />
                              <ToggleSwitch label="رویدادهای ماه" isOn={notifyMoonEvents} onToggle={() => setSetting('notifyMoonEvents', !notifyMoonEvents)} />
                              <ToggleSwitch label="تحلیل روزانه" isOn={notifyDailyAnalysis} onToggle={() => setSetting('notifyDailyAnalysis', !notifyDailyAnalysis)} />
                              <ToggleSwitch label="صدای اعلان" isOn={soundEnabled} onToggle={() => setSetting('soundEnabled', !soundEnabled)} />
                           </div>
                      </motion.div>
                  </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

           <button onClick={() => setIsNavOpen(!isNavOpen)} className="md:hidden ltr:ml-2 rtl:mr-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>
      
      <UserStats />

      {isNavOpen && (
        <div className="md:hidden bg-slate-900/80 backdrop-blur-xl absolute top-[calc(4rem+2.5rem)] left-0 w-full animate-fade-in-down border-b border-white/10 shadow-xl overflow-y-auto max-h-[calc(100vh-100px)] rounded-b-2xl">
            <nav className="flex flex-col p-4 font-tanha">
              <div className="p-2 border-b border-slate-700/50 mb-4">
                <AuthSection />
              </div>
               
               {isHubView && (
                    <button onClick={() => { onBackToHubs(); setIsNavOpen(false); }} className="text-left w-full text-lg font-semibold text-gray-200 py-4 px-2 border-b border-slate-700/50 flex items-center gap-2">
                        <ArrowRight size={20} />
                        {"بازگشت به هاب‌ها"}
                    </button>
               )}

               <AccordionItem title="تنظیمات">
                    <div className="p-2 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">منطقه زمانی</label>
                            <select 
                                value={timeZone} 
                                onChange={(e) => setTimeZone(e.target.value)}
                                className="w-full rounded p-2 text-sm border"
                                style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border)'}}
                            >
                                {availableTimeZones.map(tz => (
                                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-3">تنظیمات اعلان‌ها</label>
                             <div className="space-y-3">
                                <ToggleSwitch label="ساعات سیارات" isOn={notifyPlanetaryHour} onToggle={() => setSetting('notifyPlanetaryHour', !notifyPlanetaryHour)} />
                                <ToggleSwitch label="رویدادهای ماه" isOn={notifyMoonEvents} onToggle={() => setSetting('notifyMoonEvents', !notifyMoonEvents)} />
                                <ToggleSwitch label="تحلیل روزانه" isOn={notifyDailyAnalysis} onToggle={() => setSetting('notifyDailyAnalysis', !notifyDailyAnalysis)} />
                                <ToggleSwitch label="صدای اعلان" isOn={soundEnabled} onToggle={() => setSetting('soundEnabled', !soundEnabled)} />
                             </div>
                        </div>
                    </div>
               </AccordionItem>
            </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
