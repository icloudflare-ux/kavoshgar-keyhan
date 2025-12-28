
import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { generatePersonalDignityAnalysis } from '../services/geminiService';
import { calculateAbjad } from '../utils/abjad';
import { useZodiacRulers } from '../data/rabAlTalehData';
import Card from './common/Card';
import Spinner from './common/Spinner';
import FormattedReading from './common/FormattedReading';
import ResultActions from './common/ResultActions';
import { Profile } from '../types';
import FormulaExplanation from './common/FormulaExplanation';
import { useAuth } from '../contexts/AuthContext';
import BlurPreview from './common/BlurPreview';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';
import useUnlockOnScroll from '../hooks/useUnlockOnScroll';

interface PersonalDignitiesCalculatorProps {
    activeProfile: Profile | null;
}

const PersonalDignitiesCalculator: React.FC<PersonalDignitiesCalculatorProps> = ({ activeProfile }) => {
  const zodiacRulers = useZodiacRulers();
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPremium } = useAuth();
  const libraryContext = useContext(CosmicLibraryContext);
  const cardRef = useRef<HTMLDivElement>(null);
  useUnlockOnScroll(cardRef, 'esoteric_planets');
  
  useEffect(() => {
    if (activeProfile) {
      setName(activeProfile.name);
      setMotherName(activeProfile.motherName);
    } else {
      setName('');
      setMotherName('');
    }
    setAnalysis('');
  }, [activeProfile]);

  const handleGenerate = useCallback(async () => {
    if (!name || !motherName) {
        setError('لطفاً نام و نام مادر را وارد کنید.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    
    try {
        const totalAbjad = calculateAbjad(name) + calculateAbjad(motherName);
        const remainder = totalAbjad % 12;
        const rabTale = remainder === 0 ? 12 : remainder;

        const signInfo = zodiacRulers.find(zr => zr.id === rabTale);
        if (!signInfo) throw new Error('خطا در محاسبه طالع.');

        const result = await generatePersonalDignityAnalysis(signInfo.sign, signInfo.ruler);
        setAnalysis(result);
        libraryContext?.unlockChapter('horoscopy');
    } catch (e: any) {
        setError(e.message || "خطا در تولید تحلیل.");
    } finally {
        setIsLoading(false);
    }
  }, [name, motherName, zodiacRulers, libraryContext]);

  return (
    <div ref={cardRef}>
        <Card>
          <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide text-center">{"تحلیل شرف و وبال شخصی"}</h4>
          <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4 text-center">
            {"تحلیلی عمیق بر نقاط قوت و ضعف ذاتی شما بر اساس کوکب حاکم بر طالع‌تان. این تحلیل به شما کمک می‌کند تا بفهمید انرژی حاکم بر سرنوشت شما در چه شرایطی به اوج قدرت (شرف) و در چه شرایطی به ضعف (وبال) می‌رسد."}
          </p>
          
          <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-indigo-500 mt-6 max-w-3xl mx-auto">
            <p className="font-tanha text-indigo-200 text-lg text-center" dangerouslySetInnerHTML={{ __html: "کوکب حاکم شما، مانند یک راهنمای آسمانی، <strong>نقشه راه</strong> رشد و تعالی شما را در دست دارد." }} />
          </div>

           {!analysis && !isLoading ? (
            <div className="mt-8 max-w-xl mx-auto space-y-4 animate-fade-in">
                <div className="space-y-4">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={"نام شما"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500" />
                    <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder={"نام مادر"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500" />
                </div>
              {error && <p className="text-red-400 text-center font-tanha">{error}</p>}
              <button
                onClick={handleGenerate}
                disabled={isLoading || !name || !motherName}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1"
              >
                {isLoading ? <Spinner small /> : "دریافت تحلیل شخصی"}
              </button>
               <FormulaExplanation title={"روش تحلیل"}>
                    <p>{"این تحلیل بر اساس کوکب حاکم بر طالع ابجدی شما انجام می‌شود:"}</p>
                    <ol>
                        <li dangerouslySetInnerHTML={{ __html: "ابتدا <strong>کوکب حاکم</strong> بر طالع شما (بر اساس نام و نام مادر) مشخص می‌شود." }}/>
                        <li dangerouslySetInnerHTML={{ __html: "سپس، هوش مصنوعی با استفاده از دانش نجومی، نقاط قوت (<strong>شرف و حاکمیت</strong>) و نقاط ضعف (<strong>وبال و هبوط</strong>) آن کوکب را در چرخه‌ی بروج تحلیل کرده و راهنمایی شخصی‌سازی شده ارائه می‌دهد." }}/>
                    </ol>
                </FormulaExplanation>
            </div>
          ) : null}

           {analysis && (
            <div className="mt-8 animate-fade-in">
                <BlurPreview isLocked={!isPremium}>
                    <div className="bg-black/40 rounded-lg p-6 min-h-[300px] flex flex-col border border-slate-800 printable-content">
                        <div className="flex-grow">
                            <FormattedReading text={analysis} />
                        </div>
                        <ResultActions textToCopy={analysis} />
                    </div>
                </BlurPreview>
                <div className="text-center mt-6">
                     <button onClick={() => setAnalysis('')} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">{"تحلیل جدید"}</button>
                </div>
            </div>
        )}
         {isLoading && (
            <div className="flex flex-col items-center justify-center h-full mt-8">
                <Spinner />
                <p className="mt-4 text-gray-300 font-tanha">{"در حال تحلیل تأثیرات کوکب حاکم..."}</p>
            </div>
        )}
        </Card>
    </div>
  );
};

export default PersonalDignitiesCalculator;
