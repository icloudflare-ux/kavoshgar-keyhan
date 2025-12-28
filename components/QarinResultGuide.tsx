
import React, { useState, useMemo } from 'react';
import { QarinResult, ShareData } from '../types';
import { calculateAbjad } from '../utils/abjad';
import ResultActions from './common/ResultActions';
import { AccordionItem } from './common/Accordion';
import ShareImageModal from './ShareImageModal';

interface QarinResultGuideProps {
    result: QarinResult;
    onBack: () => void;
}

const activeSigns = [
    { id: 's1', textKey: 'احساس ناگهانی خلاقیت یا دریافت ایده‌های جدید' },
    { id: 's2', textKey: 'دیدن رؤیاهای واضح و معنادار' },
    { id: 's3', textKey: 'احساس راهنمایی در تصمیم‌گیری‌ها' },
    { id: 's4', textKey: 'افزایش قدرت شهود و حس ششم' },
    { id: 's5', textKey: 'برخورد با نشانه‌ها و همزمانی‌های معنادار در زندگی روزمره' },
];

const dormantSigns = [
    { id: 'd1', textKey: 'احساس سردرگمی و عدم قطعیت در مسیر زندگی' },
    { id: 'd2', textKey: 'تکرار الگوهای اشتباه در روابط و تصمیمات' },
    { id: 'd3', textKey: 'احساس اضطراب یا بی‌قراری بی‌دلیل' },
    { id: 'd4', textKey: 'کاهش خلاقیت و انگیزه' },
    { id: 'd5', textKey: 'احساس جدایی از خود واقعی و شهود درونی' },
];

const AwakeningMethodCard: React.FC<{ icon: string; titleKey: string; children: React.ReactNode }> = ({ icon, titleKey, children }) => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50 flex flex-col h-full">
            <div className="flex items-center mb-4">
                <span className="text-4xl ml-4">{icon}</span>
                <h5 className="text-2xl font-lalezar text-indigo-300">{titleKey}</h5>
            </div>
            <div className="text-gray-300 font-tanha leading-relaxed">{children}</div>
        </div>
    );
};


const QarinResultGuide: React.FC<QarinResultGuideProps> = ({ result, onBack }) => {
    const qarinAbjad = calculateAbjad(result.qarinName);
    const [selectedSigns, setSelectedSigns] = useState<Set<string>>(new Set());
    const [isShareModalOpen, setShareModalOpen] = useState(false);

    const handleSignToggle = (id: string) => {
        setSelectedSigns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    
    const shareData: ShareData = {
        type: 'qarin',
        name: result.name,
        qarinName: result.qarinName,
        qarinAbjad: qarinAbjad,
    };
    
    const fullResultText = useMemo(() => `
تحلیل قرین برای ${result.name} فرزند ${result.motherName}
================================
نام قرین: ${result.qarinName} (ابجد: ${qarinAbjad})
عدد ریشه: ${result.rootNumber}
حروف استخراج شده: ${result.startLetter}, ${result.middleLetter}, ${result.finalLetter}
منطق ساخت نام: ${result.explanation}
================================
قرین چیست؟ قرین یا همزاد، سایه معنوی و بخش ناخودآگاه وجود ماست که تمامی تجربیات، خاطرات و توانایی‌های پنهان ما را در خود دارد. در علوم باطنی، قرین به عنوان یک راهنمای درونی عمل می‌کند. ارتباط با قرین به معنای پذیرش کامل خود، شناخت سایه‌ها و استفاده از تمام پتانسیل وجودی است. این ارتباط به افزایش شهود، خلاقیت و درک عمیق‌تر از مسیر زندگی منجر می‌شود.
================================
راهنمای بیداری:
1. ارتباط در رؤیا: قبل از خواب، قرین خود را با نامش صدا بزنید و از او بخواهید شما را در رؤیا راهنمایی کند. پاسخ‌ها ممکن است به صورت نمادین باشند.
2. مراقبه و تمرکز: در مکانی آرام بنشینید و روی نام قرین خود تمرکز کنید. این کار به هماهنگی ارتعاشات شما با فرکانس او کمک می‌کند.
3. توجه به نشانه‌ها: در طول روز به نشانه‌ها، اعداد تکراری یا همزمانی‌های معنادار توجه کنید. این‌ها می‌توانند پیام‌هایی از سوی قرین شما باشند.
4. ذکر کلیدی: برای تقویت ارتباط، ذکر «یا باطِن» را به تعداد ابجد نام قرین خود تکرار کنید. این ذکر به ارتباط با جنبه‌های پنهان وجود کمک می‌کند.
================================
آیا قرین خطرناک است؟ خیر، قرین بخشی از وجود خود شماست. ترس از آن، ناشی از عدم شناخت بخش‌های ناشناخته درون است. ارتباط با قرین، سفری برای خودشناسی است نه رویارویی با یک موجود بیگانه.
    `.trim(), [result, qarinAbjad]);


    return (
        <>
        <div className="space-y-12 animate-fade-in printable-content">
            {/* --- Header --- */}
            <div className="flex justify-between items-center border-b border-slate-700/50 pb-6">
                <div>
                    <h3 className="text-4xl font-lalezar text-indigo-300">{"راهنمای قرین"}</h3>
                    <p className="text-lg text-gray-400">{`برای ${result.name} فرزند ${result.motherName}`}</p>
                </div>
                <button onClick={onBack} className="flex items-center gap-2 text-gray-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/70 px-4 py-2 rounded-lg transition-colors print-actions">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    <span>{"محاسبه جدید"}</span>
                </button>
            </div>

            {/* --- Calculation Result --- */}
            <section className="text-center">
                <p className="text-gray-400 font-tanha text-lg mb-2">{"نام فرکانسی قرین شما"}:</p>
                <h2 className="text-7xl font-lalezar tracking-wider text-white mb-3" style={{ textShadow: '0 0 25px rgba(129, 140, 248, 0.7)' }}>
                    {result.qarinName}
                </h2>
                <div className="inline-block bg-slate-900/60 px-4 py-1 rounded-full border border-slate-600/50">
                    <span className="text-gray-400 text-sm ml-2">{"مقدار ابجد"}:</span>
                    <span className="font-roboto-mono text-amber-400 font-bold text-lg">{qarinAbjad}</span>
                </div>
                <div className="mt-6 text-indigo-200 font-tanha max-w-2xl mx-auto">
                    <p><strong className="text-indigo-300">{"منطق ساخت نام"}:</strong> {result.explanation}</p>
                    <p><strong className="text-indigo-300">{"بر اساس حروف"}:</strong> {result.startLetter} ({`از عدد ریشه ${result.rootNumber}`}) + {result.middleLetter} ({"از نام شخص"}) + {result.finalLetter} ({"از نام مادر"})</p>
                </div>
                <div className="text-center mt-8">
                    <button
                        onClick={() => setShareModalOpen(true)}
                        className="btn-animated-gradient text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 font-tanha shadow-lg shadow-indigo-500/40 hover:shadow-indigo-400/60 text-lg tracking-wider inline-flex items-center gap-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        {"دریافت لوح قرین"}
                    </button>
                </div>
            </section>
            
            {/* --- Philosophy Section --- */}
            <section className="p-6 bg-slate-800/40 rounded-lg">
                <h4 className="text-2xl font-lalezar text-cyan-300 mb-4 text-center">{"قرین چیست و چه اهمیتی دارد؟"}</h4>
                <div className="font-tanha text-gray-300 text-lg leading-relaxed space-y-3 prose prose-invert max-w-none">
                    <p>{"قرین یا همزاد، سایه معنوی و بخش ناخودآگاه وجود ماست که تمامی تجربیات، خاطرات و توانایی‌های پنهان ما را در خود دارد. در علوم باطنی، قرین به عنوان یک راهنمای درونی عمل می‌کند."}</p>
                    <p>{"ارتباط با قرین به معنای پذیرش کامل خود، شناخت سایه‌ها و استفاده از تمام پتانسیل وجودی است. این ارتباط به افزایش شهود، خلاقیت و درک عمیق‌تر از مسیر زندگی منجر می‌شود."}</p>
                </div>
            </section>
            
            {/* --- Status Checklist Section --- */}
            <section>
                <h4 className="text-2xl font-lalezar text-cyan-300 mb-4 text-center">{"بررسی وضعیت ارتباط با قرین"}</h4>
                <p className="text-center text-gray-400 font-tanha mb-8 max-w-3xl mx-auto">{"با انتخاب موارد زیر، می‌توانید وضعیت فعلی ارتباط خود با قرین را ارزیابی کنید."}</p>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h5 className="text-xl font-lalezar text-green-400 mb-4">{"نشانه‌های قرین فعال"}</h5>
                        <div className="space-y-3">
                            {activeSigns.map(item => (
                                <label key={item.id} className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors ${selectedSigns.has(item.id) ? 'bg-green-900/50' : 'bg-slate-800/50'}`}>
                                    <input type="checkbox" checked={selectedSigns.has(item.id)} onChange={() => handleSignToggle(item.id)} className="mt-1 ml-3 h-5 w-5 rounded bg-slate-700 border-slate-500 text-green-500 focus:ring-green-500"/>
                                    <span className="text-gray-200 font-tanha">{item.textKey}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                         <h5 className="text-xl font-lalezar text-red-400 mb-4">{"نشانه‌های قرین غیرفعال"}</h5>
                         <div className="space-y-3">
                            {dormantSigns.map(item => (
                                <label key={item.id} className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors ${selectedSigns.has(item.id) ? 'bg-red-900/50' : 'bg-slate-800/50'}`}>
                                    <input type="checkbox" checked={selectedSigns.has(item.id)} onChange={() => handleSignToggle(item.id)} className="mt-1 ml-3 h-5 w-5 rounded bg-slate-700 border-slate-500 text-red-500 focus:ring-red-500"/>
                                    <span className="text-gray-200 font-tanha">{item.textKey}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Awakening Guide --- */}
            <section>
                <h4 className="text-3xl font-lalezar text-cyan-300 mb-8 text-center">{"چهار کلید برای بیداری و ارتباط با قرین"}</h4>
                <div className="grid md:grid-cols-2 gap-8">
                    <AwakeningMethodCard icon="🛌" titleKey="ارتباط در رؤیا">
                        <p>{"قبل از خواب، قرین خود را با نامش صدا بزنید و از او بخواهید شما را در رؤیا راهنمایی کند. پاسخ‌ها ممکن است به صورت نمادین باشند."}:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>{"با وضو بخوابید."}</li>
                            <li>{"یک سؤال مشخص در ذهن داشته باشید."}</li>
                            <li>{"بعد از بیداری، رؤیای خود را یادداشت کنید."}</li>
                        </ul>
                    </AwakeningMethodCard>
                    <AwakeningMethodCard icon="💡" titleKey="مراقبه و تمرکز">
                         <p>{"در مکانی آرام بنشینید و روی نام قرین خود تمرکز کنید. این کار به هماهنگی ارتعاشات شما با فرکانس او کمک می‌کند."}</p>
                         <p className="font-semibold text-lg text-center my-2 text-indigo-200">{"«من با همزاد درونی‌ام در صلح و هماهنگی هستم.»"}</p>
                    </AwakeningMethodCard>
                    <AwakeningMethodCard icon="🎯" titleKey="توجه به نشانه‌ها">
                        <p>{"در طول روز به نشانه‌ها، اعداد تکراری یا همزمانی‌های معنادار توجه کنید. این‌ها می‌توانند پیام‌هایی از سوی قرین شما باشند."}</p>
                    </AwakeningMethodCard>
                    <AwakeningMethodCard icon="🔑" titleKey="ذکر کلیدی">
                        <p>{"برای تقویت ارتباط، ذکر زیر را به تعداد ابجد نام قرین خود تکرار کنید."}</p>
                        <div className="my-3 p-3 bg-slate-900/70 rounded-md text-center">
                            <p className="text-xl font-lalezar text-amber-300">{"یا باطِن"}</p>
                            <p className="text-sm text-gray-400 mt-1">{"(ای پنهان)"}</p>
                        </div>
                    </AwakeningMethodCard>
                </div>
            </section>

            {/* --- FAQ Section --- */}
            <section>
                 <h4 className="text-3xl font-lalezar text-cyan-300 mb-6 text-center">{"پرسش‌های متداول"}</h4>
                 <AccordionItem title={"آیا قرین همان جن است؟"}>
                    <p>{"خیر. در فرهنگ عامه این دو گاهی اشتباه گرفته می‌شوند، اما در علوم باطنی، قرین یک همزاد معنوی و بخشی از وجود خود فرد است، در حالی که جن موجودی مستقل در نظر گرفته می‌شود."}</p>
                 </AccordionItem>
                 <AccordionItem title={"آیا ارتباط با قرین خطرناک است؟"}>
                    <p>{"خیر، قرین بخشی از وجود خود شماست. ترس از آن، ناشی از عدم شناخت بخش‌های ناشناخته درون است. ارتباط با قرین، سفری برای خودشناسی است نه رویارویی با یک موجود بیگانه."}</p>
                 </AccordionItem>
                 <AccordionItem title={"اگر نام قرینم را دوست نداشته باشم چه؟"}>
                    <ul className="list-disc list-inside space-y-2">
                        <li>{"نام قرین یک «فرکانس» است، نه یک نام معمولی. هدف آن ایجاد هماهنگی است."}</li>
                        <li>{"به جای تمرکز بر ظاهر نام، به معنا و ارتعاش آن توجه کنید."}</li>
                        <li>{"با گذشت زمان و تقویت ارتباط، حس بهتری نسبت به این نام پیدا خواهید کرد."}</li>
                    </ul>
                 </AccordionItem>
            </section>
            
            <ResultActions textToCopy={fullResultText} />
        </div>
        {isShareModalOpen && (
            <ShareImageModal
                isOpen={isShareModalOpen}
                onClose={() => setShareModalOpen(false)}
                shareData={shareData}
            />
        )}
        </>
    );
};

export default QarinResultGuide;
