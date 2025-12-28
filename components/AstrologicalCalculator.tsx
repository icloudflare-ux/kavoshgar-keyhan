
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { generateAstrologicalReading } from '../services/geminiService';
import { calculateAbjad } from '../utils/abjad';
import { useZodiacRulers } from '../data/rabAlTalehData';
import Card from './common/Card';
import StarrySpinner from './common/StarrySpinner';
import AbjadTable from './AbjadTable';
import FormattedReading from './common/FormattedReading';
import ResultActions from './common/ResultActions';
import { Profile, ShareData, ZodiacSignName } from '../types';
import FormulaExplanation from './common/FormulaExplanation';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';
import TazhibBorder from './common/TazhibBorder';
import { useMutation } from '@tanstack/react-query';
import { useZodiacData } from '../data/zodiacData';
import { supabase } from '../lib/supabaseClient';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import ZodiacChart from './ZodiacChart';
import { useAstrologyEngine } from '../hooks/useAstrologyEngine';
import TradingStrategy from './TradingStrategy';
import { useMarketOracle } from '../hooks/useMarketOracle';
import CosmicSlateModal from './CosmicSlateModal';
import { Download } from 'lucide-react';

interface AstrologicalCalculatorProps {
  onZodiacSignCalculate: (sign: ZodiacSignName | null) => void;
  onAbjadCalculate: (abjad: number | null) => void;
  activeProfile: Profile | null;
}

const resultVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

const AstrologicalCalculator: React.FC<AstrologicalCalculatorProps> = ({ onZodiacSignCalculate, onAbjadCalculate, activeProfile }) => {
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [reading, setReading] = useState('');
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [showAbjad, setShowAbjad] = useState(false);
  const [isSlateModalOpen, setIsSlateModalOpen] = useState(false);
  const libraryContext = useContext(CosmicLibraryContext);
  const zodiacRulers = useZodiacRulers();
  const zodiacFullData = useZodiacData();

  const [submittedChartInputs, setSubmittedChartInputs] = useState<{ jalaliDate: string | null; jalaliTime: string | null; city: string | null; } | null>(null);
  const { zodiacData, isLoading: isChartLoading, error: chartError } = useAstrologyEngine(submittedChartInputs);
  const marketScore = useMarketOracle(zodiacData);

  const { mutate, isPending: isMutationLoading, error: mutationError } = useMutation({
    mutationFn: async (params: { name: string; motherName: string; rabTale: number; birthDate?: string; birthTime?: string, profileId: string }) => {
      const analysis = await generateAstrologicalReading(params.name, params.motherName, params.rabTale, params.birthDate, params.birthTime);
      
      const { data: currentProfile, error: fetchError } = await supabase.from('profiles').select('ai_analysis_cache').eq('id', params.profileId).single();
      if(fetchError) console.error("Could not fetch current cache to update", fetchError);
      
      const newCache = {
          ...(currentProfile?.ai_analysis_cache || {}),
          rab_al_taleh: { analysis, timestamp: new Date().toISOString() }
      };

      const { error: updateError } = await supabase.from('profiles').update({ ai_analysis_cache: newCache }).eq('id', params.profileId);
      if(updateError) console.error("Failed to update analysis cache", updateError);
      
      return analysis;
    },
    onSuccess: (data, variables) => {
        setReading(data);
        libraryContext?.unlockChapter('horoscopy');
        const signInfo = zodiacRulers.find(zr => zr.id === variables.rabTale);
        if (signInfo) {
            setShareData({
                type: 'rab-al-taleh',
                name: variables.name,
                sign: signInfo.sign,
                ruler: signInfo.ruler,
                quote: data.split('\n')[0],
            });
        }
    }
  });
  
  const [isCheckingCache, setIsCheckingCache] = useState(false);
  const isLoading = isMutationLoading || isCheckingCache || isChartLoading;
  const error = mutationError || chartError;

  useEffect(() => {
    setShareData(null);
    onZodiacSignCalculate(null);
    onAbjadCalculate(null);
    setReading('');
    setSubmittedChartInputs(null);
    
    if (activeProfile) {
      setName(activeProfile.name);
      setMotherName(activeProfile.motherName);
    } else {
      setName('');
      setMotherName('');
    }
  }, [activeProfile, onZodiacSignCalculate, onAbjadCalculate]);

  const resetAnalysisState = useCallback(() => {
    setReading('');
    setShareData(null);
    onZodiacSignCalculate(null);
    onAbjadCalculate(null);
    setSubmittedChartInputs(null);
  }, [onAbjadCalculate, onZodiacSignCalculate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (reading || submittedChartInputs) {
      resetAnalysisState();
    }
  };

  const handleMotherNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMotherName(e.target.value);
    if (reading || submittedChartInputs) {
      resetAnalysisState();
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!name || !motherName || !activeProfile) return;
    
    resetAnalysisState();
    setIsCheckingCache(true);

    if (activeProfile.birthDate && activeProfile.birthTime && activeProfile.birthCity) {
        setSubmittedChartInputs({
            jalaliDate: activeProfile.birthDate,
            jalaliTime: activeProfile.birthTime,
            city: activeProfile.birthCity,
        });
    }
    
    const { data: profileData, error: fetchError } = await supabase.from('profiles').select('ai_analysis_cache').eq('id', activeProfile.id).single();
    if (fetchError) console.error("Error fetching cache", fetchError);

    const cachedData = profileData?.ai_analysis_cache?.rab_al_taleh;
    if (cachedData) {
        const { analysis, timestamp } = cachedData;
        const cacheDate = new Date(timestamp);
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        
        const isDataFresh = name === activeProfile.name && motherName === activeProfile.motherName;

        if (analysis && isDataFresh && (now.getTime() - cacheDate.getTime() < oneDay)) {
            setReading(analysis);
            const totalAbjad = calculateAbjad(name) + calculateAbjad(motherName);
            const rabTale = totalAbjad > 0 ? ((totalAbjad - 1) % 12) + 1 : 12;
            const signInfo = zodiacRulers.find(zr => zr.id === rabTale);
            if (signInfo) {
                setShareData({ type: 'rab-al-taleh', name, sign: signInfo.sign, ruler: signInfo.ruler, quote: analysis.split('\n')[0] });
            }
            onAbjadCalculate(totalAbjad);
            if(signInfo) {
                const fullSignInfo = zodiacFullData.find(z => z.traditional === signInfo.sign);
                if(fullSignInfo) onZodiacSignCalculate(fullSignInfo.modern as ZodiacSignName);
            }
            setIsCheckingCache(false);
            return;
        }
    }
    
    setIsCheckingCache(false);
    const nameAbjad = calculateAbjad(name);
    const motherNameAbjad = calculateAbjad(motherName);
    const totalAbjad = nameAbjad + motherNameAbjad;
    const rabTale = totalAbjad > 0 ? ((totalAbjad - 1) % 12) + 1 : 12;

    onAbjadCalculate(totalAbjad);

    const signInfo = zodiacRulers.find(zr => zr.id === rabTale);
    if (signInfo) {
      const fullSignInfo = zodiacFullData.find(z => z.traditional === signInfo.sign);
      if (fullSignInfo) {
          onZodiacSignCalculate(fullSignInfo.modern as ZodiacSignName);
      } else {
          onZodiacSignCalculate(null);
      }
    }
    
    mutate({ name, motherName, rabTale, birthDate: activeProfile?.birthDate, birthTime: activeProfile?.birthTime, profileId: activeProfile.id });

  }, [name, motherName, onZodiacSignCalculate, onAbjadCalculate, activeProfile, zodiacRulers, mutate, zodiacFullData, resetAnalysisState]);

  const rawDesc = "با این ابزار می‌توانید «رب‌الطالع» یا همان برج طالع باطنی خود را بر اساس روش شیخ بهایی محاسبه کنید. این روش، برخلاف طالع‌بینی رایج که بر اساس ماه تولد است، از <1>حروف ابجد</1> نام شما و نام مادرتان استفاده می‌کند. این روش عمیق‌تر به <2>ذات</2> و <3>سرشت</3> شما می‌پردازد.";
  const descParts = rawDesc.split(/<(\d+)>([^<]+)<\/\1>/g);

  return (
    <>
    <Card>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide">{"محاسبه رب‌الطالع"}</h4>
          <p className="font-tanha text-gray-300 leading-relaxed">
            {descParts.map((part, index) => {
              if (index % 3 === 2) {
                return <strong key={index} className="text-indigo-300">{part}</strong>;
              } else if (index % 3 === 0) {
                return part;
              }
              return null;
            })}
          </p>
          <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-indigo-500">
            <p className="font-tanha text-indigo-200 text-lg" dangerouslySetInnerHTML={{ __html: "طالع شما بر اساس <strong>نام و نام مادر</strong> محاسبه می‌شود که یکی از روش‌های دقیق در علوم باستانی است." }} />
          </div>
          
          <div className="space-y-4">
            <input type="text" value={name} onChange={handleNameChange} placeholder={"نام شما"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500" />
            <input type="text" value={motherName} onChange={handleMotherNameChange} placeholder={"نام مادر"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500" />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isLoading || !name || !motherName}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-1"
          >
            {isLoading && <StarrySpinner small />}
            <span className="mx-2">{"دریافت تحلیل طالع"}</span>
          </button>
        </div>
        <div className="bg-black/20 rounded-lg min-h-[300px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
                {isLoading ? (
                     <motion.div key="loading" variants={resultVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center h-full">
                        <StarrySpinner />
                        <p className="mt-4 text-gray-300 font-tanha">{"در حال مکاشفه در الواح کیهانی..."}</p>
                     </motion.div>
                ) : error ? (
                    <motion.div key="error" variants={resultVariants} initial="initial" animate="animate" exit="exit" className="p-8 text-center text-red-400">{(error as Error).message}</motion.div>
                ) : (reading || zodiacData) ? (
                  <motion.div key="results" className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {zodiacData && (
                        <>
                            <div id="zodiac-chart">
                                <ZodiacChart zodiacData={zodiacData} score={marketScore} />
                            </div>
                            {marketScore !== null && (
                                <div id="trading-oracle">
                                    <TradingStrategy score={marketScore} />
                                </div>
                            )}
                            <div id="export-slate" className="text-center mt-8">
                                <button
                                    onClick={() => setIsSlateModalOpen(true)}
                                    className="gold-glow-button bg-slate-800/60 backdrop-blur-md border border-amber-400/50 rounded-xl px-6 py-3 flex items-center gap-3 mx-auto"
                                >
                                    <div className="content flex items-center gap-3">
                                        <Download className="w-6 h-6 text-amber-300" />
                                        <span className="font-lalezar text-xl tracking-wider text-amber-200">{"دریافت لوح کیهانی"}</span>
                                    </div>
                                </button>
                            </div>
                        </>
                    )}
                    {reading && (
                      <div id="text-analysis" className={zodiacData ? "mt-8" : ""}>
                        <TazhibBorder>
                          <div className="p-8 md:p-12 printable-content">
                            <div className="flex-grow min-h-[250px]">
                              <FormattedReading text={reading} />
                            </div>
                            {shareData && <ResultActions textToCopy={reading} shareData={shareData} />}
                          </div>
                        </TazhibBorder>
                      </div>
                    )}
                  </motion.div>
                ) : (
                    <motion.p key="placeholder" variants={resultVariants} initial="initial" animate="animate" exit="exit" className="text-gray-400 text-center font-tanha text-lg">{"تحلیل طالع و چارت شما در اینجا نمایش داده خواهد شد."}</motion.p>
                )}
            </AnimatePresence>
        </div>
      </div>

      <FormulaExplanation>
          <ol>
            <li dangerouslySetInnerHTML={{ __html: 'مجموع <strong class="text-indigo-300">ابجد کبیر</strong> نام شما و نام مادرتان محاسبه می‌شود.' }}></li>
            <li dangerouslySetInnerHTML={{ __html: 'عدد حاصل بر <strong class="text-indigo-300">۱۲</strong> (تعداد برج‌های فلکی) تقسیم می‌شود.' }}></li>
            <li dangerouslySetInnerHTML={{ __html: 'باقیمانده این تقسیم، <strong class="text-indigo-300">برج طالع</strong> شما را مشخص می‌کند (اگر باقیمانده صفر باشد، برج ۱۲ در نظر گرفته می‌شود).' }}></li>
            <li dangerouslySetInnerHTML={{ __html: 'تحلیل بر اساس این برج و <strong class="text-indigo-300">کوکب حاکم</strong> آن ارائه می‌شود.' }}></li>
          </ol>
      </FormulaExplanation>

      <div className="mt-8 border-t border-slate-800/50 pt-6">
        <div className="text-center">
            <button 
                onClick={() => setShowAbjad(!showAbjad)}
                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 text-lg"
            >
                {showAbjad ? "پنهان کردن جدول ابجد" : "نمایش جدول ابجد کبیر"}
            </button>
        </div>
        {showAbjad && <AbjadTable />}
      </div>
    </Card>
    <CosmicSlateModal
        isOpen={isSlateModalOpen}
        onClose={() => setIsSlateModalOpen(false)}
        zodiacData={zodiacData}
        score={marketScore}
        reading={reading}
        profileName={activeProfile?.name || ''}
    />
    </>
  );
};

export default AstrologicalCalculator;
