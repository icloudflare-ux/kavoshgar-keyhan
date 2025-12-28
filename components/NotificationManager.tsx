
import React, { useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { generateWelcomeMessage } from '../services/geminiService';
import { useCurrentPlanetaryHour } from '../hooks/useCurrentPlanetaryHour';
import { qamarDarAghrabData } from '../data/qamarDarAghrabData';
import { useZodiacRulers } from '../data/rabAlTalehData';
import { calculateAbjad } from '../utils/abjad';
import { useCosmicStore } from '../store/useCosmicStore';

const NotificationManager: React.FC = () => {
    const { addToast } = useToast();
    const { notifyPlanetaryHour, notifyMoonEvents, notifyDailyAnalysis } = useSettings();
    const { user, isAuthenticated } = useAuth();
    const zodiacRulers = useZodiacRulers();
    const { setIsNahs, setCurrentPlanet } = useCosmicStore();

    // Welcome Message
    useEffect(() => {
        const sessionKey = 'welcome_message_shown';
        if (isAuthenticated && user && notifyDailyAnalysis && !sessionStorage.getItem(sessionKey)) {
            const totalAbjad = calculateAbjad(user.username) + calculateAbjad('حوا'); // Assume mother name is not available
            const remainder = totalAbjad % 12;
            const rabTale = remainder === 0 ? 12 : remainder;
            const signInfo = zodiacRulers.find(z => z.id === rabTale);

            if (signInfo) {
                generateWelcomeMessage(user.username, signInfo.sign).then(message => {
                    addToast(message, 'info', '👋');
                    sessionStorage.setItem(sessionKey, 'true');
                });
            }
        }
    }, [isAuthenticated, user, notifyDailyAnalysis, addToast, zodiacRulers]);
    
    // Planetary Hour Change & Saad/Nahs Status Update
    const currentHour = useCurrentPlanetaryHour();
    const prevHourRef = useRef<string | null>(null);

    useEffect(() => {
        if (currentHour && currentHour.planet) {
            const planet = currentHour.planet;
            
            // Update global Saad/Nahs and Planet state
            const isCurrentlyNahs = planet.auspiciousness.includes('نحس');
            setIsNahs(isCurrentlyNahs);
            setCurrentPlanet(planet);

            // Send notification on change
            if (notifyPlanetaryHour && planet.name !== prevHourRef.current) {
                const message = `ساعت ${planet.persian} آغاز شد. ${planet.recommendation.split('،')[0]}.`;
                addToast(message, 'info', planet.icon);
                prevHourRef.current = planet.name;
            }
        } else {
          // Default to Saad if hour is not available
          setIsNahs(false);
          setCurrentPlanet(null);
        }
    }, [currentHour, notifyPlanetaryHour, addToast, setIsNahs, setCurrentPlanet]);

    // Qamar dar Aghrab
    const prevQamarStatusRef = useRef<boolean>(false);
    useEffect(() => {
        const checkQamar = () => {
            const nowTime = new Date().getTime();
            const events = [...qamarDarAghrabData.constellation, ...qamarDarAghrabData.sign];
            const isQamar = events.some(event => {
                const startTime = new Date(event.start).getTime();
                const endTime = new Date(event.end).getTime();
                return nowTime >= startTime && nowTime <= endTime;
            });

            if (notifyMoonEvents && isQamar && !prevQamarStatusRef.current) {
                addToast('قمر در عقرب آغاز شد. از انجام کارهای مهم بپرهیزید.', 'warning', '🦂');
            }
            prevQamarStatusRef.current = isQamar;
        };

        const interval = setInterval(checkQamar, 60000); // check every minute
        checkQamar(); // initial check
        return () => clearInterval(interval);
    }, [notifyMoonEvents, addToast]);

    return null; // This component does not render anything
};

export default NotificationManager;
