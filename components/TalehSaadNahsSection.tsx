import React from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Import CosmicState to explicitly type the selector's state.
import { useCosmicStore, type CosmicState } from '../store/useCosmicStore';
import useStore from '../hooks/useStore';
import { motion } from 'framer-motion';

const TalehSaadNahsSection: React.FC = () => {
    const { t } = useTranslation();
    
    // Use the SSR-safe useStore hook to get state
    // FIX: Explicitly type the 'state' parameter to prevent it from being inferred as 'unknown'.
    const calculatedZodiacSign = useStore(useCosmicStore, (state: CosmicState) => state.calculatedZodiacSign);
    // FIX: Explicitly type the 'state' parameter to prevent it from being inferred as 'unknown'.
    const isNahs = useStore(useCosmicStore, (state: CosmicState) => state.isNahs);

    // Prevent rendering on server or before hydration
    if (isNahs === undefined) {
        return null; 
    }

    return (
        <motion.section 
            id="taleh-saad-nahs"
            className="p-6 bg-slate-900/50 backdrop-blur-lg rounded-2xl border border-indigo-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-bold text-indigo-300 mb-4 font-lalezar tracking-wide">
                {t('astrologySections.saad_nahs.title')}
            </h2>

            <div className="flex items-center gap-4 mb-6">
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                    isNahs ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                    {isNahs ? t('astrologySections.saad_nahs.nahs') : t('astrologySections.saad_nahs.saad')}
                </div>
                
                {calculatedZodiacSign && (
                  <span className="text-slate-300 font-tanha">
                      {"برای طالع"} <strong className="text-white">{t(`zodiacs.${calculatedZodiacSign}`)}</strong>
                  </span>
                )}
            </div>

            <p className="text-slate-300 leading-relaxed mb-4 font-tanha">
                {t('astrologySections.saad_nahs.description')}
            </p>

            {isNahs && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-sm font-tanha flex items-center gap-2">
                    <span>⚠️</span>
                    {t('astrologySections.saad_nahs.warning')}
                </div>
            )}
        </motion.section>
    );
};

export default TalehSaadNahsSection;
