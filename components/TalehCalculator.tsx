

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { calculateAbjad } from '../utils/abjad';
import { useTalehData } from '../data/talehSaadNahsData';
import Card from './common/Card';
import Spinner from './common/Spinner';
import ResultActions from './common/ResultActions';
import { Profile } from '../types';
import FormulaExplanation from './common/FormulaExplanation';
import { parseFlexibleDate } from '../utils/dateConverter';

type Quality = 'saad' | 'nahs' | 'semi-saad' | 'semi-nahs' | 'neutral' | 'swing';

interface Result {
  talehAsmi: ReturnType<typeof useTalehData>['talehAsmiData'][0];
  dayOfBirth: ReturnType<typeof useTalehData>['dayOfBirthData'][0];
  adadRuhi: ReturnType<typeof useTalehData>['adadRuhiData'][0];
  summary: {
    text: string;
    quality: Quality;
  };
}

const ResultCard: React.FC<{ title: string; quality: Quality; children: React.ReactNode }> = ({ title, quality, children }) => {
    const qualityMap: { [key in Quality]: { text: string; color: string } } = {
        saad: { text: 'سعد', color: 'border-green-500 text-green-400' },
        'semi-saad': { text: 'نیمه سعد', color: 'border-green-500/70 text-green-400/80' },
        nahs: { text: 'نحس', color: 'border-red-500 text-red-400' },
        'semi-nahs': { text: 'نیمه نحس', color: 'border-red-500/70 text-red-400/80' },
        neutral: { text: 'خنثی', color: 'border-yellow-500 text-yellow-400' },
        swing: { text: 'متغیر', color: 'border-cyan-500 text-cyan-400' },
    };
    const { text, color } = qualityMap[quality];

    return (
        <div className={`bg-slate-800/50 p-6 rounded-lg border-t-4 ${color}`}>
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-2xl font-lalezar text-white">{title}</h4>
                <span className={`px-3 py-1 text-sm font-bold rounded-full bg-black/30 ${color}`}>{text}</span>
            </div>
            <div className="font-tanha text-gray-300 leading-relaxed space-y-2">{children}</div>
        </div>
    );
};

const ConversionMethods = () => {
    return (
    <div className="mt-12 pt-8 border-t border-slate-700/50">
        <h3 className="text-3xl font-lalezar text-center mb-6 text-indigo-300">{"روش‌های تبدیل نحس به سعد"}</h3>
        <div className="grid md:grid-cols-3 gap-6 font-tanha">
            <div className="bg-slate-800/40 p-5 rounded-lg">
                <h4 className="font-lalezar text-xl text-cyan-400 mb-2">{"صدقه و انفاق"}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li>{"دفع بلا"}</li>
                    <li>{"ایجاد تعادل کارمایی"}</li>
                    <li>{"نیت خالصانه"}</li>
                </ul>
            </div>
            <div className="bg-slate-800/40 p-5 rounded-lg">
                <h4 className="font-lalezar text-xl text-amber-400 mb-2">{"هماهنگی با طبیعت کواکب"}</h4>
                <p className="text-gray-300">{"به جای مقابله با انرژی نحس، آن را در مسیر سازنده به کار بگیرید (مثلا انرژی مریخ در ورزش)."}</p>
            </div>
            <div className="bg-slate-800/40 p-5 rounded-lg">
                <h4 className="font-lalezar text-xl text-fuchsia-400 mb-2">{"دعا و اذکار"}</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                    <li><strong>{"یا لطیف"}:</strong> {"برای عبور از سختی‌ها"}</li>
                    <li><strong>{"یا فتاح"}:</strong> {"برای گشایش در کارها"}</li>
                    <li><strong>{"یا نور"}:</strong> {"برای رهایی از سردرگمی"}</li>
                </ul>
            </div>
        </div>
    </div>
)};

interface TalehCalculatorProps {
    activeProfile: Profile | null;
}

const reduceToSingleDigit = (num: number): number => {
    let currentNum = num;
    while (currentNum > 9) {
        currentNum = String(currentNum)
            .split('')
            .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    return currentNum === 0 && num > 0 ? 9 : currentNum;
};

const TalehCalculator: React.FC<TalehCalculatorProps> = ({ activeProfile }) => {
    const { talehAsmiData, dayOfBirthData, adadRuhiData } = useTalehData();
    const [inputs, setInputs] = useState({ name: '', motherName: '', birthDayOfWeek: '', birthDay: '', birthMonth: '' });
    const [result, setResult] = useState<Result | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (activeProfile) {
            const parsedDate = parseFlexibleDate(activeProfile.birthDate);
            setInputs({
                name: activeProfile.name,
                motherName: activeProfile.motherName,
                birthDay: parsedDate ? parsedDate.day : '',
                birthMonth: parsedDate ? parsedDate.month : '',
                birthDayOfWeek: activeProfile.birthDayOfWeek || '',
            });
        } else {
            setInputs({ name: '', motherName: '', birthDayOfWeek: '', birthDay: '', birthMonth: '' });
        }
    }, [activeProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCalculate = useCallback(() => {
        const { name, motherName, birthDayOfWeek, birthDay, birthMonth } = inputs;
        if (!name || !motherName || birthDayOfWeek === '' || !birthDay || !birthMonth) {
            setError("لطفاً تمام فیلدها را پر کنید.");
            return;
        }
        const day = parseInt(birthDay, 10);
        const month = parseInt(birthMonth, 10);
        if (isNaN(day) || isNaN(month) || day < 1 || day > 31 || month < 1 || month > 12) {
            setError("لطفا روز و ماه تولد را به درستی وارد کنید.");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        setTimeout(() => { // Simulate calculation
            // Taleh Asmi calculation
            const totalAbjad = calculateAbjad(name) + calculateAbjad(motherName);
            const asmiNumber = reduceToSingleDigit(totalAbjad);
            const talehAsmiResult = talehAsmiData.find(d => d.number === asmiNumber)!;

            // Day of birth calculation
            const dayOfWeekIndex = parseInt(birthDayOfWeek, 10);
            const dayOfBirthResult = dayOfBirthData[dayOfWeekIndex];

            // Adad Ruhi calculation
            const ruhiNumber = reduceToSingleDigit(day + month);
            const adadRuhiResult = adadRuhiData.find(d => d.number === ruhiNumber)!;

            // Summary calculation
            const qualities: Quality[] = [talehAsmiResult.quality, dayOfBirthResult.quality, adadRuhiResult.quality];
            const saadCount = qualities.filter(q => q === 'saad' || q === 'semi-saad').length;
            const nahsCount = qualities.filter(q => q === 'nahs' || q === 'semi-nahs').length;
            
            let summary: { text: string; quality: Quality };
            if (saadCount >= 2) {
                summary = { text: "طالع شما عمدتاً سعد است. از فرصت‌ها به خوبی استفاده کنید.", quality: 'saad' };
            } else if (nahsCount >= 2) {
                summary = { text: "طالع شما با چالش‌هایی همراه است. صبر و آگاهی کلید موفقیت شماست.", quality: 'nahs' };
            } else {
                summary = { text: "طالع شما ترکیبی و متعادل است. انعطاف‌پذیری نقطه قوت شماست.", quality: 'neutral' };
            }

            setResult({
                talehAsmi: talehAsmiResult,
                dayOfBirth: dayOfBirthResult,
                adadRuhi: adadRuhiResult,
                summary,
            });

            setIsLoading(false);
        }, 500);

    }, [inputs, talehAsmiData, dayOfBirthData, adadRuhiData]);
    
    const fullTextForCopy = useMemo(() => {
        if (!result) return '';
        return `
تحلیل سعد و نحس طالع برای ${inputs.name}
===================================
خلاصه: ${result.summary.text}
- طالع اسمی (عدد ${result.talehAsmi.number}): ${result.talehAsmi.description}
- روز تولد (${result.dayOfBirth.day}): ${result.dayOfBirth.description}
- عدد روحی (عدد ${result.adadRuhi.number}): ${result.adadRuhi.description}
        `.trim();
    }, [result, inputs.name]);

    return (
        <Card>
            <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide text-center">{"سعد و نحس طالع"}</h4>
            <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4 text-center">{"با وارد کردن اطلاعات خود، کیفیت ذاتی طالع‌تان را از سه منظر مختلف (اسمی، روز تولد، و روحی) تحلیل کنید."}</p>

            {!result && !isLoading ? (
                <div className="mt-8 max-w-2xl mx-auto space-y-4 animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <input type="text" name="name" value={inputs.name} onChange={handleInputChange} placeholder={"نام شما"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3" />
                        <input type="text" name="motherName" value={inputs.motherName} onChange={handleInputChange} placeholder={"نام مادر"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <input type="number" name="birthDay" value={inputs.birthDay} onChange={handleInputChange} placeholder={"روز تولد"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3" min="1" max="31" />
                        <input type="number" name="birthMonth" value={inputs.birthMonth} onChange={handleInputChange} placeholder={"ماه تولد (عدد)"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3" min="1" max="12" />
                        <select name="birthDayOfWeek" value={inputs.birthDayOfWeek} onChange={handleInputChange} className="w-full bg-slate-800/50 border-slate-600 rounded p-3">
                            <option value="">{"روز هفته"}</option>
                            {dayOfBirthData.map((day, index) => <option key={day.key} value={index}>{day.day}</option>)}
                        </select>
                    </div>
                    {error && <p className="text-red-400 text-center font-tanha">{error}</p>}
                     <button onClick={handleCalculate} disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1">
                        {isLoading ? <Spinner small /> : "دریافت تحلیل"}
                    </button>
                    <FormulaExplanation title={"روش تحلیل"}>
                        <ul>
                            <li><strong>{"طالع اسمی"}:</strong> {"بر اساس عدد ریشه حاصل از مجموع ابجد نام شما و نام مادرتان."}</li>
                            <li><strong>{"روز تولد"}:</strong> {"بر اساس کوکب حاکم بر روز هفته تولد شما."}</li>
                            <li><strong>{"عدد روحی"}:</strong> {"بر اساس عدد ریشه حاصل از جمع روز و ماه تولدتان."}</li>
                        </ul>
                    </FormulaExplanation>
                </div>
            ) : null}

            {isLoading && (
                <div className="flex flex-col items-center justify-center h-full mt-8">
                    <Spinner />
                    <p className="mt-4 text-gray-300 font-tanha">{"در حال تحلیل طالع شما..."}</p>
                </div>
            )}
            
            {result && (
                 <div className="mt-8 animate-fade-in printable-content">
                    <div className="space-y-6">
                        <ResultCard title={"خلاصه کلی"} quality={result.summary.quality}>
                            <p className="text-xl">{result.summary.text}</p>
                        </ResultCard>
                        <ResultCard title={"طالع اسمی"} quality={result.talehAsmi.quality}>
                            <p><strong>{result.talehAsmi.title}:</strong> {result.talehAsmi.description}</p>
                        </ResultCard>
                        <ResultCard title={"روز تولد"} quality={result.dayOfBirth.quality}>
                             <p><strong>{result.dayOfBirth.day} ({result.dayOfBirth.planet}):</strong> {result.dayOfBirth.description}</p>
                        </ResultCard>
                        <ResultCard title={"عدد روحی"} quality={result.adadRuhi.quality}>
                            <p><strong>{result.adadRuhi.title}:</strong> {result.adadRuhi.description}</p>
                        </ResultCard>
                    </div>
                    <ResultActions textToCopy={fullTextForCopy} />
                    <ConversionMethods />
                    <div className="text-center mt-10">
                         <button onClick={() => setResult(null)} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">{"تحلیل جدید"}</button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default TalehCalculator;