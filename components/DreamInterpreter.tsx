
import React, { useState, useCallback, useContext } from 'react';
import { generateDreamInterpretation } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';
import FormattedReading from './common/FormattedReading';
import ResultActions from './common/ResultActions';
import FormulaExplanation from './common/FormulaExplanation';
import { useAuth } from '../contexts/AuthContext';
import BlurPreview from './common/BlurPreview';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';

const DreamInterpreter: React.FC = () => {
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPremium } = useAuth();
  const libraryContext = useContext(CosmicLibraryContext);

  const handleGenerate = useCallback(async () => {
    if (!dream.trim()) {
      setError('لطفاً رویای خود را برای تعبیر وارد کنید.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setInterpretation('');
    
    try {
        const result = await generateDreamInterpretation(dream);
        setInterpretation(result);
        libraryContext?.unlockChapter('horoscopy'); // Unlock related chapter
    } catch (e: any) {
        setError(e.message || "خطا در تولید تحلیل.");
    } finally {
        setIsLoading(false);
    }
  }, [dream, libraryContext]);

  const handleNewInterpretation = () => {
    setInterpretation('');
    setDream('');
    setError(null);
  };

  return (
    <Card>
      <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide text-center">{"تعبیرگر رؤیا"}</h4>
      <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4 text-center">
        {"رؤیاهای شما پنجره‌ای به سوی ناخودآگاه شما هستند. رویای خود را با جزئیات توصیف کنید تا هوش مصنوعی تحلیلی چندوجهی بر اساس نمادشناسی کهن و روانشناسی مدرن ارائه دهد."}
      </p>
      
      {!interpretation && !isLoading ? (
        <div className="mt-8 max-w-2xl mx-auto space-y-4 animate-fade-in">
          <textarea 
            value={dream} 
            onChange={(e) => setDream(e.target.value)} 
            placeholder={"رویای خود را با جزئیات توصیف کنید..."}
            rows={6}
            className="w-full bg-slate-800/50 border-slate-600 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 text-lg font-tanha"
          />
          {error && <p className="text-red-400 text-center font-tanha">{error}</p>}
          <button 
            onClick={handleGenerate} 
            disabled={isLoading || !dream} 
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1"
          >
            {isLoading ? <Spinner small /> : "تعبیر کن"}
          </button>
          <FormulaExplanation title={"روش تعبیر"}>
            <p>{"این تعبیرگر از یک رویکرد چندلایه برای تحلیل رؤیا استفاده می‌کند:"}</p>
            <ul>
                <li dangerouslySetInnerHTML={{ __html: "<strong>نمادشناسی سنتی:</strong> تحلیل نمادها بر اساس منابعی چون تعبیر خواب ابن سیرین." }}/>
                <li dangerouslySetInnerHTML={{ __html: "<strong>روانشناسی یونگ:</strong> بررسی کهن‌الگوها و پیام‌های ناخودآگاه جمعی." }}/>
                <li dangerouslySetInnerHTML={{ __html: "<strong>رویکرد مدرن:</strong> ارتباط دادن رؤیا به استرس‌ها و خواسته‌های زندگی روزمره." }}/>
            </ul>
            <p>{"هدف ارائه یک دیدگاه جامع است، نه یک پیش‌گویی قطعی."}</p>
          </FormulaExplanation>
        </div>
      ) : null}

      {interpretation && (
        <div className="mt-8 animate-fade-in">
          <BlurPreview isLocked={!isPremium}>
            <div className="bg-black/40 rounded-lg p-6 min-h-[300px] flex flex-col border border-slate-800 printable-content">
                <div className="flex-grow">
                <FormattedReading text={interpretation} />
                </div>
                <ResultActions textToCopy={interpretation} />
            </div>
          </BlurPreview>
          <div className="text-center mt-6">
            <button onClick={handleNewInterpretation} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">{"تعبیر رؤیای جدید"}</button>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-full mt-8">
          <Spinner />
          <p className="mt-4 text-gray-300 font-tanha">{"در حال مکاشفه در دنیای رؤیا..."}</p>
        </div>
      )}
    </Card>
  );
};

export default DreamInterpreter;
