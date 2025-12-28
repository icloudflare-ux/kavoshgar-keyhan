
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { generateRabAlTalehAnalysis } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';
import FormattedReading from './common/FormattedReading';
import ResultActions from './common/ResultActions';
import { Profile } from '../types';
import FormulaExplanation from './common/FormulaExplanation';
import { calculateAbjad } from '../utils/abjad';
import { useZodiacRulers } from '../data/rabAlTalehData';
import { useZodiacData } from '../data/zodiacData';
import { useAuth } from '../contexts/AuthContext';
import BlurPreview from './common/BlurPreview';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';

interface RabAlTalehAnalysisProps {
    activeProfile: Profile | null;
}

const RabAlTalehAnalysis: React.FC<RabAlTalehAnalysisProps> = ({ activeProfile }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const zodiacRulers = useZodiacRulers();
  const zodiacData = useZodiacData();
  const { isPremium } = useAuth();
  const libraryContext = useContext(CosmicLibraryContext);
  
  const handleGenerate = useCallback(async () => {
    if (!activeProfile) {
        setError("لطفاً ابتدا یک پروفایل را از بخش «مدیریت پروفایل» انتخاب کنید.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis('');
    
    try {
        const { name, motherName } = activeProfile;
        const totalAbjad = calculateAbjad(name) + calculateAbjad(motherName);
        const remainder = totalAbjad % 12;
        const rabTale = remainder === 0 ? 12 : remainder;

        const signInfo = zodiacRulers.find(zr => zr.id === rabTale);
        if (!signInfo) throw new Error('خطا در محاسبه طالع.');
        
        const fullSignInfo = zodiacData.find(zd => zd.traditional === signInfo.sign);
        if (!fullSignInfo) throw new Error('خطا در یافتن عنصر طالع.');

        const result = await generateRabAlTalehAnalysis(name, motherName, rabTale, signInfo.sign, fullSignInfo.element);
        setAnalysis(result);
        libraryContext?.unlockChapter('horoscopy');

    } catch (e: any) {
        setError(e.message || "خطا در تولید تحلیل.");
    } finally {
        setIsLoading(false);
    }
  }, [activeProfile, zodiacRulers, zodiacData, libraryContext]);

  return (
    <Card>
      <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide text-center">{"تحلیل طالع ابجدی"}</h4>
      <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4 text-center">
        {"تحلیلی ادبی و اسرارآمیز از طالع ابجدی (رب‌الطالع)، ویژگی‌های شخصیتی و عنصر وجودی شما بر اساس نامتان."}
      </p>
      
      <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-indigo-500 mt-6 max-w-3xl mx-auto">
        <p className="font-tanha text-indigo-200 text-lg text-center" dangerouslySetInnerHTML={{ __html: "نام شما، فرکانس روح شماست. علم حروف به رمزگشایی این فرکانس می‌پردازد." }} />
      </div>

       {!analysis && !isLoading ? (
        <div className="mt-8 max-w-xl mx-auto space-y-4 animate-fade-in">
          {!activeProfile ? (
            <p className="text-amber-400 text-center font-tanha">{"لطفاً ابتدا یک پروفایل را از بخش «مدیریت پروفایل» انتخاب کنید."}</p>
          ) : (
            <div className="text-center font-tanha text-lg text-gray-300">
                <p>{"تحلیل برای پروفایل"}: <strong className="text-white">{activeProfile.name}</strong> {"فرزند"} <strong className="text-white">{activeProfile.motherName}</strong></p>
            </div>
          )}
          {error && <p className="text-red-400 text-center font-tanha">{error}</p>}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !activeProfile}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1"
          >
            {isLoading ? <Spinner small /> : "دریافت تحلیل طالع"}
          </button>
           <FormulaExplanation title={"روش تحلیل"}>
                <p>{"این تحلیل بر اساس طالع ابجدی شما (روش شیخ بهایی) انجام می‌شود:"}</p>
                <ol>
                    <li dangerouslySetInnerHTML={{ __html: "ابتدا <strong>طالع ابجدی</strong> شما بر اساس مجموع ابجد نام شما و نام مادرتان محاسبه می‌شود." }}/>
                    <li dangerouslySetInnerHTML={{ __html: "سپس، هوش مصنوعی با استفاده از این طالع و <strong>عنصر وجودی</strong> مرتبط با آن، یک تحلیل ادبی و عمیق از شخصیت و مسیر روحی شما ارائه می‌دهد." }}/>
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
            <p className="mt-4 text-gray-300 font-tanha">{"در حال رمزگشایی از اسرار طالع شما..."}</p>
        </div>
    )}
    </Card>
  );
};

export default RabAlTalehAnalysis;
