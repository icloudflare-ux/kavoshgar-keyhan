import React, { useState, useEffect, useMemo } from 'react';
import { AccordionItem } from '../common/Accordion';
import { faqData } from '../../data/faqData';

type SupportView = 'faq' | 'ticket' | 'success';

// Hardcoded translations for FAQ
const faqTranslations: { [key: string]: string } = {
    'faq_category_account': 'حساب کاربری',
    'faq_q_premium': 'مزایای اشتراک پرمیوم چیست؟',
    'faq_a_premium': 'دسترسی به تمام ابزارهای تحلیلی پیشرفته مبتنی بر هوش مصنوعی مانند تحلیل کامل زایچه، تعبیر خواب، تحلیل روابط و محاسبات جفر.',
    'faq_q_password': 'رمز عبور خود را فراموش کرده‌ام. چه کار کنم؟',
    'faq_a_password': 'از طریق لینک «بازیابی رمز عبور» در صفحه ورود اقدام کنید. یک ایمیل برای شما ارسال خواهد شد.',
    'faq_category_tools': 'ابزارها و محاسبات',
    'faq_q_profile': 'چرا باید پروفایل بسازم؟',
    'faq_a_profile': 'ذخیره پروفایل به شما امکان می‌دهد تا اطلاعات خود (مانند نام، نام مادر، تاریخ تولد) را یک بار وارد کرده و در محاسبات مختلف به سرعت از آن استفاده کنید.',
    'faq_q_qarin': 'آیا محاسبه و ارتباط با قرین خطرناک است؟',
    'faq_a_qarin': 'خیر. در دیدگاه علوم باطنی، قرین بخشی از وجود خود شماست و ارتباط با آن سفری برای خودشناسی است، نه رویارویی با یک موجود بیگانه.',
    'faq_q_timezone': 'چرا تنظیم منطقه زمانی مهم است؟',
    'faq_a_timezone': 'برای محاسباتی که به زمان دقیق وابسته هستند (مانند ساعات سیارات و زایچه)، تنظیم صحیح منطقه زمانی برای به دست آوردن نتایج دقیق ضروری است.',
    'faq_category_concepts': 'مفاهیم',
    'faq_q_qamar': 'تفاوت دو روش محاسبه قمر در عقرب چیست؟',
    'faq_a_qamar': 'روش «بر اساس صورت فلکی» به موقعیت واقعی ماه در آسمان و در میان ستارگان صورت فلکی عقرب اشاره دارد. روش «بر اساس برج فلکی» به تقسیم‌بندی دوازده‌گانه و مساوی منطقةالبروج مربوط است. هر دو روش در سنت نجومی معتبر بوده و استفاده می‌شوند.',
    'faq_q_saad_nahs': 'آیا روزهای نحس واقعاً بد هستند؟',
    'faq_a_saad_nahs': '«نحس» به معنای «بد» مطلق نیست، بلکه به معنای انرژی سنگین‌تر و چالش‌برانگیزتر است. در این روزها احتیاط بیشتر، صدقه دادن و پرهیز از شروع کارهای بسیار مهم توصیه می‌شود، اما زندگی متوقف نمی‌شود.',
};

const t = (key: string) => faqTranslations[key] || key;


const SupportBeacon: React.FC<{ show: boolean; onClick: () => void }> = ({ show, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open support center"
      className={`fixed bottom-6 rtl:left-6 ltr:right-6 z-40 w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-indigo-500 ${show ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </button>
  );
};

const SupportPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [view, setView] = useState<SupportView>('faq');
    const [isClosing, setIsClosing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [ticketNumber, setTicketNumber] = useState('');

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
            // Reset to default view after closing animation is done
            setTimeout(() => setView('faq'), 100);
        }, 500);
    };
    
    // Reset view when panel is re-opened
    useEffect(() => {
      if (isOpen) {
        setView('faq');
      }
    }, [isOpen]);

    const filteredFaqData = useMemo(() => {
      if (!searchTerm) return faqData;
      return faqData.map(category => ({
          ...category,
          questions: category.questions.filter(q => 
              t(q.qKey).toLowerCase().includes(searchTerm.toLowerCase()) || 
              t(q.aKey).toLowerCase().includes(searchTerm.toLowerCase())
          )
      })).filter(category => category.questions.length > 0);
    }, [searchTerm]);

    const handleTicketSubmit = () => {
        // Simulate ticket number generation
        const newTicketNumber = `CE-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`;
        setTicketNumber(newTicketNumber);
        setView('success');
    };
    
    if (!isOpen && !isClosing) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>
            
            {/* Panel Content */}
            <div className={`w-full max-w-2xl mx-auto bg-[var(--color-card-bg)] border-t-2 border-indigo-500 rounded-t-2xl shadow-2xl ${isClosing ? 'animate-slide-out-down' : 'animate-slide-in-up'}`}>
                <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <h3 className="text-2xl font-lalezar text-gray-200">{"مرکز پشتیبانی"}</h3>
                    <button onClick={handleClose} className="p-2 rounded-full text-gray-400 hover:bg-slate-700 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 h-[70vh] overflow-y-auto">
                    {/* FAQ View */}
                    {view === 'faq' && (
                        <div className="animate-fade-in">
                            <h4 className="font-lalezar text-xl text-indigo-300 mb-4">{"پرسش‌های متداول"}</h4>
                            <input
                                type="text"
                                placeholder={"جستجو در پرسش‌ها..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-800/50 border-slate-600 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-indigo-500"
                            />
                            {filteredFaqData.map(category => (
                                <div key={category.categoryKey} className="mb-6">
                                    <h5 className="font-tanha font-bold text-lg text-gray-400 mb-2">{t(category.categoryKey)}</h5>
                                    {category.questions.map(q => (
                                        <AccordionItem key={q.qKey} title={t(q.qKey)}>
                                            <p className="whitespace-pre-line">{t(q.aKey)}</p>
                                        </AccordionItem>
                                    ))}
                                </div>
                            ))}
                             <div className="text-center mt-8 pt-6 border-t border-slate-700/50">
                                <p className="text-gray-400 mb-3">{"پاسخ خود را نیافتید؟"}</p>
                                <button onClick={() => setView('ticket')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">{"از کارشناس بپرسید"}</button>
                            </div>
                        </div>
                    )}
                    
                    {/* Ticket Form View */}
                    {view === 'ticket' && (
                        <div className="animate-fade-in">
                            <button onClick={() => setView('faq')} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                {"بازگشت به پرسش‌های متداول"}
                            </button>
                            <h4 className="font-lalezar text-xl text-indigo-300 mb-4">{"ارسال تیکت پشتیبانی"}</h4>
                            <div className="space-y-4">
                                <input type="text" placeholder={"موضوع"} className="w-full bg-slate-800/50 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500" />
                                <textarea placeholder={"توضیحات"} rows={8} className="w-full bg-slate-800/50 border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"></textarea>
                                <button onClick={handleTicketSubmit} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg">{"ارسال تیکت"}</button>
                            </div>
                        </div>
                    )}

                    {/* Success View */}
                    {view === 'success' && (
                        <div className="animate-fade-in text-center flex flex-col items-center justify-center h-full">
                            <span className="text-6xl mb-4">✅</span>
                            <h4 className="font-lalezar text-2xl text-green-400 mb-2">{"موفقیت‌آمیز بود"}</h4>
                            <p className="text-gray-300 font-tanha max-w-sm mb-6">{"تیکت شما با موفقیت ارسال شد. کارشناسان ما به زودی پاسخ خواهند داد."}</p>
                            <div className="bg-slate-800/60 p-3 rounded-lg">
                                <span className="text-gray-400">{"شماره پیگیری"}:</span>
                                <strong className="font-roboto-mono text-amber-400 text-lg ml-2">{ticketNumber}</strong>
                            </div>
                            <button onClick={handleClose} className="mt-8 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-lg">{"بستن"}</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main exported component ---

const SupportCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBeacon, setShowBeacon] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show beacon after user scrolls down a bit
      if (window.scrollY > 300) {
        setShowBeacon(true);
      } else {
        setShowBeacon(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Allow closing with Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <SupportBeacon show={showBeacon} onClick={() => setIsOpen(true)} />
      <SupportPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default SupportCenter;
