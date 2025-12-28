
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

const SETTINGS_KEY = 'celestial_explorer_settings';

interface AppSettings {
    notifyPlanetaryHour: boolean;
    notifyMoonEvents: boolean;
    notifyDailyAnalysis: boolean;
    soundEnabled: boolean;
}

const defaultSettings: AppSettings = {
    notifyPlanetaryHour: true,
    notifyMoonEvents: true,
    notifyDailyAnalysis: true,
    soundEnabled: true,
};

interface SettingsContextType extends AppSettings {
    setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AppSettings>(() => {
        try {
            const stored = localStorage.getItem(SETTINGS_KEY);
            return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
        } catch (e) {
            return defaultSettings;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error("Failed to save settings to localStorage", e);
        }
    }, [settings]);

    const setSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <SettingsContext.Provider value={{ ...settings, setSetting }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
