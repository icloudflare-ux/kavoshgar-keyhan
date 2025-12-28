import React from 'react';
import Card from './common/Card';

const InfoBlock: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 h-full flex flex-col">
        <div className="flex items-center mb-4">
            <span className="text-4xl ml-4">{icon}</span>
            <h4 className="text-2xl font-lalezar text-indigo-300">{title}</h4>
        </div>
        <div className="font-tanha text-gray-300 leading-relaxed space-y-3">{children}</div>
    </div>
);

const WhyUsSection: React.FC = () => {
  return (
    <section id="why-us" role="region" aria-labelledby="why-us-title">
      <h3 id="why-us-title" className="text-4xl md:text-5xl font-bold text-center mb-4 font-lalezar tracking-wider bg-gradient-to-r from-cyan-400 to-emerald-400 text-transparent bg-clip-text">
        {"چرا کاوشگر کیهان؟"}
      </h3>
      <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto font-tanha text-lg leading-relaxed">
        {"راهنمای شما در کیهان درون: از حکمت باستان تا بصیرت مدرن."}
      </p>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoBlock icon="🧭" title={"اینجا برای چه کسانی است؟"}>
            <p>{"برای جویندگان حقیقت، علاقه‌مندان به تاریخ و علوم باستانی، و هر کسی که در بزنگاه‌های زندگی به دنبال نگاهی عمیق‌تر برای خودشناسی است."}</p>
          </InfoBlock>
          
          <InfoBlock icon="🧰" title={"چه چیزی ارائه می‌دهیم؟"}>
            <p>{"مجموعه‌ای از ابزارهای دقیق برای خودشناسی (مانند رب‌الطالع و قرین)، زمان‌سنجی (مانند ساعات سیارات)، علوم باستانی (جفر و رمل) و یک مشاور هوش مصنوعی برای تعبیر خواب و تحلیل روابط."}</p>
          </InfoBlock>
          
          <InfoBlock icon="💡" title={"کاربرد در زندگی روزمره"}>
            <p>{"این دانش به شما کمک می‌کند تا تصمیمات بهتری بگیرید، روابط خود را عمیق‌تر درک کنید، انرژی شخصی خود را مدیریت کرده و بهترین زمان‌ها را برای اقدامات مهم زندگی‌تان انتخاب کنید."}</p>
          </InfoBlock>

          <InfoBlock icon="🔑" title={"مزایای عضویت"}>
            <p>{"با ثبت‌نام می‌توانید پروفایل‌های خود را ذخیره کرده، به داشبورد کیهانی شخصی‌سازی شده دسترسی داشته باشید و تمام ابزارهای پیشرفته و پرمیوم مبتنی بر هوش مصنوعی را باز کنید."}</p>
          </InfoBlock>
        </div>
      </Card>
    </section>
  );
};

export default WhyUsSection;
