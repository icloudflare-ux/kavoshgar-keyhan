import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Profile, ZodiacSignName } from '../types';
import { lilithData, getLilithBySign } from '../data/lilithData';
import Card from './common/Card';
import Spinner from './common/Spinner';
import ResultActions from './common/ResultActions';
import FormulaExplanation from './common/FormulaExplanation';
import { parseFlexibleDate } from '../utils/dateConverter';

interface LilithCalculatorProps {
  activeProfile: Profile | null;
}

// Simplified calculation for Black Moon Lilith position
// In reality, this requires complex astronomical calculations
// This is a simplified version for demonstration
const calculateLilithSign = (birthDate: Date): ZodiacSignName => {
  // This is a very simplified calculation
  // Real Lilith position requires ephemeris data
  // Here we use a simplified approximation based on birth date
  
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth();
  const day = birthDate.getDate();
  
  // Lilith has approximately 9-year cycle through the zodiac
  // This is a rough approximation
  const dayOfYear = Math.floor((Date.UTC(year, month, day) - Date.UTC(year, 0, 0)) / 86400000);
  const lilithCycle = ((year * 40.5) + (dayOfYear * 0.111)) % 360;
  const signIndex = Math.floor(lilithCycle / 30);
  
  const signs: ZodiacSignName[] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  return signs[signIndex % 12];
};

const LilithCalculator: React.FC<LilithCalculatorProps> = ({ activeProfile }) => {
  const [inputs, setInputs] = useState({ 
    name: '', 
    birthDate: '', 
    birthTime: ''
  });
  const [result, setResult] = useState<{
    sign: ZodiacSignName;
    data: ReturnType<typeof getLilithBySign>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeProfile) {
      setInputs({
        name: activeProfile.name,
        birthDate: activeProfile.birthDate,
        birthTime: activeProfile.birthTime || '',
      });
    } else {
      setInputs({ name: '', birthDate: '', birthTime: '' });
    }
  }, [activeProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCalculate = useCallback(() => {
    const { name, birthDate } = inputs;
    if (!name || !birthDate) {
      setError('لطفاً نام و تاریخ تولد را وارد کنید.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        // Parse the birth date
        const parsedDate = parseFlexibleDate(birthDate);
        if (!parsedDate) {
          setError('فرمت تاریخ نامعتبر است. لطفا تاریخ را به صورت 1370/05/24 وارد کنید.');
          setIsLoading(false);
          return;
        }

        // Convert Persian/Jalali date to Gregorian (simplified)
        // This is a rough approximation - in production, use a proper date conversion library
        const gregorianYear = parseInt(parsedDate.year) + 621;
        const date = new Date(gregorianYear, parseInt(parsedDate.month) - 1, parseInt(parsedDate.day));

        const lilithSign = calculateLilithSign(date);
        const lilithData = getLilithBySign(lilithSign);

        if (!lilithData) {
          setError('خطا در محاسبه لیلیت');
          setIsLoading(false);
          return;
        }

        setResult({
          sign: lilithSign,
          data: lilithData
        });
      } catch (err) {
        setError('خطا در محاسبه. لطفا دوباره تلاش کنید.');
      }
      setIsLoading(false);
    }, 800);
  }, [inputs]);

  const fullTextForCopy = useMemo(() => {
    if (!result || !result.data) return '';
    const data = result.data;
    return `
تحلیل لیلیت (ماه سیاه) برای ${inputs.name}
==========================================
برج: ${data.signPersian} (${data.sign})
عنصر: ${data.elementPersian}
حاکم: ${data.rulerPersian}

ذات و جوهر:
${data.essence}

سایه‌های درونی:
${data.shadowSide}

قدرت و توانایی:
${data.power}

چالش‌ها:
${data.challenge}

راه‌های بهبود:
${data.healing}

شغل و کار:
${data.career}

روابط:
${data.relationships}

معنویت:
${data.spirituality}

تأکید مثبت:
${data.affirmation}
    `.trim();
  }, [result, inputs.name]);

  return (
    <Card>
      <div className="text-center mb-8">
        <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide mb-2">
          محاسبه‌گر لیلیت (ماه سیاه)
        </h4>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-4xl">🌑</span>
          <span className="text-4xl">✨</span>
          <span className="text-4xl">🔮</span>
        </div>
        <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto">
          لیلیت یا ماه سیاه نماد سایه درونی، قدرت پنهان و خواسته‌های سرکوب‌شده ماست. 
          این نقطه در زایچه نشان می‌دهد که کجا باید با سایه خود روبرو شویم و قدرت واقعی خود را بازیابیم.
        </p>
      </div>

      {!result && !isLoading ? (
        <div className="mt-8 max-w-2xl mx-auto space-y-4 animate-fade-in">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleInputChange}
              placeholder="نام شما"
              className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-colors"
            />
            <input
              type="text"
              name="birthDate"
              value={inputs.birthDate}
              onChange={handleInputChange}
              placeholder="تاریخ تولد (1370/05/24)"
              className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>
          <input
            type="text"
            name="birthTime"
            value={inputs.birthTime}
            onChange={handleInputChange}
            placeholder="ساعت تولد (اختیاری - 14:30)"
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-colors"
          />
          {error && <p className="text-red-400 text-center font-tanha">{error}</p>}
          <button
            onClick={handleCalculate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-indigo-900 disabled:to-purple-900 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1 font-lalezar text-lg"
          >
            {isLoading ? <Spinner small /> : 'محاسبه موقعیت لیلیت'}
          </button>

          <FormulaExplanation title="درباره لیلیت">
            <div className="space-y-3 font-tanha text-gray-300">
              <p>
                <strong className="text-purple-400">لیلیت سیاه (Black Moon Lilith)</strong> نقطه‌ای خیالی در زایچه است 
                که دورترین نقطه مدار ماه از زمین را نشان می‌دهد. این نقطه در طول ۹ سال یک بار کل زودیاک را طی می‌کند.
              </p>
              <p>
                <strong className="text-indigo-400">معنا و مفهوم:</strong> لیلیت نماد سایه‌های ناآگاه، 
                قدرت زنانه خام، خواسته‌های سرکوب‌شده و جنبه‌هایی از خود که از آن می‌ترسیم یا آن را انکار می‌کنیم است.
              </p>
              <p>
                <strong className="text-cyan-400">اهمیت در زایچه:</strong> درک لیلیت به ما کمک می‌کند تا با سایه خود آشتی کنیم، 
                قدرت واقعی خود را بازیابیم و به تمامیت روانی برسیم.
              </p>
              <p className="text-amber-400">
                توجه: این محاسبه ساده‌شده است. برای تحلیل دقیق‌تر، به منجم حرفه‌ای مراجعه کنید.
              </p>
            </div>
          </FormulaExplanation>
        </div>
      ) : null}

      {isLoading && (
        <div className="flex flex-col items-center justify-center h-full mt-8 min-h-[300px]">
          <Spinner />
          <p className="mt-4 text-gray-300 font-tanha">در حال محاسبه موقعیت لیلیت شما...</p>
        </div>
      )}

      {result && result.data && (
        <div className="mt-8 animate-fade-in printable-content">
          <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-lalezar text-center text-purple-300 mb-2">
              لیلیت شما در برج {result.data.signPersian}
            </h3>
            <p className="text-center text-gray-300 font-tanha">
              عنصر: {result.data.elementPersian} | حاکم: {result.data.rulerPersian}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-lg border-t-4 border-purple-500">
              <h4 className="text-xl font-lalezar text-purple-300 mb-3">ذات و جوهر</h4>
              <p className="font-tanha text-gray-300 leading-relaxed">{result.data.essence}</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg border-t-4 border-red-500">
              <h4 className="text-xl font-lalezar text-red-300 mb-3">سایه‌های درونی</h4>
              <p className="font-tanha text-gray-300 leading-relaxed">{result.data.shadowSide}</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg border-t-4 border-green-500">
              <h4 className="text-xl font-lalezar text-green-300 mb-3">قدرت و توانایی</h4>
              <p className="font-tanha text-gray-300 leading-relaxed">{result.data.power}</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg border-t-4 border-yellow-500">
              <h4 className="text-xl font-lalezar text-yellow-300 mb-3">چالش‌های رشد</h4>
              <p className="font-tanha text-gray-300 leading-relaxed">{result.data.challenge}</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg border-t-4 border-cyan-500">
              <h4 className="text-xl font-lalezar text-cyan-300 mb-3">راه‌های بهبود و شفا</h4>
              <p className="font-tanha text-gray-300 leading-relaxed">{result.data.healing}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 p-6 rounded-lg border-l-4 border-indigo-500">
                <h4 className="text-xl font-lalezar text-indigo-300 mb-3">شغل و کار</h4>
                <p className="font-tanha text-gray-300 leading-relaxed">{result.data.career}</p>
              </div>

              <div className="bg-slate-800/50 p-6 rounded-lg border-l-4 border-pink-500">
                <h4 className="text-xl font-lalezar text-pink-300 mb-3">روابط عاطفی</h4>
                <p className="font-tanha text-gray-300 leading-relaxed">{result.data.relationships}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg border-t-4 border-amber-500">
              <h4 className="text-xl font-lalezar text-amber-300 mb-3">معنویت و روحانیت</h4>
              <p className="font-tanha text-gray-300 leading-relaxed">{result.data.spirituality}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-lg border border-purple-400/50">
              <h4 className="text-xl font-lalezar text-purple-200 mb-3 text-center">تأکید مثبت روزانه</h4>
              <p className="font-tanha text-white text-lg leading-relaxed text-center italic">
                "{result.data.affirmation}"
              </p>
            </div>
          </div>

          <ResultActions textToCopy={fullTextForCopy} />

          <div className="text-center mt-10">
            <button
              onClick={() => setResult(null)}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 font-lalezar"
            >
              محاسبه جدید
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default LilithCalculator;
