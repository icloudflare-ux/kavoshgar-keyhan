
import React, { useState, useCallback, useEffect } from 'react';
import { generateQarinName } from '../services/geminiService';
import { calculateAbjad, abjadMap } from '../utils/abjad';
import { QarinResult, Profile } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import QarinResultGuide from './QarinResultGuide';
import FormulaExplanation from './common/FormulaExplanation';
import { parseFlexibleDate } from '../utils/dateConverter';

interface QarinCalculatorProps {
    activeProfile: Profile | null;
}

const rootLetterMap: { [key: number]: string } = {
    1: 'ق', 2: 'ن', 3: 'ح', 4: 'ع', 5: 'س', 6: 'و', 7: 'ل', 8: 'غ', 9: 'ن',
};

const QarinCalculator: React.FC<QarinCalculatorProps> = ({ activeProfile }) => {
    const [name, setName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [birthDay, setBirthDay] = useState<string>('');
    const [result, setResult] = useState<QarinResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<'form' | 'result'>('form');

     useEffect(() => {
        if (activeProfile) {
            setName(activeProfile.name);
            setMotherName(activeProfile.motherName);
            const parsedDate = parseFlexibleDate(activeProfile.birthDate);
            const day = parsedDate ? parsedDate.day : '';
            setBirthDay(day || '');
        } else {
            setName('');
            setMotherName('');
            setBirthDay('');
        }
    }, [activeProfile]);

    const handleGenerate = useCallback(async () => {
        const day = parseInt(birthDay, 10);
        if (!name || !motherName || !birthDay || isNaN(day) || day < 1 || day > 31) {
            setError('لطفاً تمام فیلدها را به درستی پر کنید.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const nameAbjad = calculateAbjad(name);
            const motherAbjad = calculateAbjad(motherName);
            const totalSum = nameAbjad + motherAbjad + day;
            let rootNumber = totalSum;
            while (rootNumber > 9) {
                rootNumber = String(rootNumber).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
            }
            if (rootNumber === 0 && totalSum > 0) rootNumber = 9;

            const startLetter = rootLetterMap[rootNumber];
            if (!startLetter) throw new Error('خطا در محاسبه حرف اول قرین.');

            if (name.length < 2) throw new Error('نام باید حداقل دو حرف داشته باشد.');
            const middleLetter = name[1];
            
            let finalLetter = '';
            for (let i = motherName.length - 1; i >= 0; i--) {
                const char = motherName[i];
                const val = abjadMap[char];
                if (val !== undefined && val < 10) {
                    finalLetter = char;
                    break;
                }
            }

            if (!finalLetter && motherName.length > 0) {
                let minAbjad = Infinity;
                let minAbjadChar = '';
                
                for (const char of motherName) {
                    const val = abjadMap[char];
                    if (val !== undefined && val < minAbjad) {
                        minAbjad = val;
                        minAbjadChar = char;
                    }
                }
                finalLetter = minAbjadChar;
            }

            if (!finalLetter) {
                throw new Error(`خطا در استخراج حرف آخر از نام مادر (${motherName}).`);
            }

            const letters = [startLetter, middleLetter, finalLetter];
            const aiResult = await generateQarinName(letters);

            setResult({
                name, motherName, birthDay: day, totalAbjad: totalSum, rootNumber,
                startLetter, middleLetter, finalLetter,
                qarinName: aiResult.name, explanation: aiResult.explanation,
            });
            setView('result');

        } catch (e: any) {
            const message = e.message || 'خطای ناشناخته رخ داد.';
            // Check if the message is a key that needs translation
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [name, motherName, birthDay]);

    const handleBackToForm = () => {
        setView('form');
        setResult(null);
        setError(null);
    };
    
    if (view === 'result' && result) {
        return (
            <Card>
                <QarinResultGuide result={result} onBack={handleBackToForm} />
            </Card>
        );
    }

    return (
        <Card>
            <div className="space-y-6">
                <div className="text-center">
                    <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide">{"محاسبه قرین"}</h4>
                    <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4" dangerouslySetInnerHTML={{__html: "قرین، همزاد یا سایه معنوی هر فرد است که در علوم باطنی، ارتباط با آن کلید شناخت عمیق‌تر خود و گشودن توانایی‌های پنهان محسوب می‌شود. این ابزار نام قرین شما را بر اساس محاسبات پیچیده ابجدی محاسبه می‌کند."}} />
                </div>
                
                <div className="max-w-xl mx-auto space-y-4">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={"نام شما"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500" />
                    <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder={"نام مادر"} className="w-full bg-slate-800/50 border-slate-600 rounded p-3 focus:ring-2 focus:ring-indigo-500" />
                    <div>
                        <label htmlFor="qarin-day" className="sr-only">{"روز تولد (فقط عدد روز)"}</label>
                        <input type="number" id="qarin-day" value={birthDay} onChange={(e) => setBirthDay(e.target.value)} placeholder={"روز تولد (فقط عدد روز، مثال: ۲۴)"} min="1" max="31" className="w-full bg-slate-800/50 border-slate-600 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 transition"/>
                    </div>
                
                    <button onClick={handleGenerate} disabled={isLoading || !name || !motherName || !birthDay} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1">
                        {isLoading ? <Spinner small /> : "محاسبه نام قرین"}
                    </button>
                    {error && <p className="text-red-400 text-center font-tanha">{error}</p>}
                </div>

                 <FormulaExplanation>
                    <p>{"برای محاسبه نام قرین، سه حرف اصلی استخراج می‌شود:"}</p>
                    <ol>
                        <li dangerouslySetInnerHTML={{ __html: "<strong>حرف اول (از عدد ریشه):</strong> مجموع ابجد نام، نام مادر و روز تولد محاسبه و به یک عدد ریشه (۱-۹) تبدیل می‌شود. هر عدد ریشه، یک حرف خاص را نشان می‌دهد." }} />
                        <li dangerouslySetInnerHTML={{ __html: "<strong>حرف دوم (از نام شخص):</strong> حرف دوم نام کوچک فرد به عنوان حرف میانی در نظر گرفته می‌شود." }} />
                        <li dangerouslySetInnerHTML={{ __html: "<strong>حرف سوم (از نام مادر):</strong> اولین حرف از انتهای نام مادر که ابجد آن کمتر از ۱۰ باشد، به عنوان حرف آخر انتخاب می‌شود." }} />
                    </ol>
                    <p>{"سپس این سه حرف به هوش مصنوعی داده می‌شود تا یک نام معنادار و موزون با اعراب کامل بسازد."}</p>
                </FormulaExplanation>
            </div>
        </Card>
    );
};

export default QarinCalculator;