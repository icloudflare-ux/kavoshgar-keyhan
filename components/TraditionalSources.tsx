
import React from 'react';
import Card from './common/Card';

const TraditionalSources: React.FC = () => {
  
  const practicalTips = [
    { planet: "در ساعت قمر", recommendation: "نامه‌نگاری، فرستادن پیام و قاصد، آغاز سفر (به خصوص سفر آبی)، امور مربوط به زنان و خانواده." },
    { planet: "در ساعت زحل", recommendation: "کارهای ساختمانی، کشاورزی، امور مربوط به املاک و زمین، کارهایی که نیاز به صبر و پایداری دارند." },
    { planet: "در ساعت مشتری", recommendation: "خواستگاری و ازدواج، شروع کسب و کار، طلب علم، ملاقات با بزرگان و دانشمندان، امور مالی." },
    { planet: "در ساعت مریخ", recommendation: "امور جنگی و نظامی، کارهای نیازمند به شجاعت، حجامت و فصد (خون‌گیری)، کار با آهن و آتش." },
    { planet: "در ساعت شمس", recommendation: "دیدار با پادشاهان و حاکمان، درخواست از مقامات بالا، پوشیدن لباس نو، ساختن طلسمات مربوط به قدرت." },
    { planet: "در ساعت زهره", recommendation: "امور مربوط به عشق و ازدواج، تفریح و شادی، خرید عطر و لباس، امور هنری و زیبایی." },
    { planet: "در ساعت عطارد", recommendation: "آغاز تحصیل، نوشتن قرارداد، امور تجاری و حسابرسی، کارهای دقیق و نیازمند به تفکر." },
    { planet: "در روز قمر (دوشنبه)", recommendation: "این روز به طور کلی برای شروع کارها، سفر و امور عمومی سعد و نیکوست." },
  ];

  return (
    <section id="traditional-sources" role="region" aria-labelledby="traditional-sources-title">
      <h3 id="traditional-sources-title" className="text-4xl md:text-5xl font-bold text-center mb-12 font-lalezar tracking-wider bg-gradient-to-r from-yellow-400 to-amber-600 text-transparent bg-clip-text">
        {"مستندات و توصیه‌های سنتی"}
      </h3>
      <Card>
        <div className="prose prose-lg prose-invert max-w-none text-gray-300 prose-p:my-4 prose-headings:text-amber-400 leading-relaxed font-tanha prose-headings:font-lalezar prose-headings:tracking-wider prose-headings:text-2xl">
          <p>{"در متون کهن نجوم احکامی، توصیه‌های فراوانی برای انجام امور مختلف در ساعات و ایام منسوب به هر کوکب وجود دارد. این بخش خلاصه‌ای از این دستورالعمل‌ها را ارائه می‌دهد که از منابعی چون «عجایب‌المخلوقات» قزوینی و دیگر آثار منجمان اسلامی گردآوری شده است."}</p>
          <p>{"این توصیه‌ها بر اساس طبیعت ذاتی هر کوکب (سعد، نحس، ممتزج) و تأثیر آن بر امور زمینی بنا شده‌اند."}</p>

          <h4 className="!text-amber-300 mt-8">{"راهنمای کلی"}</h4>
          <ul className="list-disc list-inside space-y-2">
            <li>{"کارهای مهم و نیک را در ساعات و ایام سعد (مشتری و زهره) آغاز کنید."}</li>
            <li>{"از شروع امور اساسی در ساعات و ایام نحس (زحل و مریخ) بپرهیزید."}</li>
            <li>{"ساعات و ایام نیرین (شمس و قمر) و ممتزج (عطارد) بستگی به وضعیت آن‌ها در آسمان دارد، اما عموماً برای امور مرتبط با خودشان مناسبند."}</li>
          </ul>
          
          <h4 className="!text-amber-300 mt-8">{"توصیه‌های کاربردی"}</h4>
          <ul className="space-y-4">
            {practicalTips.map((tip, i) => (
              <li key={i} className="border-r-4 border-amber-500/50 pr-4 py-1">
                <strong className="font-semibold text-white">{tip.planet}:</strong> {tip.recommendation}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </section>
  );
};

export default TraditionalSources;
