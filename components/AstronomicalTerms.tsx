
import React, { useRef } from 'react';
import Card from './common/Card';
import useUnlockOnScroll from '../hooks/useUnlockOnScroll';

const AstronomicalTerms: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useUnlockOnScroll(sectionRef, 'medical_astrology');

  return (
    <section id="terms" ref={sectionRef} role="region" aria-labelledby="terms-title">
      <h3 id="terms-title" className="text-4xl md-text-5xl font-bold text-center mb-12 font-lalezar tracking-wider bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
        {"اصطلاحات نجومی"}
      </h3>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <h4 className="text-2xl font-lalezar text-teal-300 mb-3">{"طالع (Ascendant)"}</h4>
          <p className="text-gray-300 font-tanha leading-relaxed flex-grow">
            {"طالع یا برج صاعد، برجی است که در لحظه تولد در افق شرقی در حال طلوع بوده است. این مهم‌ترین بخش نمودار تولد است و نشان‌دهنده شخصیت بیرونی، ظاهر فیزیکی و مسیر کلی زندگی فرد است."}
          </p>
        </Card>
        <Card className="flex flex-col">
          <h4 className="text-2xl font-lalezar text-teal-300 mb-3">{"کوکب حاکم (Ruler)"}</h4>
          <p className="text-gray-300 font-tanha leading-relaxed flex-grow">
            {"هر برج فلکی توسط یک کوکب (سیاره) خاص اداره می‌شود که به آن «کوکب حاکم» می‌گویند. این کوکب تأثیر زیادی بر ویژگی‌های آن برج دارد. برای مثال، حاکم برج حمل، مریخ است که انرژی جنگجویی و شجاعت را به آن می‌دهد."}
          </p>
        </Card>
        <Card className="flex flex-col">
          <h4 className="text-2xl font-lalezar text-teal-300 mb-3">{"طبع (Nature)"}</h4>
          <p className="text-gray-300 font-tanha leading-relaxed flex-grow">
            {"در طب و نجوم سنتی، هر برج دارای یک طبع مشخص (گرم، سرد، خشک، مرطوب) است که از ترکیب عناصر اربعه (آتش، خاک، هوا، آب) به وجود می‌آید. این طبایع بر ویژگی‌های شخصیتی و حتی فیزیولوژیکی فرد تأثیرگذارند."}
          </p>
        </Card>
        <Card className="flex flex-col">
          <h4 className="text-2xl font-lalezar text-teal-300 mb-3">{"شرف و وبال (Dignities)"}</h4>
          <div className="text-gray-300 font-tanha leading-relaxed flex-grow">
            <p>{"هر کوکب در برخی برج‌ها قدرتمندتر و در برخی دیگر ضعیف‌تر عمل می‌کند. به این حالات، «شرف و وبال» یا Dignities می‌گویند."}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li dangerouslySetInnerHTML={{ __html: '<strong>شرف (Exaltation):</strong> نقطه‌ای که یک کوکب به اوج قدرت معنوی خود می‌رسد.' }} />
              <li dangerouslySetInnerHTML={{ __html: '<strong>هبوط (Fall):</strong> نقطه مقابل شرف که کوکب در ضعیف‌ترین حالت خود قرار دارد.' }} />
              <li dangerouslySetInnerHTML={{ __html: '<strong>وبال (Detriment):</strong> برجی که مقابل خانه اصلی کوکب است و در آن احساس بیگانگی و ضعف می‌کند.' }} />
            </ul>
          </div>
        </Card>
        <Card className="flex flex-col">
          <h4 className="text-2xl font-lalezar text-teal-300 mb-3">{"کواکب علوی و سفلی"}</h4>
          <div className="text-gray-300 font-tanha leading-relaxed flex-grow">
            <p>{"در نجوم بطلمیوسی، سیارات بر اساس سرعت حرکت و فاصله ظاهری از زمین به دو دسته تقسیم می‌شوند."}</p>
            <h5 className="text-xl font-lalezar text-teal-400 mt-4 mb-2">{"طبقه‌بندی کواکب"}</h5>
            <p>{"این دسته‌بندی به تحلیل ارتباط سیارات با خورشید و تأثیرات آن‌ها کمک می‌کند."}</p>
            <div className="mt-4">
              <h6 className="font-semibold text-cyan-400">{"کواکب سفلی (Inferior Planets)"}</h6>
              <ul className="list-disc list-inside mt-2 space-y-1 pr-4" dangerouslySetInnerHTML={{ __html: '<li><strong>ماه، عطارد، زهره</strong></li><li>این سیارات بین زمین و خورشید قرار دارند و سرعت حرکتشان بیشتر است.</li>' }}/>
            </div>
            <div className="mt-4">
              <h6 className="font-semibold text-cyan-400">{"کواکب علوی (Superior Planets)"}</h6>
              <ul className="list-disc list-inside mt-2 space-y-1 pr-4" dangerouslySetInnerHTML={{ __html: '<li><strong>مریخ، مشتری، زحل</strong></li><li>این سیارات خارج از مدار زمین قرار دارند و حرکت کندتری دارند.</li>' }} />
            </div>
            <h5 className="text-xl font-lalezar text-teal-400 mt-6 mb-2">{"اساس فلسفی"}</h5>
            <ul className="list-disc list-inside space-y-2 mt-2" dangerouslySetInnerHTML={{ __html: '<li>کواکب سفلی به امور درونی، ذهنی و احساسی مرتبطند.</li><li>کواکب علوی به امور بیرونی، اجتماعی و ساختاری مربوط می‌شوند.</li>' }} />
          </div>
        </Card>
        <Card className="flex flex-col">
          <h4 className="text-2xl font-lalezar text-teal-300 mb-3">{"سعد و نحس (Auspicious & Inauspicious)"}</h4>
          <div className="text-gray-300 font-tanha leading-relaxed flex-grow">
              <p className="italic mb-4">{"در نجوم احکامی، هر یک از هفت کوکب سیار دارای یک کیفیت ذاتی سعد (نیک)، نحس (بد) یا ممتزج (ترکیبی) هستند."}</p>
              
              <h5 className="text-xl font-lalezar text-teal-400 mt-4 mb-2">{"هفت کوکب سیار"}</h5>
              <div className="mt-2 space-y-4 text-gray-400">
                  <div>
                      <h6 className="font-semibold text-red-400/90">{"نحسین (Malefics)"}</h6>
                      <ul className="list-disc list-inside mt-2 space-y-1 pr-4" dangerouslySetInnerHTML={{ __html: '<li><strong>زحل (نحس اکبر):</strong> نماد محدودیت، سختی و انضباط.</li><li><strong>مریخ (نحس اصغر):</strong> نماد درگیری، تندی و انرژی.</li>' }} />
                  </div>
                  <div>
                      <h6 className="font-semibold text-green-400/90">{"سعدین (Benefics)"}</h6>
                      <ul className="list-disc list-inside mt-2 space-y-1 pr-4" dangerouslySetInnerHTML={{ __html: '<li><strong>مشتری (سعد اکبر):</strong> نماد شانس، گسترش و فراوانی.</li><li><strong>زهره (سعد اصغر):</strong> نماد عشق، زیبایی و لذت.</li>' }} />
                  </div>
                    <div>
                      <h6 className="font-semibold text-gray-300/90">{"نیرین (Luminaries)"}</h6>
                      <ul className="list-disc list-inside mt-2 space-y-1 pr-4" dangerouslySetInnerHTML={{ __html: '<li><strong>خورشید و ماه:</strong> ذاتاً سعد هستند اما تأثیرشان به وضعیتشان بستگی دارد.</li>' }} />
                    </div>
                  <div>
                      <h6 className="font-semibold text-yellow-400/90">{"ممتزج (Neutral)"}</h6>
                      <ul className="list-disc list-inside mt-2 space-y-1 pr-4" dangerouslySetInnerHTML={{ __html: '<li><strong>عطارد:</strong> کیفیت آن به کوکبی که با آن در ارتباط است بستگی دارد (سعد با سعدین، نحس با نحسین).</li>' }} />
                  </div>
              </div>

              <h5 className="text-xl font-lalezar text-teal-400 mt-6 mb-2">{"جدول خلاصه"}</h5>
              <div className="overflow-x-auto mt-4">
                  <table className="w-full text-center border-collapse border border-slate-700">
                      <thead>
                          <tr className="bg-slate-800/50">
                              <th className="border border-slate-600 p-2 font-lalezar">{"کوکب"}</th>
                              <th className="border border-slate-600 p-2 font-lalezar">{"نماد"}</th>
                              <th className="border border-slate-600 p-2 font-lalezar">{"کیفیت"}</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr className="bg-slate-900/30"><td className="border border-slate-700 p-2">{"زحل"}</td><td className="border border-slate-700 p-2"><svg className="w-6 h-6 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 100-18 9 9 0 000 18z"/><path d="M12 3v18"/><path d="M18 9H6"/></svg></td><td className="border border-slate-700 p-2 font-bold text-red-400">{"نحس اکبر"}</td></tr>
                          <tr><td className="border border-slate-700 p-2">{"مریخ"}</td><td className="border border-slate-700 p-2"><svg className="w-6 h-6 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><path d="M17 7l-10 10"/><path d="M17 12V7h-5"/></svg></td><td className="border border-slate-700 p-2 font-bold text-red-400">{"نحس اصغر"}</td></tr>
                          <tr className="bg-slate-900/30"><td className="border border-slate-700 p-2">{"مشتری"}</td><td className="border border-slate-700 p-2"><svg className="w-6 h-6 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13.67V21"/><path d="M6 13.67V21"/><path d="M12 7v14"/><path d="M6 7h12"/></svg></td><td className="border border-slate-700 p-2 font-bold text-green-400">{"سعد اکبر"}</td></tr>
                          <tr><td className="border border-slate-700 p-2">{"زهره"}</td><td className="border border-slate-700 p-2"><svg className="w-6 h-6 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="6"/><path d="M12 15v9"/><path d="M9 18h6"/></svg></td><td className="border border-slate-700 p-2 font-bold text-green-400">{"سعد اصغر"}</td></tr>
                          <tr className="bg-slate-900/30"><td className="border border-slate-700 p-2">{"خورشید"}</td><td className="border border-slate-700 p-2"><svg className="w-6 h-6 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg></td><td className="border border-slate-700 p-2 font-bold text-gray-300">{"نیر اعظم"}</td></tr>
                          <tr><td className="border border-slate-700 p-2">{"ماه"}</td><td className="border border-slate-700 p-2"><svg className="w-6 h-6 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg></td><td className="border border-slate-700 p-2 font-bold text-gray-300">{"نیر اصغر"}</td></tr>
                          <tr className="bg-slate-900/30"><td className="border border-slate-700 p-2">{"عطارد"}</td><td className="border border-slate-700 p-2"><svg className="w-6 h-6 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="6"/><path d="M12 15v9"/><path d="M9 18h6"/><path d="M12 3a3 3 0 100-6 3 3 0 000 6z"/></svg></td><td className="border border-slate-700 p-2 font-bold text-yellow-400">{"ممتزج"}</td></tr>
                      </tbody>
                  </table>
              </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AstronomicalTerms;
