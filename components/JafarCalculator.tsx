
import React, { useState, useCallback, useContext } from 'react';
import { generateJafarAnswer } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';
import ResultActions from './common/ResultActions';
import FormulaExplanation from './common/FormulaExplanation';
import { useAuth } from '../contexts/AuthContext';
import BlurPreview from './common/BlurPreview';
import { CosmicLibraryContext } from '../contexts/CosmicLibraryContext';

interface JafarResult {
    steps: string[];
    finalAnswer: string;
}

const JafarResultDisplay: React.FC<{ result: JafarResult, question: string }> = ({ result, question }) => {
    const fullTextToCopy = `
پرسش: ${question}
====================
مراحل:
${result.steps?.join('\n') || ''}
====================
پاسخ نهایی:
${result.finalAnswer}
    `.trim();

    return (
        <div className="mt-8 printable-content">
            <div className="bg-black/40 rounded-lg p-6 min-h-[300px] flex flex-col border border-slate-800">
                <p className="font-tanha text-gray-400 mb-4 border-b border-slate-700/50 pb-3"><strong>{"پرسش"}:</strong> {question}</p>
                <div className="flex-grow space-y-6">
                    <div>
                        <h4 className="font-lalezar text-xl text-indigo-300 mb-2">{"مراحل"}:</h4>
                        <div className="font-roboto-mono text-gray-300 space-y-2 text-sm bg-slate-900/50 p-4 rounded-md">
                            {result.steps?.map((step, index) => (
                                <p key={index} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>{step}</p>
                            )) || <p className="text-gray-500">...</p>}
                        </div>
                    </div>
                    <div className="pt-6 border-t border-slate-700/50">
                        <h4 className="font-lalezar text-xl text-indigo-300 mb-2">{"پاسخ نهایی"}:</h4>
                        <p className="text-3xl text-amber-300 leading-relaxed text-center" style={{ textShadow: '0 0 15px rgba(252, 211, 77, 0.4)' }}>
                           « {result.finalAnswer} »
                        </p>
                    </div>
                </div>
                <ResultActions textToCopy={fullTextToCopy} />
            </div>
        </div>
    );
};

const JafarCalculator: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [result, setResult] = useState<JafarResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isPremium } = useAuth();
    const libraryContext = useContext(CosmicLibraryContext);


    const handleGenerate = useCallback(async () => {
        if (!question.trim()) {
            setError('لطفاً سؤال خود را برای محاسبه وارد کنید.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await generateJafarAnswer(question);
            if (!res) throw new Error("خطا در تولید تحلیل.");
            setResult(res);
            libraryContext?.unlockChapter('horoscopy');
        } catch (e: any) {
            setError(e.message || "خطا در تولید تحلیل.");
        } finally {
            setIsLoading(false);
        }
    }, [question, libraryContext]);

    return (
        <Card>
            <div className="text-center">
                <h4 className="text-3xl font-semibold text-white font-lalezar tracking-wide">{"محاسبه‌گر جفر"}</h4>
                <p className="font-tanha text-gray-300 leading-relaxed max-w-3xl mx-auto mt-4">{"علم جفر، روشی باستانی برای استخراج پاسخ از دل حروف یک سؤال است. سؤال خود را مطرح کنید تا هوش مصنوعی با شبیه‌سازی مراحل این علم، پاسخ آن را استخراج کند."}</p>
            </div>

            {!result && !isLoading ? (
                <div className="mt-8 max-w-2xl mx-auto space-y-4 animate-fade-in">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={"سؤال خود را به صورت واضح و کامل بنویسید..."}
                        rows={5}
                        className="w-full bg-slate-800/50 border-slate-600 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 text-lg font-tanha"
                    />
                    {error && <p className="text-red-400 text-center font-tanha">{error}</p>}
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !question}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-1"
                    >
                        {isLoading ? <Spinner small /> : "دریافت پاسخ"}
                    </button>
                    <FormulaExplanation title={"روش محاسبه جفر"}>
                        <p>{"این ابزار از روش «مستحصله» در علم جفر به صورت شبیه‌سازی شده استفاده می‌کند:"}</p>
                        <ul>
                            <li dangerouslySetInnerHTML={{ __html: "<strong>مرحله اساس:</strong> حروف سؤال شما به اعداد ابجد تبدیل و محاسباتی روی آن‌ها انجام می‌شود تا یک سطر پایه (اساس) به دست آید." }} />
                            <li dangerouslySetInnerHTML={{ __html: "<strong>مرحله نظیره:</strong> از روی سطر اساس، سطرهای دیگری بر اساس قوانین نظیره حروف استخراج می‌شود." }} />
                            <li dangerouslySetInnerHTML={{ __html: "<strong>استخراج پاسخ:</strong> در نهایت، هوش مصنوعی با تحلیل سطرهای به دست آمده، یک پاسخ کوتاه، حکیمانه و مرتبط با سؤال را استخراج می‌کند." }} />
                        </ul>
                        <p>{"این یک شبیه‌سازی مدرن از یک فرآیند بسیار پیچیده و رمزآلود است."}</p>
                    </FormulaExplanation>
                </div>
            ) : null}

            {isLoading && (
                <div className="flex flex-col items-center justify-center h-full mt-8">
                    <Spinner />
                    <p className="mt-4 text-gray-300 font-tanha">{"در حال محاسبه با علم حروف..."}</p>
                </div>
            )}
            
            {result && (
                <div className="animate-fade-in">
                    <BlurPreview isLocked={!isPremium}>
                        <JafarResultDisplay result={result} question={question} />
                    </BlurPreview>
                    <div className="text-center mt-6">
                        <button onClick={() => { setResult(null); setQuestion(''); }} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">{"پرسش جدید"}</button>
                    </div>
                </div>
            )}

        </Card>
    );
};

export default JafarCalculator;
