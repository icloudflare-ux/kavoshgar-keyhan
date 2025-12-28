import React, { useRef } from 'react';
import Card from './common/Card';
import useUnlockOnScroll from '../hooks/useUnlockOnScroll';

const SectionCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 h-full">
        <div className="flex items-center mb-4">
            <span className="text-4xl ml-4">{icon}</span>
            <h3 className="text-3xl font-lalezar text-indigo-300">{title}</h3>
        </div>
        <div className="font-tanha text-gray-300 leading-relaxed space-y-3 prose prose-invert max-w-none">
            {children}
        </div>
    </div>
);

const AstrologyInDepth: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useUnlockOnScroll(sectionRef, 'islamic_golden_age');

  return (
    <section id="astrology-in-depth" ref={sectionRef} role="region" aria-labelledby="in-depth-title">
      <h2 id="in-depth-title" className="text-4xl md:text-5xl font-bold text-center mb-4 font-lalezar tracking-wider bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
        {"مفاهیم عمیق در نجوم احکامی"}
      </h2>
      <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto font-tanha text-lg leading-relaxed">
        {"درک بهتر زبان آسمان: سفری به دنیای خانه‌ها، زوایا و جایگاه سیارات برای تحلیلی عمیق‌تر."}
      </p>

      <div className="space-y-12">
        <Card>
          <SectionCard icon="🏠" title={"خانه‌های دوازده‌گانه"}>
            <p>{"چارت تولد به ۱۲ بخش تقسیم می‌شود که به آنها «خانه» می‌گویند. هر خانه نماینده یک حوزه خاص از زندگی است. سیاراتی که در هر خانه قرار می‌گیرند، انرژی خود را در آن حوزه متمرکز می‌کنند."}</p>
            <p>{"مهم‌ترین خانه‌ها عبارتند از:"}</p>
            <ul className="list-disc list-inside">
              <li><strong>{"خانه اول (طالع):"}</strong> {"شخصیت ظاهری، هویت فردی و نحوه شروع کارها."}</li>
              <li><strong>{"خانه چهارم (IC):"}</strong> {"ریشه‌ها، خانواده، خانه و احساس امنیت درونی."}</li>
              <li><strong>{"خانه هفتم (مقابل طالع):"}</strong> {"روابط یک به یک، ازدواج و شراکت‌های مهم."}</li>
              <li><strong>{"خانه دهم (MC):"}</strong> {"شغل، جایگاه اجتماعی، شهرت و اهداف بلندمدت."}</li>
            </ul>
          </SectionCard>
        </Card>

        <Card>
          <SectionCard icon="📐" title={"زوایای اصلی (Aspects)"}>
            <p>{"زوایا، فواصل زاویه‌ای بین سیارات در چارت تولد هستند. آنها نشان می‌دهند که انرژی‌های دو سیاره چگونه با یکدیگر تعامل می‌کنند: به صورت هماهنگ یا چالش‌برانگیز."}</p>
            <div className="overflow-x-auto mt-4">
                <table className="w-full text-center border-collapse">
                    <thead>
                        <tr className="bg-slate-800/50">
                            <th className="border border-slate-600 p-2">{"زاویه"}</th>
                            <th className="border border-slate-600 p-2">{"درجه"}</th>
                            <th className="border border-slate-600 p-2">{"نوع"}</th>
                            <th className="border border-slate-600 p-2">{"تفسیر"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td className="border border-slate-700 p-2 text-cyan-400">{"قران (Conjunction)"}</td><td className="border border-slate-700 p-2">0°</td><td className="border border-slate-700 p-2">خنثی</td><td className="border border-slate-700 p-2">ادغام و تقویت انرژی‌ها</td></tr>
                        <tr><td className="border border-slate-700 p-2 text-green-400">{"تثلیث (Trine)"}</td><td className="border border-slate-700 p-2">120°</td><td className="border border-slate-700 p-2">هماهنگ</td><td className="border border-slate-700 p-2">جریان آسان انرژی، استعداد ذاتی</td></tr>
                        <tr><td className="border border-slate-700 p-2 text-green-400">{"تسدیس (Sextile)"}</td><td className="border border-slate-700 p-2">60°</td><td className="border border-slate-700 p-2">هماهنگ</td><td className="border border-slate-700 p-2">فرصت و پتانسیل برای همکاری</td></tr>
                        <tr><td className="border border-slate-700 p-2 text-red-400">{"تربیع (Square)"}</td><td className="border border-slate-700 p-2">90°</td><td className="border border-slate-700 p-2">چالش‌برانگیز</td><td className="border border-slate-700 p-2">تنش، مانع و نیاز به اقدام</td></tr>
                        <tr><td className="border border-slate-700 p-2 text-red-400">{"مقابله (Opposition)"}</td><td className="border border-slate-700 p-2">180°</td><td className="border border-slate-700 p-2">چالش‌برانگیز</td><td className="border border-slate-700 p-2">کشمکش، نیاز به تعادل و آگاهی</td></tr>
                    </tbody>
                </table>
            </div>
          </SectionCard>
        </Card>

        <Card>
          <SectionCard icon="👑" title={"جایگاه سیارات (Dignities)"}>
            <p>{"هر سیاره در برخی برج‌ها احساس قدرت و راحتی می‌کند و در برخی دیگر ضعیف و ناراحت است. این وضعیت‌ها که «حیثیات» یا Dignities نامیده می‌شوند، بر کیفیت عملکرد سیاره تأثیر می‌گذارارند."}</p>
            <ul>
              <li><strong>{"حاکمیت (Rulership):"}</strong> {"سیاره در خانه خود است و با تمام قدرت عمل می‌کند (مانند مریخ در برج حمل)."}</li>
              <li><strong>{"شرف (Exaltation):"}</strong> {"سیاره مهمان افتخاری است و انرژی آن به شکلی متعالی و قدرتمند بروز می‌کند (مانند خورشید در برج حمل)."}</li>
              <li><strong>{"وبال (Detriment):"}</strong> {"سیاره در برج مقابل خانه خود قرار دارد و احساس بیگانگی و ضعف می‌کند (مانند زهره در برج حمل)."}</li>
              <li><strong>{"هبوط (Fall):"}</strong> {"سیاره در ضعیف‌ترین و آسیب‌پذیرترین حالت خود قرار دارد و انرژی آن سرکوب می‌شود (مانند زحل در برج حمل)."}</li>
            </ul>
          </SectionCard>
        </Card>
      </div>
    </section>
  );
};

export default AstrologyInDepth;
