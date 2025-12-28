
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import ThemeRipple from '../components/common/ThemeRipple';

type BaseTheme = 'dark' | 'light';
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type Event = 'yalda' | 'nowruz' | 'christmas';
export type FullTheme = `${BaseTheme}-${Season}` | `${BaseTheme}-${Event}`;
type ThemeMode = 'auto' | FullTheme;

interface ThemeContextType {
  baseTheme: BaseTheme;
  activeTheme: FullTheme;
  themeMode: ThemeMode;
  toggleBaseTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  season: Season;
  event: Event | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Determine season based on Northern Hemisphere dates
const getSeason = (date: Date): Season => {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day < 21)) return 'spring';
  if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day < 23)) return 'summer';
  if ((month === 8 && day >= 23) || month === 9 || month === 10 || (month === 11 && day < 21)) return 'autumn';
  return 'winter';
};

// Determine special event based on date
const getSpecialEvent = (date: Date): Event | null => {
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // Nowruz (Mar 20-21)
    if (month === 2 && (day === 20 || day === 21)) return 'nowruz';
    // Yalda Night (Dec 21-22)
    if (month === 11 && (day === 21 || day === 22)) return 'yalda';
    // Christmas (Dec 24-25)
    if (month === 11 && (day === 24 || day === 25)) return 'christmas';
    
    return null;
};


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseTheme, setBaseTheme] = useState<BaseTheme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('baseTheme') as BaseTheme;
      if (stored) return stored;
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    }
    return 'dark';
  });

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
     if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('themeMode') as ThemeMode;
      return stored || 'auto';
    }
    return 'auto';
  });

  const [isRippling, setIsRippling] = useState(false);

  const today = new Date();
  const season = getSeason(today);
  const event = getSpecialEvent(today);

  const activeTheme = useMemo<FullTheme>(() => {
    if (themeMode === 'auto') {
      const themeSuffix = event || season;
      return `${baseTheme}-${themeSuffix}` as FullTheme;
    }
    return themeMode;
  }, [themeMode, baseTheme, season, event]);

  const activeBaseTheme = activeTheme.startsWith('light') ? 'light' : 'dark';

  useEffect(() => {
    const root = window.document.documentElement;

    // Set light/dark class for Tailwind CSS
    root.classList.remove('light', 'dark');
    root.classList.add(activeBaseTheme);
    
    // Set data-theme attribute for CSS variables
    root.setAttribute('data-theme', activeTheme);

    localStorage.setItem('baseTheme', baseTheme);
    localStorage.setItem('themeMode', themeMode);
  }, [baseTheme, themeMode, activeTheme, activeBaseTheme]);

  const toggleBaseTheme = useCallback(() => {
    setIsRippling(true);
    const rippleTimeout = setTimeout(() => setIsRippling(false), 1000); // Duration of ripple animation
    setBaseTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    return () => clearTimeout(rippleTimeout);
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setIsRippling(true);
    const rippleTimeout = setTimeout(() => setIsRippling(false), 1000);
    setThemeModeState(mode);
    return () => clearTimeout(rippleTimeout);
  }, []);

  return (
    <ThemeContext.Provider value={{ baseTheme, activeTheme, themeMode, toggleBaseTheme, setThemeMode, season, event }}>
      {children}
      {isRippling && <ThemeRipple />}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};